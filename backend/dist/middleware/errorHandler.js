"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    console.error('[ErrorHandler] Unhandled error:', err?.message || err);
    res.status(500).json({
        success: false,
        error: 'Something went wrong. Please try again.',
    });
}
