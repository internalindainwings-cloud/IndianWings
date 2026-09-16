import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { itineraryLimiter } from '../lib/redis';
import { createRateLimitMiddleware } from '../middleware/rateLimit';
import { requestSizeLimit } from '../middleware/requestSize';
import { sendItineraryEmail } from '../services/email';

const router = Router();

const itineraryDownloadSchema = z.object({
  email: z.string().email('Please enter a valid email address').max(120),
  name: z.string().max(100).optional().default(''),
  phone: z.string().max(25).optional().default(''),
  packageSlug: z.string().max(120),
  packageTitle: z.string().max(150),
  duration: z.string().max(50).default('6 Nights / 7 Days'),
  startingPrice: z.number().default(0),
  destinations: z.array(z.string()).default([]),
  itinerary: z.array(z.object({
    day: z.number(),
    title: z.string(),
    description: z.string(),
    activities: z.array(z.string()).optional(),
    meals: z.string().optional(),
    stay: z.string().optional(),
  })).default([]),
  inclusions: z.array(z.string()).default([]),
  visitorId: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

router.post(
  '/download',
  requestSizeLimit(50 * 1024), // 50KB for itinerary payload
  createRateLimitMiddleware(itineraryLimiter),
  async (req: Request, res: Response) => {
    try {
      const ipAddress =
        (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
        req.socket.remoteAddress ||
        '127.0.0.1';
      const userAgent = (req.headers['user-agent'] || 'unknown').slice(0, 500);

      const validation = itineraryDownloadSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          fields: validation.error.flatten().fieldErrors,
        });
        return;
      }

      const data = validation.data;
      const leadName = data.name.trim() || 'Traveler';
      const leadPhone = data.phone.trim() || 'Not Provided';

      const enquiry = await prisma.enquiry.create({
        data: {
          name: leadName,
          phone: leadPhone,
          email: data.email.trim().toLowerCase(),
          travelDate: 'Flexible / Itinerary Download',
          guests: '2-4 Guests',
          tripType: data.packageTitle,
          message: `Downloaded Itinerary for ${data.packageTitle} (${data.duration}). Starting Price ₹${data.startingPrice.toLocaleString('en-IN')}`,
          source: 'itinerary_download',
          utmSource: data.utmSource || null,
          utmMedium: data.utmMedium || null,
          utmCampaign: data.utmCampaign || null,
          visitorId: data.visitorId || null,
          ipAddress,
          userAgent,
        },
      });

      if (data.visitorId) {
        prisma.userSession.updateMany({
          where: { visitorId: data.visitorId },
          data: { converted: true, enquiryId: enquiry.id, name: leadName !== 'Traveler' ? leadName : undefined, email: data.email.trim().toLowerCase() },
        }).catch((err: unknown) => console.warn('[Telemetry] Could not link session on download:', err));
      }

      const emailResult = await sendItineraryEmail({
        toEmail: data.email.trim().toLowerCase(),
        recipientName: leadName !== 'Traveler' ? leadName : undefined,
        packageTitle: data.packageTitle,
        duration: data.duration,
        startingPrice: data.startingPrice,
        destinations: data.destinations,
        itinerary: data.itinerary,
        inclusions: data.inclusions,
      });

      res.json({
        success: true,
        enquiryId: enquiry.id,
        emailDispatched: emailResult.success,
        simulated: emailResult.simulated ?? false,
        message: 'Itinerary downloaded and email dispatched successfully!',
      });
    } catch (err) {
      console.error('[Itinerary] Download error:', err);
      res.status(500).json({
        success: false,
        error: 'Unable to process itinerary request. Please try again or message on WhatsApp.',
      });
    }
  }
);

export default router;
