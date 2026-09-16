"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAdmin);
// ==========================================
// VEHICLES
// ==========================================
router.get('/vehicles', async (_req, res) => {
    try {
        const vehicles = await prisma_1.prisma.transportVehicle.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        });
        res.json({ success: true, vehicles });
    }
    catch (err) {
        console.error('[API /api/admin/transport/vehicles GET] Error:', err);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
});
router.post('/vehicles', async (req, res) => {
    try {
        const body = req.body;
        const { name, slug, category = 'Luxury MPV', seats = '6+1 Seats', bags = '4 Bags', ac = 'AC & Heater', fuel = 'Diesel', imageUrl = '/images/fleet/innova-crysta.jpg', pricePerDay = 3500, tags = [], badge = null, isActive = true, sortOrder = 0, } = body;
        if (!name) {
            return res.status(400).json({ error: 'Vehicle name is required' });
        }
        const cleanSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const created = await prisma_1.prisma.transportVehicle.create({
            data: {
                name: name.trim(),
                slug: cleanSlug,
                category,
                seats: seats.trim(),
                bags: bags.trim(),
                ac: ac.trim(),
                fuel: fuel.trim(),
                imageUrl: imageUrl.trim(),
                pricePerDay: Number(pricePerDay) || 3500,
                tags: Array.isArray(tags) ? tags : [],
                badge: badge ? badge.trim() : null,
                isActive: Boolean(isActive),
                sortOrder: Number(sortOrder) || 0,
            },
        });
        res.json({ success: true, vehicle: created });
    }
    catch (err) {
        console.error('[API /api/admin/transport/vehicles POST] Error:', err);
        res.status(500).json({ error: 'Failed to create vehicle' });
    }
});
router.put('/vehicles/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const updated = await prisma_1.prisma.transportVehicle.update({
            where: { id },
            data: {
                ...(body.name !== undefined && { name: body.name.trim() }),
                ...(body.slug !== undefined && { slug: body.slug.trim().toLowerCase() }),
                ...(body.category !== undefined && { category: body.category }),
                ...(body.seats !== undefined && { seats: body.seats.trim() }),
                ...(body.bags !== undefined && { bags: body.bags.trim() }),
                ...(body.ac !== undefined && { ac: body.ac.trim() }),
                ...(body.fuel !== undefined && { fuel: body.fuel.trim() }),
                ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl.trim() }),
                ...(body.pricePerDay !== undefined && { pricePerDay: Number(body.pricePerDay) }),
                ...(body.tags !== undefined && { tags: body.tags }),
                ...(body.badge !== undefined && { badge: body.badge ? body.badge.trim() : null }),
                ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
                ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
            },
        });
        res.json({ success: true, vehicle: updated });
    }
    catch (err) {
        console.error('[API /api/admin/transport/vehicles/:id PUT] Error:', err);
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
});
router.delete('/vehicles/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.prisma.transportVehicle.delete({
            where: { id },
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error('[API /api/admin/transport/vehicles/:id DELETE] Error:', err);
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
});
// ==========================================
// ROUTES
// ==========================================
router.get('/routes', async (_req, res) => {
    try {
        const routes = await prisma_1.prisma.transportRoute.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        });
        res.json({ success: true, routes });
    }
    catch (err) {
        console.error('[API /api/admin/transport/routes GET] Error:', err);
        res.status(500).json({ error: 'Failed to fetch routes' });
    }
});
router.post('/routes', async (req, res) => {
    try {
        const body = req.body;
        const { origin = 'Srinagar', destination, routeTitle, via = 'Direct Highway', distance = '50 km', duration = '1.5 hrs', startingPrice = 2500, highlights = [], cabs = 'Sedan, Innova Crysta, Tempo', isPopular = false, isActive = true, sortOrder = 0, } = body;
        if (!destination || !routeTitle) {
            return res.status(400).json({ error: 'Destination and Route Title are required' });
        }
        const created = await prisma_1.prisma.transportRoute.create({
            data: {
                origin: origin.trim(),
                destination: destination.trim(),
                routeTitle: routeTitle.trim(),
                via: via.trim(),
                distance: distance.trim(),
                duration: duration.trim(),
                startingPrice: Number(startingPrice) || 2500,
                highlights: Array.isArray(highlights) ? highlights : [],
                cabs: cabs.trim(),
                isPopular: Boolean(isPopular),
                isActive: Boolean(isActive),
                sortOrder: Number(sortOrder) || 0,
            },
        });
        res.json({ success: true, route: created });
    }
    catch (err) {
        console.error('[API /api/admin/transport/routes POST] Error:', err);
        res.status(500).json({ error: 'Failed to create route' });
    }
});
router.put('/routes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const updated = await prisma_1.prisma.transportRoute.update({
            where: { id },
            data: {
                ...(body.origin !== undefined && { origin: body.origin.trim() }),
                ...(body.destination !== undefined && { destination: body.destination.trim() }),
                ...(body.routeTitle !== undefined && { routeTitle: body.routeTitle.trim() }),
                ...(body.via !== undefined && { via: body.via.trim() }),
                ...(body.distance !== undefined && { distance: body.distance.trim() }),
                ...(body.duration !== undefined && { duration: body.duration.trim() }),
                ...(body.startingPrice !== undefined && { startingPrice: Number(body.startingPrice) }),
                ...(body.highlights !== undefined && { highlights: body.highlights }),
                ...(body.cabs !== undefined && { cabs: body.cabs.trim() }),
                ...(body.isPopular !== undefined && { isPopular: Boolean(body.isPopular) }),
                ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
                ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
            },
        });
        res.json({ success: true, route: updated });
    }
    catch (err) {
        console.error('[API /api/admin/transport/routes/:id PUT] Error:', err);
        res.status(500).json({ error: 'Failed to update route' });
    }
});
router.delete('/routes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await prisma_1.prisma.transportRoute.delete({
            where: { id },
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error('[API /api/admin/transport/routes/:id DELETE] Error:', err);
        res.status(500).json({ error: 'Failed to delete route' });
    }
});
exports.default = router;
