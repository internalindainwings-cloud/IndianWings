import { NextResponse } from 'next/server';
import { deleteGalleryCategory } from '@/lib/gallery-categories-service';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || id === 'all') {
      return NextResponse.json({ error: 'Cannot delete default category' }, { status: 400 });
    }

    const ok = await deleteGalleryCategory(id);
    if (!ok) {
      return NextResponse.json({ error: 'Category not found or could not be deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('[API /api/admin/gallery/categories/[id] DELETE] Error:', err);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
