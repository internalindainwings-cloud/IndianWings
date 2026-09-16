"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAdmin);
router.get('/', async (_req, res) => {
    try {
        const categories = await prisma_1.prisma.packageCategory.findMany({
            orderBy: { sortOrder: 'asc' },
        });
        res.json({ success: true, categories });
    }
    catch (err) {
        console.error('[API /api/admin/categories GET] Error:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const { name, slug, description, sortOrder } = body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Category name is required' });
        }
        const categorySlug = (slug || name)
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
        const newCategory = await prisma_1.prisma.packageCategory.upsert({
            where: { slug: categorySlug },
            update: {
                name: name.trim(),
                description: description?.trim() || null,
                sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
            },
            create: {
                slug: categorySlug,
                name: name.trim(),
                description: description?.trim() || null,
                sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
                isActive: true,
            },
        });
        res.json({ success: true, category: newCategory });
    }
    catch (err) {
        console.error('[API /api/admin/categories POST] Error:', err);
        res.status(500).json({ error: 'Failed to create category' });
    }
});
exports.default = router;
