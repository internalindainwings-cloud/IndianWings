import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { telemetryLimiter } from '../lib/redis';
import { createRateLimitMiddleware } from '../middleware/rateLimit';

const router = Router();

function parseDevice(ua: string | null): { device: string; browser: string } {
  if (!ua) return { device: 'Desktop', browser: 'Unknown' };
  let device = 'Desktop';
  if (/mobile/i.test(ua)) device = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) device = 'Tablet';
  let browser = 'Browser';
  if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/edg/i.test(ua)) browser = 'Edge';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  return { device, browser };
}

interface IngestedEvent {
  eventType: string;
  route: string;
  label?: string;
  durationSpent?: number;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

router.post(
  '/event',
  createRateLimitMiddleware(telemetryLimiter),
  async (req: Request, res: Response) => {
    try {
      const { visitorId, sessionId, events } = req.body as {
        visitorId?: string;
        sessionId?: string;
        events?: unknown[];
      };

      if (!visitorId || !sessionId || !Array.isArray(events) || events.length === 0) {
        res.status(400).json({ success: false, error: 'Invalid payload' });
        return;
      }

      const ipAddress =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        req.socket.remoteAddress ||
        '127.0.0.1';
      const { device, browser } = parseDevice(req.headers['user-agent'] || null);

      let addedDwell = 0;
      for (const ev of events as IngestedEvent[]) {
        if (typeof ev.durationSpent === 'number' && ev.durationSpent > 0) addedDwell += ev.durationSpent;
      }

      const session = await prisma.userSession.upsert({
        where: { id: sessionId },
        update: { endedAt: new Date(), durationSeconds: { increment: addedDwell } },
        create: { id: sessionId, visitorId, device, browser, ipAddress, startedAt: new Date(), endedAt: new Date(), durationSeconds: addedDwell },
      });

      const eventRecords = (events as IngestedEvent[]).map((ev) => ({
        sessionId: session.id,
        eventType: ev.eventType || 'PAGE_VIEW',
        route: ev.route || '/',
        label: ev.label || null,
        durationSpent: typeof ev.durationSpent === 'number' ? ev.durationSpent : null,
        metadata: ev.metadata ? JSON.parse(JSON.stringify(ev.metadata)) : null,
        timestamp: ev.timestamp ? new Date(ev.timestamp) : new Date(),
      }));

      await prisma.sessionEvent.createMany({ data: eventRecords });
      res.json({ success: true, processedCount: eventRecords.length });
    } catch (err) {
      console.error('[Telemetry] Ingestion error:', err);
      res.status(500).json({ success: false, error: 'Failed to ingest telemetry' });
    }
  }
);

export default router;
