import { NextResponse } from 'next/server';
import { getAllGalleryCategories, addGalleryCategory } from '@/lib/gallery-categories-service';

export async function GET() {
  try {
    const categories = await getAllGalleryCategories();
    return NextResponse.json({ success: true, categories });
  } catch (err) {
    console.error('[API /api/admin/gallery/categories GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const created = await addGalleryCategory({
      name: body.name.trim(),
      icon: body.icon?.trim() || '🏷️',
      id: body.id?.trim(),
    });

    return NextResponse.json({ success: true, category: created });
  } catch (err) {
    console.error('[API /api/admin/gallery/categories POST] Error:', err);
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  }
}
