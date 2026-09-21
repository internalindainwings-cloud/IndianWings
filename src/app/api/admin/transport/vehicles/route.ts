import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { getAllVehicles } from '@/lib/transport-service';

export async function GET() {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vehicles = await getAllVehicles(true);
    return NextResponse.json({ success: true, vehicles });
  } catch (err) {
    console.error('[API /api/admin/transport/vehicles GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      category = 'Luxury MPV',
      seats = '6+1 Seats',
      bags = '4 Bags',
      ac = 'AC & Heater',
      fuel = 'Diesel',
      imageUrl = '/images/fleet/innova-crysta.jpg',
      pricePerDay = 3500,
      tags = [],
      badge = null,
      isActive = true,
      sortOrder = 0,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Vehicle name is required' }, { status: 400 });
    }

    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const created = await prisma.transportVehicle.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        category,
        seats: seats.trim(),
        bags: bags.trim(),
        ac: ac.trim(),
        fuel: fuel.trim(),
        imageUrl: imageUrl.trim(),
        pricePerDay: Number(pricePerDay) || 3500,
        tags: Array.isArray(tags) ? tags : [],
        badge: badge ? badge.trim() : null,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    try {
      revalidateTag('transport', 'max');
      revalidatePath('/transport');
      revalidatePath('/');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: true, vehicle: created });
  } catch (err) {
    console.error('[API /api/admin/transport/vehicles POST] Error:', err);
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
  }
}
