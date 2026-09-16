"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAdmin);
router.get('/', async (_req, res) => {
    try {
        let settings = await prisma_1.prisma.siteSetting.findUnique({
            where: { id: 'global' },
        });
        if (!settings) {
            settings = await prisma_1.prisma.siteSetting.create({
                data: {
                    id: 'global',
                    siteTitle: 'The Indian Wings Company | Premium Kashmir Travel',
                    siteDesc: 'Curated Kashmir holiday packages, luxury stays, and private transfers.',
                },
            });
        }
        const packages = await prisma_1.prisma.package.findMany({
            select: { noIndex: true },
        });
        const totalIndexed = packages.filter((p) => !p.noIndex).length;
        const totalExcluded = packages.filter((p) => p.noIndex).length;
        res.json({
            success: true,
            settings,
            sitemap: {
                totalIndexedPackages: totalIndexed,
                totalExcludedPackages: totalExcluded,
                sitemapUrl: '/sitemap.xml',
                robotsUrl: '/robots.txt',
                lastUpdated: new Date().toISOString(),
            },
        });
    }
    catch (err) {
        console.error('[API /api/admin/seo GET] Error:', err);
        res.status(500).json({ error: 'Failed to fetch SEO settings' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { siteTitle, siteDesc, robotsTxtCustom } = req.body;
        const updated = await prisma_1.prisma.siteSetting.upsert({
            where: { id: 'global' },
            update: {
                siteTitle: siteTitle?.trim(),
                siteDesc: siteDesc?.trim(),
                robotsTxtCustom: robotsTxtCustom !== undefined ? robotsTxtCustom : undefined,
            },
            create: {
                id: 'global',
                siteTitle: siteTitle?.trim() || 'The Indian Wings Company | Premium Kashmir Travel',
                siteDesc: siteDesc?.trim() || 'Curated Kashmir holiday packages, luxury stays, and private transfers.',
                robotsTxtCustom: robotsTxtCustom || null,
            },
        });
        res.json({ success: true, settings: updated });
    }
    catch (err) {
        console.error('[API /api/admin/seo POST] Error:', err);
        res.status(500).json({ error: 'Failed to update SEO settings' });
    }
});
exports.default = router;
