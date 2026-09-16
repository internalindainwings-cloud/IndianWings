import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

const PRODUCTION_ALLOWED_ORIGINS = new Set([
  env.FRONTEND_ORIGIN,
  env.NEXT_PUBLIC_SITE_URL,
].filter(Boolean) as string[]);

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function getClientOrigin(req: Request): string | null {
  return req.get('origin') ?? null;
}

export function validateOrigin(req: Request, res: Response, next: NextFunction): void {
  if (env.NODE_ENV !== 'production') {
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
  } catch {
    res.status(403).json({ success: false, error: 'Forbidden: malformed Origin header' });
    return;
  }

  next();
}
