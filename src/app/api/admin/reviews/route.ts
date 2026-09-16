import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { getAllReviews } from '@/lib/reviews-service';

export async function GET(request: NextRequest) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;

    const reviews = await getAllReviews(true, type);
    return NextResponse.json({ success: true, reviews });
  } catch (err) {
    console.error('[API /api/admin/reviews GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
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
      city,
      review,
      rating = 5,
      avatarUrl = null,
      type = 'written',
      videoUrl = null,
      videoDuration = null,
      videoQuote = null,
      imageUrl = null,
      featured = false,
      isActive = true,
      sortOrder = 0,
    } = body;

    if (!name || !review) {
      return NextResponse.json({ error: 'Customer name and review text are required' }, { status: 400 });
    }

    const created = await prisma.customerReview.create({
      data: {
        name: name.trim(),
        city: city ? city.trim() : 'India',
        review: review.trim(),
        rating: Number(rating) || 5,
        avatarUrl: avatarUrl ? avatarUrl.trim() : null,
        type,
        videoUrl: videoUrl ? videoUrl.trim() : null,
        videoDuration: videoDuration ? videoDuration.trim() : null,
        videoQuote: videoQuote ? videoQuote.trim() : null,
        imageUrl: imageUrl ? imageUrl.trim() : null,
        featured: Boolean(featured),
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, review: created });
  } catch (err) {
    console.error('[API /api/admin/reviews POST] Error:', err);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
