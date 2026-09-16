"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const destinations = await prisma_1.prisma.destination.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
        res.json({ success: true, destinations });
    }
    catch (err) {
        console.error('[Public/Destinations] Error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch destinations' });
    }
});
exports.default = router;
