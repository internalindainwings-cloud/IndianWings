import { z } from 'zod';

/**
 * Security: Strips dangerous HTML tags, javascript pseudo-protocols, and control characters
 */
export function sanitizeString(val: string): string {
  if (!val) return '';
  return val
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Strip javascript: protocol
    .replace(/[\x00-\x1F\x7F]/g, '') // Strip non-printable control characters
    .trim();
}

/**
 * Security: Normalizes phone number into clean digits with optional leading +
 */
export function sanitizePhone(val: string): string {
  if (!val) return '';
  const cleaned = val.replace(/[^\d+]/g, '').trim();
  return cleaned;
}

export const enquirySchema = z.object({
  name: z
    .string()
    .min(2, 'Please enter your full name (minimum 2 characters)')
    .max(100, 'Name cannot exceed 100 characters')
    .transform(sanitizeString),
  phone: z
    .string()
    .min(7, 'Please enter a valid phone or WhatsApp number')
    .max(25, 'Phone number is too long')
    .regex(
      /^[+]?[\d\s().-]{7,25}$/,
      'Please enter a valid phone number with digits only'
    )
    .transform(sanitizePhone),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(120, 'Email is too long')
    .optional()
    .or(z.literal('')),
  travelDate: z
    .string()
    .min(2, 'Please specify your tentative travel date or month')
    .max(100, 'Travel date text is too long')
    .transform(sanitizeString),
  guests: z.string().max(50).default('2-4 Guests').transform(sanitizeString),
  tripType: z.string().max(80).default('Kashmir Classic').transform(sanitizeString),
  message: z
    .string()
    .max(1000, 'Message cannot exceed 1000 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => (val ? sanitizeString(val) : '')),
  source: z.string().max(80).default('website_inline').transform(sanitizeString),

  // Security: Honeypot field (bots fill this invisible input; real humans leave it empty)
  hpField: z.string().optional().or(z.literal('')),

  // Duplicate submission / idempotency token
  idempotencyKey: z.string().max(100).optional().nullable(),
  visitorId: z.string().max(100).optional().nullable(),

  // Attribution parameters
  utmSource: z.string().max(100).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
  utmMedium: z.string().max(100).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
  utmCampaign: z.string().max(150).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
  utmTerm: z.string().max(150).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
  utmContent: z.string().max(150).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
  gclid: z.string().max(150).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
  fbclid: z.string().max(150).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
  referrer: z.string().max(300).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
}).strict();

export type EnquiryInput = z.infer<typeof enquirySchema>;
