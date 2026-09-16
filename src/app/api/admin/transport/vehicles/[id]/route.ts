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

    const updated = await prisma.transportVehicle.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.slug !== undefined && { slug: body.slug.trim().toLowerCase() }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.seats !== undefined && { seats: body.seats.trim() }),
        ...(body.bags !== undefined && { bags: body.bags.trim() }),
        ...(body.ac !== undefined && { ac: body.ac.trim() }),
        ...(body.fuel !== undefined && { fuel: body.fuel.trim() }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl.trim() }),
        ...(body.pricePerDay !== undefined && { pricePerDay: Number(body.pricePerDay) }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.badge !== undefined && { badge: body.badge ? body.badge.trim() : null }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
      },
    });

    return NextResponse.json({ success: true, vehicle: updated });
  } catch (err) {
    console.error('[API /api/admin/transport/vehicles/[id] PUT] Error:', err);
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.transportVehicle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[API /api/admin/transport/vehicles/[id] DELETE] Error:', err);
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
  }
}
