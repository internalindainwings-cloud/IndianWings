"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const category = req.query.category;
        const [packages, categories] = await Promise.all([
            prisma_1.prisma.package.findMany({
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' },
                include: { category: true },
            }),
            prisma_1.prisma.packageCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
        ]);
        const filtered = category
            ? packages.filter((p) => p.categorySlug.toLowerCase() === category.toLowerCase())
            : packages;
        res.json({ success: true, packages: filtered, categories });
    }
    catch (err) {
        console.error('[Public/Packages] Error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch packages' });
    }
});
exports.default = router;
