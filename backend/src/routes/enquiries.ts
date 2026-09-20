import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { enquiryLimiter } from '../lib/redis';
import { createRateLimitMiddleware } from '../middleware/rateLimit';
import { requireAdmin } from '../middleware/auth';
import { requestSizeLimit } from '../middleware/requestSize';
import { validateOrigin } from '../middleware/originGuard';
import { enquirySchema } from '../validations/enquiry';
import { createEnquiryRecord } from '../services/enquiry';
import { env } from '../config/env';

const router = Router();

router.post(
  '/',
  requestSizeLimit(),
  validateOrigin,
  createRateLimitMiddleware(enquiryLimiter),
  async (req: Request, res: Response) => {
    try {
      const ipAddress =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        (req.headers['x-real-ip'] as string) ||
        req.socket.remoteAddress ||
        '127.0.0.1';

      const rawBody = req.body as Record<string, unknown>;

      // Honeypot: bots fill hidden fields, humans leave them empty
      const hpField = rawBody.hpField as string | undefined;
      if (hpField && hpField.trim() !== '') {
        console.warn(`[Security] Bot submission blocked by honeypot from IP: ${ipAddress}`);
        res.json({ success: true, message: 'Enquiry received successfully' });
        return;
      }

      const validation = enquirySchema.safeParse(rawBody);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          fields: validation.error.flatten().fieldErrors,
        });
        return;
      }

      const userAgent = (req.headers['user-agent'] || 'unknown').slice(0, 500);
      const result = await createEnquiryRecord(validation.data, { ipAddress, userAgent });

      if (result.duplicate) {
        res.json({ success: true, id: result.id, message: result.message });
        return;
      }

      res.status(201).json({ success: true, id: result.id, message: result.message });
    } catch (err) {
      console.error('[Enquiries] POST error:', err);
      res.status(500).json({
        success: false,
        error: 'Could not save enquiry. Please contact us directly on WhatsApp.',
      });
    }
  }
);

router.get('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const bearerAuthed = env.ADMIN_API_SECRET && authHeader === `Bearer ${env.ADMIN_API_SECRET}`;
    // requireAdmin middleware already checked the cookie; also allow Bearer token
    // If requireAdmin didn't pass AND bearer is also invalid, we already got 401 from middleware
    // This check is redundant here since requireAdmin runs first, but kept for explicit Bearer support
    void bearerAuthed;

    const enquiries = await prisma.enquiry.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        travelDate: true,
        guests: true,
        tripType: true,
        status: true,
        source: true,
        utmSource: true,
        utmCampaign: true,
        createdAt: true,
      },
    });

    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (err) {
    console.error('[Enquiries] GET error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch enquiries' });
  }
});

export default router;
