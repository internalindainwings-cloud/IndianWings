import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { getAllActivities } from '@/lib/activities-service';

export async function GET() {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activities = await getAllActivities(true);
    return NextResponse.json({ success: true, activities });
  } catch (err) {
    console.error('[API /api/admin/activities GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
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
      location,
      category = 'Snow & Winter',
      duration = '2-4 hrs',
      difficulty = 'Beginner to Pro',
      season = 'All Year',
      imageUrl = '/images/gallery/gulmarg-snow.jpg',
      tags = [],
      badge = null,
      priceFrom = 1500,
      isActive = true,
      sortOrder = 0,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const created = await prisma.activity.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        location: location ? location.trim() : 'Kashmir Valley',
        category,
        duration: duration ? duration.trim() : '2-4 hrs',
        difficulty: difficulty ? difficulty.trim() : 'Moderate',
        season: season ? season.trim() : 'All Year',
        imageUrl: imageUrl ? imageUrl.trim() : '/images/gallery/gulmarg-snow.jpg',
        tags: Array.isArray(tags) ? tags : [],
        badge: badge ? badge.trim() : null,
        priceFrom: Number(priceFrom) || 1500,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, activity: created });
  } catch (err) {
    console.error('[API /api/admin/activities POST] Error:', err);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
