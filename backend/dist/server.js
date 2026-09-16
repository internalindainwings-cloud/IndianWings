"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const prisma_1 = require("./lib/prisma");
const app = (0, app_1.createApp)();
const PORT = parseInt(env_1.env.PORT, 10) || 3001;
const server = app.listen(PORT, () => {
    console.log(`[Server] The Indian Wings Company API running on port ${PORT} [${env_1.env.NODE_ENV}]`);
    console.log(`[Server] Health check available at: http://localhost:${PORT}/health`);
});
// Graceful shutdown handlers
async function handleShutdown(signal) {
    console.log(`[Server] Received ${signal}. Starting graceful shutdown...`);
    server.close(async () => {
        console.log('[Server] HTTP server closed.');
        try {
            await prisma_1.prisma.$disconnect();
            console.log('[Server] Database disconnected cleanly.');
            process.exit(0);
        }
        catch (err) {
            console.error('[Server] Error during disconnect:', err);
            process.exit(1);
        }
    });
    // Force close after 10s if graceful close hangs
    setTimeout(() => {
        console.error('[Server] Forcing shutdown after timeout.');
        process.exit(1);
    }, 10000);
}
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
