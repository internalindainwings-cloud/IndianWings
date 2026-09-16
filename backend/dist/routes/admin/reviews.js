"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAdmin);
router.get('/', async (req, res) => {
    try {
        const type = req.query.type;
        const reviews = await prisma_1.prisma.customerReview.findMany({
            where: type ? { type } : undefined,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
        res.json({ success: true, reviews });
    }
    catch (err) {
        console.error('[API /api/admin/reviews GET] Error:', err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const { name, city, review, rating = 5, avatarUrl = null, type = 'written', videoUrl = null, videoDuration = null, videoQuote = null, imageUrl = null, featured = false, isActive = true, sortOrder = 0, } = body;
        if (!name || !review) {
            return res.status(400).json({ error: 'Customer name and review text are required' });
        }
        const created = await prisma_1.prisma.customerReview.create({
            data: {
                name: name.trim(),
                city: city ? city.trim() : 'India',
                review: review.trim(),
                rating: Number(rating) || 5,
                avatarUrl: avatarUrl ? avatarUrl.trim() : null,
                type,
                videoUrl: videoUrl ? videoUrl.trim() : null,
                videoDuration: videoDuration ? videoDuration.trim() : null,
                videoQuote: videoQuote ? videoQuote.trim() : null,
                imageUrl: imageUrl ? imageUrl.trim() : null,
                featured: Boolean(featured),
                isActive: Boolean(isActive),
                sortOrder: Number(sortOrder) || 0,
            },
        });
        res.json({ success: true, review: created });
    }
    catch (err) {
        console.error('[API /api/admin/reviews POST] Error:', err);
        res.status(500).json({ error: 'Failed to create review' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const updated = await prisma_1.prisma.customerReview.update({
            where: { id },
            data: {
                ...(body.name !== undefined && { name: body.name.trim() }),
                ...(body.city !== undefined && { city: body.city.trim() }),
                ...(body.review !== undefined && { review: body.review.trim() }),
                ...(body.rating !== undefined && { rating: Number(body.rating) }),
                ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl ? body.avatarUrl.trim() : null }),
                ...(body.type !== undefined && { type: body.type }),
                ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl ? body.videoUrl.trim() : null }),
                ...(body.videoDuration !== undefined && { videoDuration: body.videoDuration ? body.videoDuration.trim() : null }),
                ...(body.videoQuote !== undefined && { videoQuote: body.videoQuote ? body.videoQuote.trim() : null }),
                ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl ? body.imageUrl.trim() : null }),
                ...(body.featured !== undefined && { featured: Boolean(body.featured) }),
                ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
                ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
            },
        });
        res.json({ success: true, review: updated });
    }
    catch (err) {
        console.error('[API /api/admin/reviews/:id PUT] Error:', err);
        res.status(500).json({ error: 'Failed to update review' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.prisma.customerReview.delete({
            where: { id },
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error('[API /api/admin/reviews/:id DELETE] Error:', err);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});
exports.default = router;
