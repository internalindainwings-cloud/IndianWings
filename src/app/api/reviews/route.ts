import { NextRequest, NextResponse } from 'next/server';
import { getAllReviews } from '@/lib/reviews-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;

    const reviews = await getAllReviews(false, type);
    return NextResponse.json(
      { success: true, reviews },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err) {
    console.error('[API /api/reviews GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
