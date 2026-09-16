import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.customerReview.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.city !== undefined && { city: body.city.trim() }),
        ...(body.review !== undefined && { review: body.review.trim() }),
        ...(body.rating !== undefined && { rating: Number(body.rating) }),
        ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl ? body.avatarUrl.trim() : null }),
        ...(body.type !== undefined && { type: body.type }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl ? body.videoUrl.trim() : null }),
        ...(body.videoDuration !== undefined && { videoDuration: body.videoDuration ? body.videoDuration.trim() : null }),
        ...(body.videoQuote !== undefined && { videoQuote: body.videoQuote ? body.videoQuote.trim() : null }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl ? body.imageUrl.trim() : null }),
        ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
      },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (err) {
    console.error('[API /api/admin/reviews/[id] PUT] Error:', err);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.customerReview.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /api/admin/reviews/[id] DELETE] Error:', err);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
