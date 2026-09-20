import { prisma } from '../lib/prisma';

export interface CreateEnquiryInput {
  name: string;
  phone: string;
  email?: string | null;
  travelDate: string;
  guests?: string;
  tripType?: string;
  message?: string | null;
  source?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  referrer?: string | null;
  visitorId?: string | null;
}

export interface CreateEnquiryMeta {
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateEnquiryResult {
  success: boolean;
  id?: string;
  duplicate?: boolean;
  message: string;
}

/**
 * Shared business logic for enquiry and lead creation across website forms and Botpress chatbot.
 * Handles 2-minute phone idempotency, attribution, persistence, and telemetry linking.
 */
export async function createEnquiryRecord(
  input: CreateEnquiryInput,
  meta: CreateEnquiryMeta = {}
): Promise<CreateEnquiryResult> {
  const ipAddress = meta.ipAddress || '127.0.0.1';
  const userAgent = (meta.userAgent || 'unknown').slice(0, 500);

  // Idempotency: prevent duplicate submissions within 2 minutes from the same phone number
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  const existing = await prisma.enquiry.findFirst({
    where: { phone: input.phone, createdAt: { gte: twoMinutesAgo } },
    select: { id: true },
  });

  if (existing) {
    return {
      success: true,
      id: existing.id,
      duplicate: true,
      message: 'Enquiry already received.',
    };
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      travelDate: input.travelDate,
      guests: input.guests || '2-4 Guests',
      tripType: input.tripType || 'Kashmir Classic',
      message: input.message || null,
      source: input.source || 'website_inline',
      utmSource: input.utmSource || null,
      utmMedium: input.utmMedium || null,
      utmCampaign: input.utmCampaign || null,
      utmTerm: input.utmTerm || null,
      utmContent: input.utmContent || null,
      gclid: input.gclid || null,
      fbclid: input.fbclid || null,
      referrer: input.referrer || null,
      visitorId: input.visitorId || null,
      ipAddress,
      userAgent,
    },
  });

  // Telemetry: link visitor session to enquiry for funnel conversion analytics
  if (input.visitorId) {
    prisma.userSession
      .updateMany({
        where: { visitorId: input.visitorId },
        data: {
          converted: true,
          enquiryId: enquiry.id,
          name: input.name,
          phone: input.phone,
          email: input.email || null,
        },
      })
      .catch((err: unknown) =>
        console.warn('[Telemetry] Could not link session to enquiry:', err)
      );
  }

  return {
    success: true,
    id: enquiry.id,
    duplicate: false,
    message: 'Enquiry received and saved successfully.',
  };
}
