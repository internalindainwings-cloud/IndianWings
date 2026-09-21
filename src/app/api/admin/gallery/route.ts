import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getAllGalleryItems, createGalleryItem } from '@/lib/gallery-service';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await getAllGalleryItems();
    return NextResponse.json({ success: true, items });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.url) {
      return NextResponse.json({ success: false, error: 'Title and Media URL are required' }, { status: 400 });
    }

    const type = body.type === 'video' ? 'video' : 'image';
    const posterUrl = body.posterUrl || body.url;

    const created = await createGalleryItem({
      title: body.title,
      type,
      url: body.url,
      posterUrl,
      category: body.category || 'all',
      categoryLabel: body.categoryLabel || 'Kashmir Highlight',
      location: body.location || 'Kashmir Valley',
      duration: body.duration || '',
      caption: body.caption || '',
      isFeatured: body.isFeatured ?? true,
      isActive: body.isActive ?? true,
    });

    try {
      revalidateTag('gallery', 'max');
      revalidatePath('/');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: true, item: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
