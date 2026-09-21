import { NextResponse } from 'next/server';
import { getAllPageHeroes } from '@/lib/page-heroes-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const heroes = await getAllPageHeroes();
    return NextResponse.json({ success: true, heroes });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
