import { z } from 'zod';

function sanitizeString(val: string): string {
  if (!val) return '';
  return val
    .replace(/<[^>]*>?/gm, '')
    .replace(/javascript:/gi, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
}

function sanitizePhone(val: string): string {
  if (!val) return '';
  return val.replace(/[^\d+]/g, '').trim();
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
    .regex(/^[+]?[\d\s().-]{7,25}$/, 'Please enter a valid phone number')
    .transform(sanitizePhone),
  email: z.string().email('Please enter a valid email address').max(120).optional().or(z.literal('')),
  travelDate: z.string().min(2).max(100).transform(sanitizeString),
  guests: z.string().max(50).default('2-4 Guests').transform(sanitizeString),
  tripType: z.string().max(80).default('Kashmir Classic').transform(sanitizeString),
  message: z.string().max(1000).optional().or(z.literal('')).transform((val) => (val ? sanitizeString(val) : '')),
  source: z.string().max(80).default('website_inline').transform(sanitizeString),
  hpField: z.string().optional().or(z.literal('')),
  idempotencyKey: z.string().max(100).optional().nullable(),
  visitorId: z.string().max(100).optional().nullable(),
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
