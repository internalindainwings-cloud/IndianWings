"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const settings = await prisma_1.prisma.siteSetting.findUnique({ where: { id: 'global' } });
        res.json({
            success: true,
            settings: {
                phone: settings?.phone ?? '+91 99060 00000',
                email: settings?.email ?? 'info@theindianwingscompany.com',
                whatsapp: settings?.whatsapp ?? '+919906000000',
                address: settings?.address ?? 'Boulevard Road, Dal Lake, Srinagar, Jammu & Kashmir 190001',
                announcementEnabled: settings?.announcementEnabled ?? false,
                announcementText: settings?.announcementText ?? '',
                announcementLink: settings?.announcementLink ?? '/packages',
                siteTitle: settings?.siteTitle ?? 'The Indian Wings Company',
            },
        });
    }
    catch (err) {
        console.error('[Public/Settings] Error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch settings' });
    }
});
exports.default = router;
