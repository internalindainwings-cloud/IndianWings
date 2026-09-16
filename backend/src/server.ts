import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

const app = createApp();
const PORT = parseInt(env.PORT, 10) || 3001;

const server = app.listen(PORT, () => {
  console.log(`[Server] The Indian Wings Company API running on port ${PORT} [${env.NODE_ENV}]`);
  console.log(`[Server] Health check available at: http://localhost:${PORT}/health`);
});

// Graceful shutdown handlers
async function handleShutdown(signal: string) {
  console.log(`[Server] Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log('[Server] HTTP server closed.');
    try {
      await prisma.$disconnect();
      console.log('[Server] Database disconnected cleanly.');
      process.exit(0);
    } catch (err) {
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
