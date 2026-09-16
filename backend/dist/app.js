"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const originGuard_1 = require("./middleware/originGuard");
// Route imports
const health_1 = __importDefault(require("./routes/health"));
const enquiries_1 = __importDefault(require("./routes/enquiries"));
const itinerary_1 = __importDefault(require("./routes/itinerary"));
const telemetry_1 = __importDefault(require("./routes/telemetry"));
// Public routes
const packages_1 = __importDefault(require("./routes/public/packages"));
const destinations_1 = __importDefault(require("./routes/public/destinations"));
const activities_1 = __importDefault(require("./routes/public/activities"));
const transport_1 = __importDefault(require("./routes/public/transport"));
const reviews_1 = __importDefault(require("./routes/public/reviews"));
const settings_1 = __importDefault(require("./routes/public/settings"));
const hero_1 = __importDefault(require("./routes/public/hero"));
// Admin routes
const auth_1 = __importDefault(require("./routes/admin/auth"));
const data_1 = __importDefault(require("./routes/admin/data"));
const hero_2 = __importDefault(require("./routes/admin/hero"));
const seo_1 = __importDefault(require("./routes/admin/seo"));
const settings_2 = __importDefault(require("./routes/admin/settings"));
const packages_2 = __importDefault(require("./routes/admin/packages"));
const destinations_2 = __importDefault(require("./routes/admin/destinations"));
const activities_2 = __importDefault(require("./routes/admin/activities"));
const categories_1 = __importDefault(require("./routes/admin/categories"));
const reviews_2 = __importDefault(require("./routes/admin/reviews"));
const transport_2 = __importDefault(require("./routes/admin/transport"));
function createApp() {
    const app = (0, express_1.default)();
    // Trust proxy for Render / Cloudflare reverse proxies
    app.set('trust proxy', 1);
    // Security Headers
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    }));
    // CORS
    const allowedOrigins = [
        env_1.env.FRONTEND_ORIGIN,
        env_1.env.NEXT_PUBLIC_SITE_URL,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ].filter(Boolean);
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. server-to-server or curl)
            if (!origin)
                return callback(null, true);
            const isAllowed = allowedOrigins.some((allowed) => {
                try {
                    return new URL(allowed).origin === new URL(origin).origin;
                }
                catch {
                    return false;
                }
            });
            if (isAllowed || env_1.env.NODE_ENV !== 'production') {
                return callback(null, true);
            }
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    }));
    // Parse cookies & JSON payloads
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
    // Origin verification for state-changing requests in production
    app.use(originGuard_1.validateOrigin);
    // Health endpoint (before rate limits / auth)
    app.use('/health', health_1.default);
    // Ingestion / Lead routes
    app.use('/api/enquiries', enquiries_1.default);
    app.use('/api/itinerary', itinerary_1.default);
    app.use('/api/telemetry', telemetry_1.default);
    // Public read routes
    app.use('/api/public/packages', packages_1.default);
    app.use('/api/public/destinations', destinations_1.default);
    app.use('/api/public/activities', activities_1.default);
    app.use('/api/public/transport', transport_1.default);
    app.use('/api/public/reviews', reviews_1.default);
    app.use('/api/public/settings', settings_1.default);
    app.use('/api/public/hero', hero_1.default);
    // Admin routes
    app.use('/api/admin', auth_1.default);
    app.use('/api/admin/data', data_1.default);
    app.use('/api/admin/hero', hero_2.default);
    app.use('/api/admin/seo', seo_1.default);
    app.use('/api/admin/settings', settings_2.default);
    app.use('/api/admin/packages', packages_2.default);
    app.use('/api/admin/destinations', destinations_2.default);
    app.use('/api/admin/activities', activities_2.default);
    app.use('/api/admin/categories', categories_1.default);
    app.use('/api/admin/reviews', reviews_2.default);
    app.use('/api/admin/transport', transport_2.default);
    // 404 handler
    app.use((_req, res) => {
        res.status(404).json({ success: false, error: 'Endpoint not found' });
    });
    // Global error handler
    app.use(errorHandler_1.errorHandler);
    return app;
}
