import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { deleteGalleryCategory } from '@/lib/gallery-categories-service';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || id === 'all') {
      return NextResponse.json({ error: 'Cannot delete default category' }, { status: 400 });
    }

    const ok = await deleteGalleryCategory(id);
    if (!ok) {
      return NextResponse.json({ error: 'Category not found or could not be deleted' }, { status: 404 });
    }

    try {
      revalidateTag('gallery', 'max');
      revalidatePath('/');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err) {
    console.error('[API /api/admin/gallery/categories/[id] DELETE] Error:', err);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
