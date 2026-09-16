import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { getAllDestinations } from '@/lib/destinations-service';

export async function GET() {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const destinations = await getAllDestinations(true);
    return NextResponse.json({ success: true, destinations });
  } catch (err) {
    console.error('[API /api/admin/destinations GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
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
      region = 'Jammu & Kashmir',
      tagline,
      category = 'Iconic',
      imageUrl,
      gallery = [],
      elevation = '1,585 m',
      bestSeason = 'All Year Round',
      distanceFromSrinagar = '0 km',
      highlights = [],
      description,
      packageCount = 0,
      isActive = true,
      sortOrder = 0,
    } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const created = await prisma.destination.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        region: region.trim(),
        tagline: tagline ? tagline.trim() : '',
        category,
        imageUrl: imageUrl ? imageUrl.trim() : '/images/gallery/shikara-dal-lake.jpg',
        gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : [imageUrl || '/images/gallery/shikara-dal-lake.jpg'],
        elevation: elevation ? elevation.trim() : '1,585 m',
        bestSeason: bestSeason ? bestSeason.trim() : 'All Year Round',
        distanceFromSrinagar: distanceFromSrinagar ? distanceFromSrinagar.trim() : '0 km',
        highlights: Array.isArray(highlights) ? highlights : [],
        description: description ? description.trim() : '',
        packageCount: Number(packageCount) || 0,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, destination: created });
  } catch (err) {
    console.error('[API /api/admin/destinations POST] Error:', err);
    return NextResponse.json({ error: 'Failed to create destination' }, { status: 500 });
  }
}
