"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const type = req.query.type;
        const reviews = await prisma_1.prisma.customerReview.findMany({
            where: { isActive: true, ...(type ? { type } : {}) },
            orderBy: { sortOrder: 'asc' },
        });
        res.json({ success: true, reviews });
    }
    catch (err) {
        console.error('[Public/Reviews] Error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
});
exports.default = router;
