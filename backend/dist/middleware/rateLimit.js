"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimitMiddleware = createRateLimitMiddleware;
function createRateLimitMiddleware(limiter) {
    return async (req, res, next) => {
        const forwarded = req.headers['x-forwarded-for'];
        const ip = typeof forwarded === 'string'
            ? forwarded.split(',')[0].trim()
            : req.socket.remoteAddress || '127.0.0.1';
        try {
            const result = await limiter.limit(ip);
            res.setHeader('X-RateLimit-Limit', result.limit);
            res.setHeader('X-RateLimit-Remaining', result.remaining);
            res.setHeader('X-RateLimit-Reset', result.reset);
            if (!result.success) {
                res.setHeader('Retry-After', Math.ceil((result.reset - Date.now()) / 1000));
                res.status(429).json({
                    success: false,
                    error: 'Too many requests. Please try again later.',
                });
                return;
            }
        }
        catch (err) {
            console.error('[RateLimit] Redis error — failing closed:', err);
            res.status(503).json({
                success: false,
                error: 'Service temporarily unavailable. Please try again.',
            });
            return;
        }
        next();
    };
}
