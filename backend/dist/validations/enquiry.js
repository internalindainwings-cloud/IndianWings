"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquirySchema = void 0;
const zod_1 = require("zod");
function sanitizeString(val) {
    if (!val)
        return '';
    return val
        .replace(/<[^>]*>?/gm, '')
        .replace(/javascript:/gi, '')
        .replace(/[\x00-\x1F\x7F]/g, '')
        .trim();
}
function sanitizePhone(val) {
    if (!val)
        return '';
    return val.replace(/[^\d+]/g, '').trim();
}
exports.enquirySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Please enter your full name (minimum 2 characters)')
        .max(100, 'Name cannot exceed 100 characters')
        .transform(sanitizeString),
    phone: zod_1.z
        .string()
        .min(7, 'Please enter a valid phone or WhatsApp number')
        .max(25, 'Phone number is too long')
        .regex(/^[+]?[\d\s().-]{7,25}$/, 'Please enter a valid phone number')
        .transform(sanitizePhone),
    email: zod_1.z.string().email('Please enter a valid email address').max(120).optional().or(zod_1.z.literal('')),
    travelDate: zod_1.z.string().min(2).max(100).transform(sanitizeString),
    guests: zod_1.z.string().max(50).default('2-4 Guests').transform(sanitizeString),
    tripType: zod_1.z.string().max(80).default('Kashmir Classic').transform(sanitizeString),
    message: zod_1.z.string().max(1000).optional().or(zod_1.z.literal('')).transform((val) => (val ? sanitizeString(val) : '')),
    source: zod_1.z.string().max(80).default('website_inline').transform(sanitizeString),
    hpField: zod_1.z.string().optional().or(zod_1.z.literal('')),
    idempotencyKey: zod_1.z.string().max(100).optional().nullable(),
    visitorId: zod_1.z.string().max(100).optional().nullable(),
    utmSource: zod_1.z.string().max(100).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
    utmMedium: zod_1.z.string().max(100).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
    utmCampaign: zod_1.z.string().max(150).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
    utmTerm: zod_1.z.string().max(150).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
    utmContent: zod_1.z.string().max(150).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
    gclid: zod_1.z.string().max(150).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
    fbclid: zod_1.z.string().max(150).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
    referrer: zod_1.z.string().max(300).optional().nullable().transform((v) => (v ? sanitizeString(v) : null)),
}).strict();
