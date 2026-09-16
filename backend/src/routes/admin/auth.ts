import { Router, Request, Response } from 'express';
import {
  verifyAdminPassword,
  createAdminToken,
  COOKIE_NAME,
  SESSION_MAX_AGE,
} from '../../middleware/auth';
import { adminLoginLimiter } from '../../lib/redis';
import { createRateLimitMiddleware } from '../../middleware/rateLimit';
import { env } from '../../config/env';

const router = Router();

router.post(
  '/login',
  createRateLimitMiddleware(adminLoginLimiter),
  async (req: Request, res: Response) => {
    try {
      const { password } = req.body as { password?: string };

      if (!password || typeof password !== 'string') {
        res.status(400).json({ success: false, error: 'Password is required' });
        return;
      }

      if (!verifyAdminPassword(password)) {
        res.status(401).json({ success: false, error: 'Invalid password' });
        return;
      }

      const token = createAdminToken('admin');

      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: SESSION_MAX_AGE * 1000,
        path: '/',
      });

      res.json({ success: true, message: 'Login successful' });
    } catch (err) {
      console.error('[Auth] Login error:', err);
      res.status(500).json({ success: false, error: 'Authentication failed' });
    }
  }
);

router.post('/logout', (_req: Request, res: Response) => {
  res.cookie(COOKIE_NAME, '', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 0,
    path: '/',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
