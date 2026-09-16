"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestSizeLimit = requestSizeLimit;
const DEFAULT_MAX_BYTES = 15 * 1024; // 15 KB
function requestSizeLimit(maxBytes = DEFAULT_MAX_BYTES) {
    return (req, res, next) => {
        const contentLength = req.headers['content-length'];
        if (contentLength && parseInt(contentLength, 10) > maxBytes) {
            res.status(413).json({
                success: false,
                error: 'Payload too large. Maximum request size exceeded.',
            });
            return;
        }
        next();
    };
}
