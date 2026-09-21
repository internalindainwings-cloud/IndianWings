import { NextResponse } from 'next/server';
import { getAllPageHeroes } from '@/lib/page-heroes-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const heroes = await getAllPageHeroes();
    return NextResponse.json({ success: true, heroes });
  } catch (err) {
    console.error('[API /api/page-heroes GET] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch page heroes' }, { status: 500 });
  }
}
