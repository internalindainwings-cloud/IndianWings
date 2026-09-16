"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const redis_1 = require("../lib/redis");
const rateLimit_1 = require("../middleware/rateLimit");
const requestSize_1 = require("../middleware/requestSize");
const email_1 = require("../services/email");
const router = (0, express_1.Router)();
const itineraryDownloadSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address').max(120),
    name: zod_1.z.string().max(100).optional().default(''),
    phone: zod_1.z.string().max(25).optional().default(''),
    packageSlug: zod_1.z.string().max(120),
    packageTitle: zod_1.z.string().max(150),
    duration: zod_1.z.string().max(50).default('6 Nights / 7 Days'),
    startingPrice: zod_1.z.number().default(0),
    destinations: zod_1.z.array(zod_1.z.string()).default([]),
    itinerary: zod_1.z.array(zod_1.z.object({
        day: zod_1.z.number(),
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        activities: zod_1.z.array(zod_1.z.string()).optional(),
        meals: zod_1.z.string().optional(),
        stay: zod_1.z.string().optional(),
    })).default([]),
    inclusions: zod_1.z.array(zod_1.z.string()).default([]),
    visitorId: zod_1.z.string().optional(),
    utmSource: zod_1.z.string().optional(),
    utmMedium: zod_1.z.string().optional(),
    utmCampaign: zod_1.z.string().optional(),
});
router.post('/download', (0, requestSize_1.requestSizeLimit)(50 * 1024), // 50KB for itinerary payload
(0, rateLimit_1.createRateLimitMiddleware)(redis_1.itineraryLimiter), async (req, res) => {
    try {
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
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
        const enquiry = await prisma_1.prisma.enquiry.create({
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
            prisma_1.prisma.userSession.updateMany({
                where: { visitorId: data.visitorId },
                data: { converted: true, enquiryId: enquiry.id, name: leadName !== 'Traveler' ? leadName : undefined, email: data.email.trim().toLowerCase() },
            }).catch((err) => console.warn('[Telemetry] Could not link session on download:', err));
        }
        const emailResult = await (0, email_1.sendItineraryEmail)({
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
    }
    catch (err) {
        console.error('[Itinerary] Download error:', err);
        res.status(500).json({
            success: false,
            error: 'Unable to process itinerary request. Please try again or message on WhatsApp.',
        });
    }
});
exports.default = router;
