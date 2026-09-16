"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
    }
    catch {
        res.status(503).json({ status: 'degraded', db: 'disconnected' });
    }
});
exports.default = router;
