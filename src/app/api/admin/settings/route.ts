import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { getSiteSettings, updateSiteSettings } from '@/lib/settings-service';

export async function GET() {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error('[API /api/admin/settings GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthed = await isAuthenticatedAdmin();
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updated = await updateSiteSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    console.error('[API /api/admin/settings POST] Error:', err);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
