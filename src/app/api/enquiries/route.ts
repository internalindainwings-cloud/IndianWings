import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { enquirySchema } from '@/lib/validations/enquiry';
import { checkEnquiryRateLimit, resolveClientIp } from '@/lib/security/rate-limit';
import { isAuthenticatedAdmin } from '@/lib/security/admin-auth';

// Max allowed payload size in bytes (15KB is plenty for a lead)
const MAX_PAYLOAD_BYTES = 15 * 1024;

export async function POST(req: NextRequest) {
  try {
    // 1. Origin Protection
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
          console.warn(`[Security] Cross-origin enquiry submission blocked from origin: ${origin}`);
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

    // 2. Client IP Extraction (hardened: trusts x-real-ip > rightmost XFF, never leftmost)
    const ipAddress = resolveClientIp(req);

    // 3. Security: Distributed Rate Limiting via Upstash Redis (6 submissions / 10 min / IP)
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

    // 4. Security: Check Payload Size
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

    // 5. Security: Honeypot Check (Bot Trap)
    // Bots scan forms and populate hidden fields. Humans never see or fill this.
    if (rawBody.hpField && rawBody.hpField.trim() !== '') {
      console.warn(`[Security] Bot submission blocked by honeypot from IP: ${ipAddress}`);
      // Return 200 OK so bots don't learn they were trapped
      return NextResponse.json(
        { success: true, message: 'Enquiry received successfully' },
        { status: 200 }
      );
    }

    // 6. Validation & Sanitization with Strict Zod Schema
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

    // 7. Server-Side Duplicate Submission Protection (10s anti-double-click window)
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const existingRecentEnquiry = await prisma.enquiry.findFirst({
      where: {
        phone: data.phone,
        createdAt: { gte: tenSecondsAgo },
      },
      select: { id: true, createdAt: true },
    });

    if (existingRecentEnquiry) {
      // Return existing confirmation without creating duplicate lead row
      return NextResponse.json(
        {
          success: true,
          id: existingRecentEnquiry.id,
          message: 'Enquiry already received and queued.',
        },
        { status: 200 }
      );
    }

    // 8. Database Persistence (Parameterized via Prisma)
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

    // Identity Reconciliation: Link anonymous user session to this lead
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
      }).catch((err) => console.warn('[Telemetry] Could not link session to enquiry:', err));
    }

    return NextResponse.json(
      {
        success: true,
        id: enquiry.id,
        message: 'Enquiry received and saved successfully.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Security: Log error details server-side only, do not expose stack trace to client
    console.error('[API /api/enquiries] Error processing enquiry:', error);
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
    // Strict Admin Authentication: Check Bearer token OR verified Admin session cookie
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
  } catch (error: unknown) {
    console.error('[API /api/enquiries GET] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
