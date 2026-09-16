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

    const updated = await prisma.transportRoute.update({
      where: { id },
      data: {
        ...(body.origin !== undefined && { origin: body.origin.trim() }),
        ...(body.destination !== undefined && { destination: body.destination.trim() }),
        ...(body.routeTitle !== undefined && { routeTitle: body.routeTitle.trim() }),
        ...(body.via !== undefined && { via: body.via.trim() }),
        ...(body.distance !== undefined && { distance: body.distance.trim() }),
        ...(body.duration !== undefined && { duration: body.duration.trim() }),
        ...(body.startingPrice !== undefined && { startingPrice: Number(body.startingPrice) }),
        ...(body.highlights !== undefined && { highlights: body.highlights }),
        ...(body.cabs !== undefined && { cabs: body.cabs.trim() }),
        ...(body.isPopular !== undefined && { isPopular: Boolean(body.isPopular) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
      },
    });

    return NextResponse.json({ success: true, route: updated });
  } catch (err) {
    console.error('[API /api/admin/transport/routes/[id] PUT] Error:', err);
    return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.transportRoute.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /api/admin/transport/routes/[id] DELETE] Error:', err);
    return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
  }
}
