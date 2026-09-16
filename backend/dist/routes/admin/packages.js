"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
function slugify(text) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}
function generatePackageSlug(title, duration) {
    const durationPart = duration.replace(/\s/g, '-').replace(/[^a-z0-9-]/gi, '').toLowerCase();
    return `${slugify(title)}-${durationPart}`;
}
function buildItineraryPayload(body) {
    const itinerary = body.itinerary;
    if (itinerary && typeof itinerary === 'object' && !Array.isArray(itinerary)) {
        const itin = itinerary;
        return {
            days: Array.isArray(itin.days) ? itin.days : [],
            overviewParagraph: itin.overviewParagraph || body.overviewParagraph || null,
            stays: Array.isArray(itin.stays) ? itin.stays : (body.stays || []),
            transports: Array.isArray(itin.transports) ? itin.transports : (body.transports || []),
            faqs: Array.isArray(itin.faqs) ? itin.faqs : (body.faqs || []),
            cancellationPolicy: Array.isArray(itin.cancellationPolicy) ? itin.cancellationPolicy : (body.cancellationPolicy || []),
        };
    }
    if (body.stays || body.transports || body.faqs || body.cancellationPolicy || body.overviewParagraph) {
        return {
            days: Array.isArray(itinerary) ? itinerary : [],
            overviewParagraph: body.overviewParagraph || null,
            stays: Array.isArray(body.stays) ? body.stays : [],
            transports: Array.isArray(body.transports) ? body.transports : [],
            faqs: Array.isArray(body.faqs) ? body.faqs : [],
            cancellationPolicy: Array.isArray(body.cancellationPolicy) ? body.cancellationPolicy : [],
        };
    }
    return itinerary || [];
}
router.get('/', auth_1.requireAdmin, async (_req, res) => {
    try {
        const packages = await prisma_1.prisma.package.findMany({
            orderBy: { sortOrder: 'asc' },
            include: { category: true },
        });
        res.json({ success: true, packages });
    }
    catch (err) {
        console.error('[Admin/Packages] GET error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch packages' });
    }
});
router.post('/', auth_1.requireAdmin, async (req, res) => {
    try {
        const body = req.body;
        const { title, duration, startingPrice } = body;
        if (!title || !duration || !startingPrice) {
            res.status(400).json({ success: false, error: 'Title, duration, and starting price are required' });
            return;
        }
        let slug = body.slug ? String(body.slug).trim().toLowerCase().replace(/[^\w-]/g, '-') : generatePackageSlug(String(title), String(duration));
        const existing = await prisma_1.prisma.package.findUnique({ where: { slug } });
        if (existing)
            slug = `${slug}-${Date.now().toString().slice(-4)}`;
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theindianwings.com';
        const newPackage = await prisma_1.prisma.package.create({
            data: {
                slug,
                title: String(title).trim(),
                categorySlug: String(body.categorySlug || 'featured'),
                categoryId: body.categoryId ? String(body.categoryId) : null,
                duration: String(duration).trim(),
                tag: String(body.tag || 'Best Seller'),
                tagColor: String(body.cardAnimation || body.tagColor || ''),
                imageUrl: String(body.imageUrl || '/images/gallery/shikara-dal-lake.jpg'),
                videoUrl: body.videoUrl && String(body.videoUrl).trim() !== '' ? String(body.videoUrl).trim() : null,
                galleryUrls: Array.isArray(body.galleryUrls) ? body.galleryUrls : [],
                rating: typeof body.rating === 'number' ? body.rating : 4.9,
                reviewCount: typeof body.reviewCount === 'number' ? body.reviewCount : 1,
                destinations: Array.isArray(body.destinations) ? body.destinations : [],
                inclusions: Array.isArray(body.inclusions) ? body.inclusions : [],
                exclusions: Array.isArray(body.exclusions) ? body.exclusions : [],
                highlights: Array.isArray(body.highlights) ? body.highlights : [],
                startingPrice: parseInt(String(startingPrice), 10),
                originalPrice: body.originalPrice ? parseInt(String(body.originalPrice), 10) : null,
                isFeatured: Boolean(body.isFeatured),
                isActive: body.isActive !== false,
                itinerary: buildItineraryPayload(body),
                metaTitle: String(body.metaTitle || `${title} (${duration}) | The Indian Wings Company`),
                metaDescription: String(body.metaDescription || `Book ${title} in Kashmir with verified stays and private cab.`),
                keywords: Array.isArray(body.keywords) ? body.keywords : [],
                canonicalUrl: String(body.canonicalUrl || `${siteUrl}/packages/${slug}`),
                noIndex: Boolean(body.noIndex),
            },
        });
        res.status(201).json({ success: true, package: newPackage });
    }
    catch (err) {
        console.error('[Admin/Packages] POST error:', err);
        res.status(500).json({ success: false, error: 'Failed to create package' });
    }
});
router.get('/:id', auth_1.requireAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const pkg = await prisma_1.prisma.package.findUnique({ where: { id }, include: { category: true } });
        if (!pkg) {
            res.status(404).json({ success: false, error: 'Package not found' });
            return;
        }
        res.json({ success: true, package: pkg });
    }
    catch (err) {
        console.error('[Admin/Packages] GET error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch package' });
    }
});
router.put('/:id', auth_1.requireAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const updateData = {};
        if (body.title !== undefined)
            updateData.title = String(body.title).trim();
        if (body.slug !== undefined)
            updateData.slug = String(body.slug).trim().toLowerCase();
        if (body.categorySlug !== undefined)
            updateData.categorySlug = body.categorySlug;
        if (body.categoryId !== undefined)
            updateData.categoryId = body.categoryId;
        if (body.duration !== undefined)
            updateData.duration = String(body.duration).trim();
        if (body.tag !== undefined)
            updateData.tag = body.tag;
        if (body.tagColor !== undefined || body.cardAnimation !== undefined)
            updateData.tagColor = body.cardAnimation || body.tagColor || null;
        if (body.imageUrl !== undefined)
            updateData.imageUrl = body.imageUrl;
        if (body.videoUrl !== undefined)
            updateData.videoUrl = body.videoUrl && String(body.videoUrl).trim() !== '' ? String(body.videoUrl).trim() : null;
        if (body.galleryUrls !== undefined)
            updateData.galleryUrls = body.galleryUrls;
        if (body.rating !== undefined)
            updateData.rating = parseFloat(String(body.rating));
        if (body.reviewCount !== undefined)
            updateData.reviewCount = parseInt(String(body.reviewCount), 10);
        if (body.destinations !== undefined)
            updateData.destinations = body.destinations;
        if (body.inclusions !== undefined)
            updateData.inclusions = body.inclusions;
        if (body.exclusions !== undefined)
            updateData.exclusions = body.exclusions;
        if (body.highlights !== undefined)
            updateData.highlights = body.highlights;
        if (body.startingPrice !== undefined)
            updateData.startingPrice = parseInt(String(body.startingPrice), 10);
        if (body.originalPrice !== undefined)
            updateData.originalPrice = body.originalPrice ? parseInt(String(body.originalPrice), 10) : null;
        if (body.isFeatured !== undefined)
            updateData.isFeatured = Boolean(body.isFeatured);
        if (body.isActive !== undefined)
            updateData.isActive = Boolean(body.isActive);
        if (body.itinerary !== undefined || body.stays !== undefined || body.transports !== undefined || body.faqs !== undefined || body.cancellationPolicy !== undefined || body.overviewParagraph !== undefined) {
            updateData.itinerary = buildItineraryPayload(body);
        }
        if (body.metaTitle !== undefined)
            updateData.metaTitle = body.metaTitle;
        if (body.metaDescription !== undefined)
            updateData.metaDescription = body.metaDescription;
        if (body.keywords !== undefined)
            updateData.keywords = body.keywords;
        if (body.canonicalUrl !== undefined)
            updateData.canonicalUrl = body.canonicalUrl;
        if (body.noIndex !== undefined)
            updateData.noIndex = Boolean(body.noIndex);
        const updated = await prisma_1.prisma.package.update({ where: { id }, data: updateData });
        res.json({ success: true, package: updated });
    }
    catch (err) {
        console.error('[Admin/Packages] PUT error:', err);
        res.status(500).json({ success: false, error: 'Failed to update package' });
    }
});
router.delete('/:id', auth_1.requireAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.prisma.package.delete({ where: { id } });
        res.json({ success: true, message: 'Package deleted' });
    }
    catch (err) {
        console.error('[Admin/Packages] DELETE error:', err);
        res.status(500).json({ success: false, error: 'Failed to delete package' });
    }
});
exports.default = router;
