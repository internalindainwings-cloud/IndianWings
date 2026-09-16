import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

interface IngestedEvent {
  eventType: string;
  route: string;
  label?: string;
  durationSpent?: number;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

function parseDevice(userAgent: string | null): { device: string; browser: string } {
  if (!userAgent) return { device: 'Desktop', browser: 'Unknown' };

  let device = 'Desktop';
  if (/mobile/i.test(userAgent)) device = 'Mobile';
  else if (/tablet|ipad/i.test(userAgent)) device = 'Tablet';

  let browser = 'Browser';
  if (/chrome|crios/i.test(userAgent) && !/edg/i.test(userAgent)) browser = 'Chrome';
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
  else if (/edg/i.test(userAgent)) browser = 'Edge';
  else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';

  return { device, browser };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return NextResponse.json({ success: false, message: 'Empty body' }, { status: 400 });
    }

    const data = JSON.parse(rawBody);
    const { visitorId, sessionId, events } = data;

    if (!visitorId || !sessionId || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent');
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const { device, browser } = parseDevice(userAgent);

    // 1. Calculate session duration update
    let addedDwell = 0;
    for (const ev of events as IngestedEvent[]) {
      if (typeof ev.durationSpent === 'number' && ev.durationSpent > 0) {
        addedDwell += ev.durationSpent;
      }
    }

    // 2. Upsert the UserSession record
    const session = await prisma.userSession.upsert({
      where: { id: sessionId },
      update: {
        endedAt: new Date(),
        durationSeconds: { increment: addedDwell },
      },
      create: {
        id: sessionId,
        visitorId,
        device,
        browser,
        ipAddress,
        startedAt: new Date(),
        endedAt: new Date(),
        durationSeconds: addedDwell,
      },
    });

    // 3. Batch insert the session events
    const eventRecords = (events as IngestedEvent[]).map((ev) => ({
      sessionId: session.id,
      eventType: ev.eventType || 'PAGE_VIEW',
      route: ev.route || '/',
      label: ev.label || null,
      durationSpent: typeof ev.durationSpent === 'number' ? ev.durationSpent : null,
      metadata: ev.metadata ? JSON.parse(JSON.stringify(ev.metadata)) : null,
      timestamp: ev.timestamp ? new Date(ev.timestamp) : new Date(),
    }));

    await prisma.sessionEvent.createMany({
      data: eventRecords,
    });

    return NextResponse.json({ success: true, processedCount: eventRecords.length });
  } catch (err) {
    console.error('Telemetry ingestion error:', err);
    return NextResponse.json({ success: false, error: 'Failed to ingest telemetry' }, { status: 500 });
  }
}
