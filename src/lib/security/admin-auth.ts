import crypto from 'crypto';
import { cookies } from 'next/headers';

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) {
    console.error('[Security Configuration Error] ADMIN_SECRET_KEY is not set in environment variables.');
    throw new Error('Authentication service configuration error');
  }
  return secret;
}

const COOKIE_NAME = 'tiwc_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Creates a signed HMAC-SHA256 token containing timestamp and payload
 */
export function createAdminToken(username: string = 'admin'): string {
  const secret = getAdminSecret();
  const payload = JSON.stringify({
    user: username,
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');
  return `${encodedPayload}.${signature}`;
}

/**
 * Validates a signed HMAC-SHA256 admin token
 */
export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) {
    console.error('[Security Configuration Error] ADMIN_SECRET_KEY is not configured. Rejecting authentication.');
    return false;
  }

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) return false;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return false; // Expired
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if current request has a valid admin session cookie
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}

/**
 * Verifies admin password using timing-safe comparison.
 * Both inputs are hashed to a fixed-length SHA-256 digest before
 * comparison, eliminating the length-leaking early-return.
 */
export function verifyAdminPassword(password: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    console.error('[Security Configuration Error] ADMIN_PASSWORD is not set in environment variables.');
    return false;
  }

  // Hash both values to a constant 32-byte digest so timingSafeEqual
  // always operates on equal-length buffers without leaking password length.
  const inputHash = crypto.createHash('sha256').update(password).digest();
  const expectedHash = crypto.createHash('sha256').update(expectedPassword).digest();

  return crypto.timingSafeEqual(inputHash, expectedHash);
}

export { COOKIE_NAME, SESSION_MAX_AGE };
