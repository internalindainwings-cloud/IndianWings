import { NextRequest, NextResponse } from 'next/server';
import { getActiveGalleryItems } from '@/lib/gallery-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    let items = await getActiveGalleryItems();

    if (category && category !== 'all') {
      items = items.filter((item) => item.category === category);
    }

    const total = items.length;

    if (pageParam && limitParam) {
      const page = Math.max(1, parseInt(pageParam, 10) || 1);
      const limit = Math.max(1, parseInt(limitParam, 10) || 12);
      const startIndex = (page - 1) * limit;
      const paginatedItems = items.slice(startIndex, startIndex + limit);

      return NextResponse.json(
        {
          success: true,
          items: paginatedItems,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        items,
        pagination: {
          total,
          page: 1,
          limit: total,
          totalPages: 1,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err: any) {
    console.error('[API Gallery] Error fetching items:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}
