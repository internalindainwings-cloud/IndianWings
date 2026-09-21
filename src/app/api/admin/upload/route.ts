import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';

// Force dynamic execution for API uploads
export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery');

const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15 MB
const MAX_VIDEO_SIZE = 60 * 1024 * 1024; // 60 MB

const ALLOWED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ALLOWED_VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.m4v']);

const ALLOWED_IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_VIDEO_MIMES = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v', 'video/mp4v-es']);

function isValidMediaBuffer(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 12) return false;

  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case '.png':
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
      );
    case '.webp':
      return (
        buffer.toString('ascii', 0, 4) === 'RIFF' &&
        buffer.toString('ascii', 8, 12) === 'WEBP'
      );
    case '.mp4':
    case '.mov':
    case '.m4v': {
      const box = buffer.toString('ascii', 4, 8);
      return box === 'ftyp' || box === 'moov' || box === 'wide' || box === 'mdat';
    }
    case '.webm':
      return (
        buffer[0] === 0x1a &&
        buffer[1] === 0x45 &&
        buffer[2] === 0xdf &&
        buffer[3] === 0xa3
      );
    default:
      return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const originalName = file.name || 'upload';
    const ext = path.extname(originalName).toLowerCase();

    // Reject SVGs and script/executable extensions explicitly
    if (ext === '.svg') {
      return NextResponse.json(
        { success: false, error: 'SVG uploads are not permitted for security reasons.' },
        { status: 400 }
      );
    }

    const isImage = ALLOWED_IMAGE_EXTENSIONS.has(ext);
    const isVideo = ALLOWED_VIDEO_EXTENSIONS.has(ext);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file extension (${ext}). Allowed: jpg, jpeg, png, webp, mp4, webm, mov, m4v`,
        },
        { status: 400 }
      );
    }

    // Size check
    const maxAllowedSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxAllowedSize) {
      const maxMb = Math.round(maxAllowedSize / (1024 * 1024));
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the allowed limit of ${maxMb}MB.`,
        },
        { status: 400 }
      );
    }

    // MIME type check
    const mime = (file.type || '').toLowerCase();
    if (mime) {
      const isAllowedMime = isImage ? ALLOWED_IMAGE_MIMES.has(mime) : ALLOWED_VIDEO_MIMES.has(mime);
      if (!isAllowedMime) {
        return NextResponse.json(
          { success: false, error: `Invalid MIME type (${mime}) for extension ${ext}.` },
          { status: 400 }
        );
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Magic bytes verification to prevent masquerading scripts/binaries
    if (!isValidMediaBuffer(buffer, ext)) {
      return NextResponse.json(
        { success: false, error: 'File content does not match the expected media format signature.' },
        { status: 400 }
      );
    }

    // Ensure directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Sanitize and generate unique safe filename
    const baseCleanName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const uniqueFilename = `${Date.now()}_${baseCleanName}${ext}`;
    const destinationPath = path.join(UPLOAD_DIR, uniqueFilename);

    await fs.writeFile(destinationPath, buffer);

    const publicUrl = `/uploads/gallery/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      size: file.size,
      type: isVideo ? 'video' : 'image',
    });
  } catch (err) {
    console.error('[Upload API] Failed to process upload:', err);
    return NextResponse.json(
      { success: false, error: 'File upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const targetUrl = body.url;

    if (!targetUrl || typeof targetUrl !== 'string') {
      return NextResponse.json({ success: false, error: 'File URL is required' }, { status: 400 });
    }

    // Security check: only permit deleting files located in /uploads/gallery/
    if (!targetUrl.startsWith('/uploads/gallery/')) {
      return NextResponse.json(
        { success: false, error: 'Only local uploaded files in /uploads/gallery/ can be deleted directly.' },
        { status: 400 }
      );
    }

    const filename = path.basename(targetUrl);
    const targetPath = path.join(UPLOAD_DIR, filename);

    const resolvedUploadDir = path.resolve(UPLOAD_DIR).toLowerCase();
    const resolvedTargetPath = path.resolve(targetPath).toLowerCase();

    // Make sure resolved path is strictly within UPLOAD_DIR
    if (!resolvedTargetPath.startsWith(resolvedUploadDir)) {
      return NextResponse.json({ success: false, error: 'Invalid file path' }, { status: 403 });
    }

    await fs.unlink(targetPath).catch(() => {});

    return NextResponse.json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    console.error('[Upload API] Failed to delete file:', err);
    return NextResponse.json(
      { success: false, error: 'File deletion failed' },
      { status: 500 }
    );
  }
}
