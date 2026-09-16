import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const COOKIE_NAME = 'tiwc_admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export function createAdminToken(username: string = 'admin'): string {
  const payload = JSON.stringify({
    user: username,
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', env.ADMIN_SECRET_KEY)
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', env.ADMIN_SECRET_KEY)
    .update(encodedPayload)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) return false;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expectedPassword = env.ADMIN_PASSWORD;
  const inputBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expectedPassword);
  if (inputBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined;

  if (!verifyAdminToken(token)) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  next();
}
