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

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.slug !== undefined && { slug: body.slug.trim().toLowerCase() }),
        ...(body.location !== undefined && { location: body.location.trim() }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.duration !== undefined && { duration: body.duration.trim() }),
        ...(body.difficulty !== undefined && { difficulty: body.difficulty.trim() }),
        ...(body.season !== undefined && { season: body.season.trim() }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl.trim() }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.badge !== undefined && { badge: body.badge ? body.badge.trim() : null }),
        ...(body.priceFrom !== undefined && { priceFrom: Number(body.priceFrom) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
      },
    });

    return NextResponse.json({ success: true, activity: updated });
  } catch (err) {
    console.error('[API /api/admin/activities/[id] PUT] Error:', err);
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.activity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /api/admin/activities/[id] DELETE] Error:', err);
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 });
  }
}
