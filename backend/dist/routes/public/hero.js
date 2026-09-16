"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const router = (0, express_1.Router)();
const DEFAULT_HERO = {
    videoUrl: 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4',
    posterUrl: 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg',
    slides: [],
    trustPills: [],
};
router.get('/', async (_req, res) => {
    try {
        const settings = await prisma_1.prisma.siteSetting.findUnique({ where: { id: 'global' }, select: { heroConfig: true } });
        const hero = settings?.heroConfig ?? DEFAULT_HERO;
        res.json({ success: true, hero });
    }
    catch (err) {
        console.error('[Public/Hero] Error:', err);
        res.json({ success: true, hero: DEFAULT_HERO });
    }
});
exports.default = router;
