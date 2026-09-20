import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { checkItineraryRateLimit } from '@/lib/security/rate-limit';
import { sendItineraryEmail } from '@/lib/services/email-service';
import { z } from 'zod';

const itineraryDownloadSchema = z.object({
  email: z.string().email('Please enter a valid email address').max(120),
  name: z.string().max(100).optional().default(''),
  phone: z.string().max(25).optional().default(''),
  packageSlug: z.string().max(120),
  packageTitle: z.string().max(150),
  duration: z.string().max(50).default('6 Nights / 7 Days'),
  startingPrice: z.number().default(0),
  destinations: z.array(z.string()).default([]),
  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      description: z.string(),
      activities: z.array(z.string()).optional(),
      meals: z.string().optional(),
      stay: z.string().optional(),
      imageUrl: z.string().optional(),
      image: z.string().optional(),
    }).passthrough()
  ).default([]),
  inclusions: z.array(z.string()).default([]),
  visitorId: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Rate limiting via Upstash Redis: Max 8 downloads per 10 mins per IP
    const rateLimit = await checkItineraryRateLimit(ipAddress);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: rateLimit.redisUnavailable ? 'Service temporarily unavailable' : 'Rate limit exceeded',
          message: 'Too many requests. Please try again in a few minutes or contact us via WhatsApp.',
        },
        { status: rateLimit.redisUnavailable ? 503 : 429 }
      );
    }

    const rawBody = await req.json();
    const validation = itineraryDownloadSchema.safeParse(rawBody);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const userAgent = req.headers.get('user-agent')?.slice(0, 500) || 'unknown';

    // Save or update lead in Prisma database
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

    // Link user session if visitorId exists
    if (data.visitorId) {
      await prisma.userSession.updateMany({
        where: { visitorId: data.visitorId },
        data: {
          converted: true,
          enquiryId: enquiry.id,
          name: leadName !== 'Traveler' ? leadName : undefined,
          email: data.email.trim().toLowerCase(),
        },
      }).catch((err) => console.warn('[Telemetry] Could not link session on download:', err));
    }

    // Dispatch rich email asynchronously
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

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      emailDispatched: emailResult.success,
      simulated: emailResult.simulated ?? false,
      message: 'Itinerary downloaded and email dispatched successfully!',
    });
  } catch (error: any) {
    console.error('[API itinerary/download] Error:', error?.message || error);
    return NextResponse.json(
      {
        error: 'Server Error',
        message: 'Unable to process itinerary request. Please try again or message on WhatsApp.',
      },
      { status: 500 }
    );
  }
}
