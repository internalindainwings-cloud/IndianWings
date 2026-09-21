import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Force dynamic execution for API uploads
export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Ensure directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Validate allowed file extensions
    const originalName = file.name || 'upload';
    const ext = path.extname(originalName).toLowerCase();
    const allowedExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
      '.svg',
      '.mp4',
      '.webm',
      '.mov',
      '.m4v',
    ];

    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file extension (${ext}). Allowed: ${allowedExtensions.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Sanitize and generate unique safe filename
    const baseCleanName = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const uniqueFilename = `${Date.now()}_${baseCleanName}${ext}`;
    const destinationPath = path.join(UPLOAD_DIR, uniqueFilename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(destinationPath, buffer);

    const publicUrl = `/uploads/gallery/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      size: file.size,
      type: ext === '.mp4' || ext === '.webm' || ext === '.mov' || ext === '.m4v' ? 'video' : 'image',
    });
  } catch (err: any) {
    console.error('[Upload API] Failed to process upload:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'File upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
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
  } catch (err: any) {
    console.error('[Upload API] Failed to delete file:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'File deletion failed' },
      { status: 500 }
    );
  }
}
