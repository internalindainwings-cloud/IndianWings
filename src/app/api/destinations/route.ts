import { NextResponse } from 'next/server';
import { getAllDestinations } from '@/lib/destinations-service';

export async function GET() {
  try {
    const destinations = await getAllDestinations(false);
    return NextResponse.json(
      { success: true, destinations },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (err) {
    console.error('[API /api/destinations GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
