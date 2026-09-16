"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const [vehicles, routes] = await Promise.all([
            prisma_1.prisma.transportVehicle.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
            prisma_1.prisma.transportRoute.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        ]);
        res.json({ success: true, vehicles, routes });
    }
    catch (err) {
        console.error('[Public/Transport] Error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch transport data' });
    }
});
exports.default = router;
