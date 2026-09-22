import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { enquirySchema } from '@/lib/validations/enquiry';
import { checkEnquiryRateLimit, resolveClientIp } from '@/lib/security/rate-limit';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';
import { sendAdminEnquiryNotificationEmail } from '@/lib/services/email-service';

const MAX_PAYLOAD_BYTES = 15 * 1024;

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host') || '';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (origin) {
      try {
        const originUrl = new URL(origin);
        const isLocal = originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1';
        const isSameHost = originUrl.host === host;
        const isAllowedSite = siteUrl ? new URL(siteUrl).origin === originUrl.origin : false;

        if (!isSameHost && !isAllowedSite && !isLocal) {
          return NextResponse.json(
            { error: 'Forbidden', message: 'Untrusted request origin' },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Forbidden', message: 'Malformed origin header' },
          { status: 403 }
        );
      }
    }

    const ipAddress = resolveClientIp(req);
    const rateLimit = await checkEnquiryRateLimit(ipAddress);

    if (!rateLimit.success) {
      const status = rateLimit.redisUnavailable ? 503 : 429;
      return NextResponse.json(
        {
          error: rateLimit.redisUnavailable ? 'Service temporarily unavailable' : 'Rate limit exceeded',
          message: 'Too many submissions from this connection. Please try again in a few minutes or contact us directly via WhatsApp.',
        },
        {
          status,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { error: 'Payload too large', message: 'Request exceeds maximum allowed size' },
        { status: 413 }
      );
    }

    let rawBody;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Malformed JSON payload' },
        { status: 400 }
      );
    }

    if (rawBody.hpField && rawBody.hpField.trim() !== '') {
      return NextResponse.json(
        { success: true, message: 'Enquiry received successfully' },
        { status: 200 }
      );
    }

    const validationResult = enquirySchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const userAgent = req.headers.get('user-agent')?.slice(0, 500) || 'unknown';

    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const existingRecentEnquiry = await prisma.enquiry.findFirst({
      where: {
        phone: data.phone,
        createdAt: { gte: tenSecondsAgo },
      },
      select: { id: true, createdAt: true },
    });

    if (existingRecentEnquiry) {
      return NextResponse.json(
        {
          success: true,
          id: existingRecentEnquiry.id,
          message: 'Enquiry already received and queued.',
        },
        { status: 200 }
      );
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email ? data.email.trim().toLowerCase() : null,
        travelDate: data.travelDate,
        guests: data.guests,
        tripType: data.tripType,
        message: data.message || null,
        source: data.source || 'website_inline',
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        utmTerm: data.utmTerm || null,
        utmContent: data.utmContent || null,
        gclid: data.gclid || null,
        fbclid: data.fbclid || null,
        referrer: data.referrer || null,
        visitorId: data.visitorId || null,
        ipAddress,
        userAgent,
      },
    });

    const visitorId = data.visitorId;
    if (visitorId) {
      await prisma.userSession.updateMany({
        where: { visitorId },
        data: {
          converted: true,
          enquiryId: enquiry.id,
          name: data.name,
          phone: data.phone,
          email: data.email || null,
        },
      }).catch(() => {});
    }

    sendAdminEnquiryNotificationEmail({
      id: enquiry.id,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      travelDate: data.travelDate || null,
      guests: data.guests || null,
      tripType: data.tripType || null,
      message: data.message || null,
      source: data.source || 'website_inline',
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      utmTerm: data.utmTerm || null,
      utmContent: data.utmContent || null,
      gclid: data.gclid || null,
      fbclid: data.fbclid || null,
      referrer: data.referrer || null,
      ipAddress,
      createdAt: enquiry.createdAt,
    }).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        id: enquiry.id,
        message: 'Enquiry received and saved successfully.',
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        error: 'Database error',
        message: 'Could not save enquiry at this moment. Please connect with us directly on WhatsApp.',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const isAuthedCookie = await isAuthenticatedAdmin();
    const authHeader = req.headers.get('authorization');
    const secret = process.env.ADMIN_API_SECRET;
    const isAuthedBearer = Boolean(secret && authHeader === `Bearer ${secret}`);

    if (!isAuthedCookie && !isAuthedBearer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        utmMedium: true,
        utmCampaign: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        count: enquiries.length,
        enquiries,
      },
      {
        headers: {
          'Cache-Control': 'no-store, private',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
