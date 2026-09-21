import { NextRequest, NextResponse } from 'next/server';
import { updateGalleryItem, deleteGalleryItem } from '@/lib/gallery-service';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateGalleryItem(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteGalleryItem(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
