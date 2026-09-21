import { NextRequest, NextResponse } from 'next/server';
import { updatePageHero } from '@/lib/page-heroes-service';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await updatePageHero(id, {
      desktopImageUrl: body.desktopImageUrl,
      mobileImageUrl: body.mobileImageUrl,
      heading: body.heading,
    });

    return NextResponse.json({ success: true, hero: updated });
  } catch (err) {
    console.error('[API /api/admin/page-heroes/[id] PUT] Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update page hero' }, { status: 500 });
  }
}
