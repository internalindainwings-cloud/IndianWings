import { NextResponse } from 'next/server';
import { getAllActivities } from '@/lib/activities-service';

export async function GET() {
  try {
    const activities = await getAllActivities(false);
    return NextResponse.json({ success: true, activities });
  } catch (err) {
    console.error('[API /api/activities GET] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
