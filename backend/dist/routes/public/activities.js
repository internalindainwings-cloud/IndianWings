"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const activities = await prisma_1.prisma.activity.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
        res.json({ success: true, activities });
    }
    catch (err) {
        console.error('[Public/Activities] Error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch activities' });
    }
});
exports.default = router;
