import { NextRequest, NextResponse } from 'next/server';
import { getAllGalleryItems, createGalleryItem } from '@/lib/gallery-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await getAllGalleryItems();
    return NextResponse.json({ success: true, items });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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

    return NextResponse.json({ success: true, item: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
