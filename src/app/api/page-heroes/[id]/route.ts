import { NextRequest, NextResponse } from 'next/server';
import { getPageHeroById } from '@/lib/page-heroes-service';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hero = await getPageHeroById(id);
    return NextResponse.json({ success: true, hero });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
