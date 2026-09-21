import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { getHeroConfig, updateHeroConfig } from '@/lib/hero-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hero = await getHeroConfig();
    return NextResponse.json({ success: true, hero });
  } catch (err) {
    console.error('[API /api/admin/hero GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch hero settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updated = await updateHeroConfig(body);

    // Instant revalidation so homepage immediately reflects the changes
    try {
      revalidateTag('hero', 'max');
      revalidatePath('/');
      revalidatePath('/admin');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: true, hero: updated });
  } catch (err) {
    console.error('[API /api/admin/hero PUT] Error:', err);
    return NextResponse.json({ error: 'Failed to update hero settings' }, { status: 500 });
  }
}
