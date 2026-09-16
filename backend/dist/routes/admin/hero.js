"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHeroConfig = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
exports.defaultHeroConfig = {
    headline: 'Discover the Magic of Kashmir',
    subheadline: 'Curated luxury houseboats, alpine ski resorts, and private chauffeured tours across paradise.',
    primaryCtaText: 'Get Free Quote',
    secondaryCtaText: 'Explore Packages',
    secondaryCtaLink: '/packages',
    videoUrl: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
    posterUrl: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
    slides: [
        {
            id: 'dal-lake',
            title: 'Dal Lake & Houseboats',
            videoSrc: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
            poster: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
        },
        {
            id: 'gulmarg',
            title: 'Gulmarg Alpine Meadows',
            videoSrc: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
            poster: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
        },
        {
            id: 'pahalgam',
            title: 'Pahalgam Valley & Lidder River',
            videoSrc: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
            poster: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
        },
    ],
    trustPills: [
        {
            id: 'pill-1',
            icon: 'users',
            value: '600+',
            label: 'Happy Families',
        },
        {
            id: 'pill-2',
            icon: 'star',
            value: '★ 4.9',
            label: 'Google Reviews',
        },
        {
            id: 'pill-3',
            icon: 'award',
            value: '15+ Years',
            label: 'Valley Experience',
        },
    ],
};
router.use(auth_1.requireAdmin);
router.get('/', async (_req, res) => {
    try {
        const settings = await prisma_1.prisma.siteSetting.findUnique({
            where: { id: 'global' },
            select: { heroConfig: true },
        });
        const stored = settings?.heroConfig;
        const hero = stored
            ? {
                ...exports.defaultHeroConfig,
                ...stored,
                slides: Array.isArray(stored.slides) && stored.slides.length > 0 ? stored.slides : exports.defaultHeroConfig.slides,
                trustPills: Array.isArray(stored.trustPills) && stored.trustPills.length > 0 ? stored.trustPills : exports.defaultHeroConfig.trustPills,
            }
            : exports.defaultHeroConfig;
        res.json({ success: true, hero });
    }
    catch (err) {
        console.error('[API /api/admin/hero GET] Error:', err);
        res.status(500).json({ error: 'Failed to fetch hero settings' });
    }
});
router.put('/', async (req, res) => {
    try {
        const body = req.body;
        // Get current
        const settings = await prisma_1.prisma.siteSetting.findUnique({
            where: { id: 'global' },
            select: { heroConfig: true },
        });
        const current = settings?.heroConfig ?? exports.defaultHeroConfig;
        const updated = {
            ...current,
            ...body,
            slides: Array.isArray(body.slides) ? body.slides : current.slides,
            trustPills: Array.isArray(body.trustPills) ? body.trustPills : current.trustPills,
        };
        await prisma_1.prisma.siteSetting.upsert({
            where: { id: 'global' },
            update: { heroConfig: updated },
            create: { id: 'global', heroConfig: updated },
        });
        res.json({ success: true, hero: updated });
    }
    catch (err) {
        console.error('[API /api/admin/hero PUT] Error:', err);
        res.status(500).json({ error: 'Failed to update hero settings' });
    }
});
exports.default = router;
