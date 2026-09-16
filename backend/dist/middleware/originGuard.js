"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateOrigin = validateOrigin;
const env_1 = require("../config/env");
const PRODUCTION_ALLOWED_ORIGINS = new Set([
    env_1.env.FRONTEND_ORIGIN,
    env_1.env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean));
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
function getClientOrigin(req) {
    return req.get('origin') ?? null;
}
function validateOrigin(req, res, next) {
    if (env_1.env.NODE_ENV !== 'production') {
        return next();
    }
    if (SAFE_METHODS.has(req.method)) {
        return next();
    }
    const origin = getClientOrigin(req);
    if (!origin) {
        res.status(403).json({ success: false, error: 'Forbidden: missing Origin header' });
        return;
    }
    try {
        const originHost = new URL(origin).origin;
        const allowed = [...PRODUCTION_ALLOWED_ORIGINS].some((o) => new URL(o).origin === originHost);
        if (!allowed) {
            console.warn(`[OriginGuard] Blocked state-changing request from untrusted origin: ${origin}`);
            res.status(403).json({ success: false, error: 'Forbidden: untrusted origin' });
            return;
        }
    }
    catch {
        res.status(403).json({ success: false, error: 'Forbidden: malformed Origin header' });
        return;
    }
    next();
}
