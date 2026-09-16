"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const redis_1 = require("../../lib/redis");
const rateLimit_1 = require("../../middleware/rateLimit");
const env_1 = require("../../config/env");
const router = (0, express_1.Router)();
router.post('/login', (0, rateLimit_1.createRateLimitMiddleware)(redis_1.adminLoginLimiter), async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || typeof password !== 'string') {
            res.status(400).json({ success: false, error: 'Password is required' });
            return;
        }
        if (!(0, auth_1.verifyAdminPassword)(password)) {
            res.status(401).json({ success: false, error: 'Invalid password' });
            return;
        }
        const token = (0, auth_1.createAdminToken)('admin');
        res.cookie(auth_1.COOKIE_NAME, token, {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: env_1.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: auth_1.SESSION_MAX_AGE * 1000,
            path: '/',
        });
        res.json({ success: true, message: 'Login successful' });
    }
    catch (err) {
        console.error('[Auth] Login error:', err);
        res.status(500).json({ success: false, error: 'Authentication failed' });
    }
});
router.post('/logout', (_req, res) => {
    res.cookie(auth_1.COOKIE_NAME, '', {
        httpOnly: true,
        secure: env_1.env.NODE_ENV === 'production',
        sameSite: env_1.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 0,
        path: '/',
    });
    res.json({ success: true, message: 'Logged out successfully' });
});
exports.default = router;
