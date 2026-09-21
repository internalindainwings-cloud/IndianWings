import { NextRequest, NextResponse } from 'next/server';
import { updatePageHero } from '@/lib/page-heroes-service';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updatePageHero(id, {
      desktopImageUrl: body.desktopImageUrl,
      mobileImageUrl: body.mobileImageUrl,
      heading: body.heading,
    });

    return NextResponse.json({ success: true, hero: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
