import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { validateOrigin } from './middleware/originGuard';

// Route imports
import healthRouter from './routes/health';
import enquiriesRouter from './routes/enquiries';
import itineraryRouter from './routes/itinerary';
import telemetryRouter from './routes/telemetry';

// Public routes
import publicPackagesRouter from './routes/public/packages';
import publicDestinationsRouter from './routes/public/destinations';
import publicActivitiesRouter from './routes/public/activities';
import publicTransportRouter from './routes/public/transport';
import publicReviewsRouter from './routes/public/reviews';
import publicSettingsRouter from './routes/public/settings';
import publicHeroRouter from './routes/public/hero';

// Admin routes
import adminAuthRouter from './routes/admin/auth';
import adminDataRouter from './routes/admin/data';
import adminHeroRouter from './routes/admin/hero';
import adminSeoRouter from './routes/admin/seo';
import adminSettingsRouter from './routes/admin/settings';
import adminPackagesRouter from './routes/admin/packages';
import adminDestinationsRouter from './routes/admin/destinations';
import adminActivitiesRouter from './routes/admin/activities';
import adminCategoriesRouter from './routes/admin/categories';
import adminReviewsRouter from './routes/admin/reviews';
import adminTransportRouter from './routes/admin/transport';

export function createApp() {
  const app = express();

  // Trust proxy for Render / Cloudflare reverse proxies
  app.set('trust proxy', 1);

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    })
  );

  // CORS
  const allowedOrigins = [
    env.FRONTEND_ORIGIN,
    env.NEXT_PUBLIC_SITE_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (e.g. server-to-server or curl)
        if (!origin) return callback(null, true);
        
        const isAllowed = allowedOrigins.some((allowed) => {
          try {
            return new URL(allowed).origin === new URL(origin).origin;
          } catch {
            return false;
          }
        });

        if (isAllowed || env.NODE_ENV !== 'production') {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    })
  );

  // Parse cookies & JSON payloads
  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Origin verification for state-changing requests in production
  app.use(validateOrigin);

  // Health endpoint (before rate limits / auth)
  app.use('/health', healthRouter);

  // Ingestion / Lead routes
  app.use('/api/enquiries', enquiriesRouter);
  app.use('/api/itinerary', itineraryRouter);
  app.use('/api/telemetry', telemetryRouter);

  // Public read routes
  app.use('/api/public/packages', publicPackagesRouter);
  app.use('/api/public/destinations', publicDestinationsRouter);
  app.use('/api/public/activities', publicActivitiesRouter);
  app.use('/api/public/transport', publicTransportRouter);
  app.use('/api/public/reviews', publicReviewsRouter);
  app.use('/api/public/settings', publicSettingsRouter);
  app.use('/api/public/hero', publicHeroRouter);

  // Admin routes
  app.use('/api/admin', adminAuthRouter);
  app.use('/api/admin/data', adminDataRouter);
  app.use('/api/admin/hero', adminHeroRouter);
  app.use('/api/admin/seo', adminSeoRouter);
  app.use('/api/admin/settings', adminSettingsRouter);
  app.use('/api/admin/packages', adminPackagesRouter);
  app.use('/api/admin/destinations', adminDestinationsRouter);
  app.use('/api/admin/activities', adminActivitiesRouter);
  app.use('/api/admin/categories', adminCategoriesRouter);
  app.use('/api/admin/reviews', adminReviewsRouter);
  app.use('/api/admin/transport', adminTransportRouter);

  // 404 handler
  app.use((_req: express.Request, res: express.Response) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}
