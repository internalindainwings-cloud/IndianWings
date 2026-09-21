import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { checkTelemetryRateLimit, resolveClientIp } from '@/lib/security/rate-limit';

const MAX_PAYLOAD_BYTES = 32 * 1024; // 32 KB max payload
const MAX_EVENTS_PER_BATCH = 30; // Prevent DB flooding / DoS

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
    // 1. IP Resolution & Rate Limiting
    const ipAddress = resolveClientIp(request);
    const rateLimit = await checkTelemetryRateLimit(ipAddress);
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: rateLimit.redisUnavailable ? 503 : 429 }
      );
    }

    // 2. Payload size check
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Payload too large' },
        { status: 413 }
      );
    }

    const rawBody = await request.text();
    if (!rawBody || rawBody.length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ success: false, error: 'Invalid payload size' }, { status: 400 });
    }

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, error: 'Malformed JSON payload' }, { status: 400 });
    }

    const { visitorId, sessionId, events } = data;

    // 3. Input Validation
    if (
      typeof visitorId !== 'string' ||
      visitorId.length === 0 ||
      visitorId.length > 100 ||
      typeof sessionId !== 'string' ||
      sessionId.length === 0 ||
      sessionId.length > 100 ||
      !Array.isArray(events) ||
      events.length === 0
    ) {
      return NextResponse.json({ success: false, error: 'Invalid payload parameters' }, { status: 400 });
    }

    // 4. Cap batch size to prevent DB resource exhaustion
    const boundedEvents: IngestedEvent[] = events.slice(0, MAX_EVENTS_PER_BATCH);

    const userAgent = request.headers.get('user-agent')?.slice(0, 500) || null;
    const { device, browser } = parseDevice(userAgent);

    // 5. Calculate session duration update safely
    let addedDwell = 0;
    for (const ev of boundedEvents) {
      if (typeof ev.durationSpent === 'number' && ev.durationSpent > 0 && ev.durationSpent <= 86400) {
        addedDwell += ev.durationSpent;
      }
    }

    // 6. Upsert the UserSession record
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

    // 7. Batch insert the session events with bounded field lengths
    const eventRecords = boundedEvents.map((ev) => ({
      sessionId: session.id,
      eventType: typeof ev.eventType === 'string' ? ev.eventType.slice(0, 50) : 'PAGE_VIEW',
      route: typeof ev.route === 'string' ? ev.route.slice(0, 200) : '/',
      label: typeof ev.label === 'string' ? ev.label.slice(0, 200) : null,
      durationSpent: typeof ev.durationSpent === 'number' && ev.durationSpent >= 0 && ev.durationSpent <= 86400 ? ev.durationSpent : null,
      metadata: ev.metadata && typeof ev.metadata === 'object' ? JSON.parse(JSON.stringify(ev.metadata)) : null,
      timestamp: ev.timestamp && !isNaN(Date.parse(ev.timestamp)) ? new Date(ev.timestamp) : new Date(),
    }));

    await prisma.sessionEvent.createMany({
      data: eventRecords,
    });

    return NextResponse.json({ success: true, processedCount: eventRecords.length });
  } catch (err) {
    console.error('[API /api/telemetry/event] Telemetry ingestion error:', err);
    return NextResponse.json({ success: false, error: 'Failed to ingest telemetry' }, { status: 500 });
  }
}
