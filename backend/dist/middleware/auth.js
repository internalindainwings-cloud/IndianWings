"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_MAX_AGE = exports.COOKIE_NAME = void 0;
exports.createAdminToken = createAdminToken;
exports.verifyAdminToken = verifyAdminToken;
exports.verifyAdminPassword = verifyAdminPassword;
exports.requireAdmin = requireAdmin;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
exports.COOKIE_NAME = 'tiwc_admin_session';
exports.SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds
function createAdminToken(username = 'admin') {
    const payload = JSON.stringify({
        user: username,
        iat: Date.now(),
        exp: Date.now() + exports.SESSION_MAX_AGE * 1000,
    });
    const encodedPayload = Buffer.from(payload).toString('base64url');
    const signature = crypto_1.default
        .createHmac('sha256', env_1.env.ADMIN_SECRET_KEY)
        .update(encodedPayload)
        .digest('base64url');
    return `${encodedPayload}.${signature}`;
}
function verifyAdminToken(token) {
    if (!token)
        return false;
    const parts = token.split('.');
    if (parts.length !== 2)
        return false;
    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto_1.default
        .createHmac('sha256', env_1.env.ADMIN_SECRET_KEY)
        .update(encodedPayload)
        .digest('base64url');
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length)
        return false;
    if (!crypto_1.default.timingSafeEqual(sigBuffer, expectedBuffer))
        return false;
    try {
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
        if (payload.exp && Date.now() > payload.exp)
            return false;
        return true;
    }
    catch {
        return false;
    }
}
function verifyAdminPassword(password) {
    const expectedPassword = env_1.env.ADMIN_PASSWORD;
    const inputBuffer = Buffer.from(password);
    const expectedBuffer = Buffer.from(expectedPassword);
    if (inputBuffer.length !== expectedBuffer.length)
        return false;
    return crypto_1.default.timingSafeEqual(inputBuffer, expectedBuffer);
}
function requireAdmin(req, res, next) {
    const token = req.cookies?.[exports.COOKIE_NAME];
    if (!verifyAdminToken(token)) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
    }
    next();
}
