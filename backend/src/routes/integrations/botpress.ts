import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../../config/env';
import { enquiryLimiter } from '../../lib/redis';
import { createRateLimitMiddleware } from '../../middleware/rateLimit';
import { requestSizeLimit } from '../../middleware/requestSize';
import { createEnquiryRecord } from '../../services/enquiry';

const router = Router();

// Zod validation schema for inbound Botpress lead payload
export const botpressLeadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 characters')
    .max(25, 'Phone number must not exceed 25 characters')
    .regex(/^[+\d\s().-]+$/, 'Invalid phone number format'),
  email: z
    .string()
    .trim()
    .email('Invalid email address format')
    .max(150, 'Email must not exceed 150 characters')
    .optional()
    .nullable()
    .or(z.literal('')),
  travelDate: z
    .string()
    .trim()
    .min(1, 'Travel date / month is required')
    .max(100, 'Travel date must not exceed 100 characters'),
  travellers: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => (val !== undefined && val !== null ? String(val).trim() : '2-4 Guests')),
  destination: z.string().trim().max(200).optional().nullable(),
  tripType: z.string().trim().max(150).optional().nullable(),
  message: z.string().trim().max(2000).optional().nullable(),
  source: z.string().trim().optional().default('chatbot'),
  sourceDetail: z.string().trim().optional().default('botpress'),
  visitorId: z.string().trim().max(100).optional().nullable(),
});

export type BotpressLeadPayload = z.infer<typeof botpressLeadSchema>;

/**
 * Middleware: Verify incoming x-bp-secret using constant-time comparison
 * Server-to-server security independent of browser CORS.
 */
function verifyBotpressWebhookSecret(req: Request, res: Response, next: () => void): void {
  const incomingSecret = (req.headers['x-bp-secret'] as string) || '';
  const configuredSecret = env.BOTPRESS_WEBHOOK_SECRET;

  if (!incomingSecret || !configuredSecret) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: missing webhook authentication',
    });
    return;
  }

  const incomingBuf = Buffer.from(incomingSecret, 'utf8');
  const configuredBuf = Buffer.from(configuredSecret, 'utf8');

  // Guard against timing attacks: both length check & timingSafeEqual
  if (
    incomingBuf.length !== configuredBuf.length ||
    !crypto.timingSafeEqual(incomingBuf, configuredBuf)
  ) {
    console.warn(`[Botpress Webhook] Unauthorized attempt with invalid secret from IP: ${req.ip}`);
    res.status(401).json({
      success: false,
      error: 'Unauthorized: invalid webhook authentication',
    });
    return;
  }

  next();
}

/**
 * POST /api/integrations/botpress/lead
 * Secure server-to-server webhook endpoint for Botpress lead ingestion.
 * Features:
 * - 15KB explicit payload size cap
 * - Timing-safe x-bp-secret header authentication
 * - Distributed Upstash Redis rate limiting
 * - Strict Zod schema validation & sanitization
 * - Reuses shared createEnquiryRecord service with 2-min idempotency
 * - Stores source="chatbot" and utmSource="botpress" in Neon PostgreSQL
 */
router.post(
  '/lead',
  requestSizeLimit(15 * 1024), // 15KB payload protection
  verifyBotpressWebhookSecret, // Server-to-server secret verification
  createRateLimitMiddleware(enquiryLimiter), // Distributed Upstash Redis limiter
  async (req: Request, res: Response) => {
    try {
      const ipAddress =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        (req.headers['x-real-ip'] as string) ||
        req.socket.remoteAddress ||
        '127.0.0.1';

      const userAgent = (req.headers['user-agent'] || 'Botpress-Cloud-Webhook').slice(0, 500);

      const rawBody = req.body as Record<string, unknown>;

      // Validate inbound lead payload with strict Zod schema
      const validation = botpressLeadSchema.safeParse(rawBody);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          fields: validation.error.flatten().fieldErrors,
        });
        return;
      }

      const data = validation.data;

      // Construct descriptive notes if destination is separately provided
      let composedMessage = data.message || '';
      if (data.destination && !composedMessage.toLowerCase().includes(data.destination.toLowerCase())) {
        composedMessage = composedMessage
          ? `[Destination: ${data.destination}] ${composedMessage}`
          : `Interested Destination: ${data.destination}`;
      }

      // Compose trip type combining category and destination if applicable
      const composedTripType = data.tripType || data.destination || 'Kashmir Tour';

      // Delegate to shared enquiry service
      const result = await createEnquiryRecord(
        {
          name: data.fullName,
          phone: data.phone,
          email: data.email || null,
          travelDate: data.travelDate,
          guests: data.travellers || '2-4 Guests',
          tripType: composedTripType,
          message: composedMessage || null,
          source: 'chatbot',
          utmSource: 'botpress',
          visitorId: data.visitorId || null,
        },
        { ipAddress, userAgent }
      );

      if (result.duplicate) {
        res.status(200).json({
          success: true,
          id: result.id,
          duplicate: true,
          message: 'Enquiry already received.',
        });
        return;
      }

      res.status(201).json({
        success: true,
        id: result.id,
        message: 'Lead captured and saved successfully.',
      });
    } catch (err) {
      console.error('[Botpress Webhook] Internal processing error:', err);
      res.status(500).json({
        success: false,
        error: 'An internal error occurred while processing the lead.',
      });
    }
  }
);

export default router;
