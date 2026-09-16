import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { getAllRoutes } from '@/lib/transport-service';

export async function GET() {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const routes = await getAllRoutes(true);
    return NextResponse.json({ success: true, routes });
  } catch (err) {
    console.error('[API /api/admin/transport/routes GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch routes' }, { status: 500 });
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
      origin = 'Srinagar',
      destination,
      routeTitle,
      via = 'Direct Highway',
      distance = '50 km',
      duration = '1.5 hrs',
      startingPrice = 2500,
      highlights = [],
      cabs = 'Sedan, Innova Crysta, Tempo',
      isPopular = false,
      isActive = true,
      sortOrder = 0,
    } = body;

    if (!destination || !routeTitle) {
      return NextResponse.json({ error: 'Destination and Route Title are required' }, { status: 400 });
    }

    const created = await prisma.transportRoute.create({
      data: {
        origin: origin.trim(),
        destination: destination.trim(),
        routeTitle: routeTitle.trim(),
        via: via.trim(),
        distance: distance.trim(),
        duration: duration.trim(),
        startingPrice: Number(startingPrice) || 2500,
        highlights: Array.isArray(highlights) ? highlights : [],
        cabs: cabs.trim(),
        isPopular: Boolean(isPopular),
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, route: created });
  } catch (err) {
    console.error('[API /api/admin/transport/routes POST] Error:', err);
    return NextResponse.json({ error: 'Failed to create route' }, { status: 500 });
  }
}
