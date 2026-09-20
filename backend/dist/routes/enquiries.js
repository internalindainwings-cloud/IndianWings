"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const redis_1 = require("../lib/redis");
const rateLimit_1 = require("../middleware/rateLimit");
const auth_1 = require("../middleware/auth");
const requestSize_1 = require("../middleware/requestSize");
const originGuard_1 = require("../middleware/originGuard");
const enquiry_1 = require("../validations/enquiry");
const enquiry_2 = require("../services/enquiry");
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
router.post('/', (0, requestSize_1.requestSizeLimit)(), originGuard_1.validateOrigin, (0, rateLimit_1.createRateLimitMiddleware)(redis_1.enquiryLimiter), async (req, res) => {
    try {
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
            req.headers['x-real-ip'] ||
            req.socket.remoteAddress ||
            '127.0.0.1';
        const rawBody = req.body;
        // Honeypot: bots fill hidden fields, humans leave them empty
        const hpField = rawBody.hpField;
        if (hpField && hpField.trim() !== '') {
            console.warn(`[Security] Bot submission blocked by honeypot from IP: ${ipAddress}`);
            res.json({ success: true, message: 'Enquiry received successfully' });
            return;
        }
        const validation = enquiry_1.enquirySchema.safeParse(rawBody);
        if (!validation.success) {
            res.status(400).json({
                success: false,
                error: 'Validation failed',
                fields: validation.error.flatten().fieldErrors,
            });
            return;
        }
        const userAgent = (req.headers['user-agent'] || 'unknown').slice(0, 500);
        const result = await (0, enquiry_2.createEnquiryRecord)(validation.data, { ipAddress, userAgent });
        if (result.duplicate) {
            res.json({ success: true, id: result.id, message: result.message });
            return;
        }
        res.status(201).json({ success: true, id: result.id, message: result.message });
    }
    catch (err) {
        console.error('[Enquiries] POST error:', err);
        res.status(500).json({
            success: false,
            error: 'Could not save enquiry. Please contact us directly on WhatsApp.',
        });
    }
});
router.get('/', auth_1.requireAdmin, async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const bearerAuthed = env_1.env.ADMIN_API_SECRET && authHeader === `Bearer ${env_1.env.ADMIN_API_SECRET}`;
        // requireAdmin middleware already checked the cookie; also allow Bearer token
        // If requireAdmin didn't pass AND bearer is also invalid, we already got 401 from middleware
        // This check is redundant here since requireAdmin runs first, but kept for explicit Bearer support
        void bearerAuthed;
        const enquiries = await prisma_1.prisma.enquiry.findMany({
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
        res.json({ success: true, count: enquiries.length, enquiries });
    }
    catch (err) {
        console.error('[Enquiries] GET error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch enquiries' });
    }
});
exports.default = router;
