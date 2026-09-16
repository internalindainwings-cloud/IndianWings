import { NextResponse } from 'next/server';
import { getHeroConfig } from '@/lib/hero-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await getHeroConfig();
    return NextResponse.json({ success: true, hero: config });
  } catch (err) {
    console.error('[API /api/hero GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch hero config' }, { status: 500 });
  }
}
