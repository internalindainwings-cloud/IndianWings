import { NextResponse } from 'next/server';
import { getAllGalleryCategories } from '@/lib/gallery-categories-service';

export async function GET() {
  try {
    const categories = await getAllGalleryCategories();
    return NextResponse.json({ success: true, categories });
  } catch (err) {
    console.error('[API /api/gallery/categories] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
