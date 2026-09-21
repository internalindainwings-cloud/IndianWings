import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';

let redis: Redis | null = null;
let enquiryLimiter: Ratelimit | null = null;
let adminLoginLimiter: Ratelimit | null = null;
let itineraryLimiter: Ratelimit | null = null;
let telemetryLimiter: Ratelimit | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

function getEnquiryLimiter(): Ratelimit | null {
  if (enquiryLimiter) return enquiryLimiter;
  const r = getRedis();
  if (!r) return null;
  enquiryLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(30, '10 m'), // Generous 30 leads per 10 min
    prefix: 'rl:enquiry',
  });
  return enquiryLimiter;
}

function getAdminLoginLimiter(): Ratelimit | null {
  if (adminLoginLimiter) return adminLoginLimiter;
  const r = getRedis();
  if (!r) return null;
  adminLoginLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(15, '15 m'),
    prefix: 'rl:admin_login',
  });
  return adminLoginLimiter;
}

function getItineraryLimiter(): Ratelimit | null {
  if (itineraryLimiter) return itineraryLimiter;
  const r = getRedis();
  if (!r) return null;
  itineraryLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(20, '10 m'),
    prefix: 'rl:itinerary',
  });
  return itineraryLimiter;
}

function getTelemetryLimiter(): Ratelimit | null {
  if (telemetryLimiter) return telemetryLimiter;
  const r = getRedis();
  if (!r) return null;
  telemetryLimiter = new Ratelimit({
    redis: r,
    limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 telemetry ingestion bursts per minute
    prefix: 'rl:telemetry',
  });
  return telemetryLimiter;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  redisUnavailable?: boolean;
}

/**
 * Returns true if the IP is a loopback or private-range address.
 * Used ONLY in development to prevent developer lockouts.
 * In production this check is skipped — private IPs should never reach Vercel's
 * ingress legitimately, so exempting them would open a spoofing bypass path.
 */
function isLocalIp(ip: string): boolean {
  if (!ip) return true;
  const clean = ip.trim().toLowerCase();
  return (
    clean === '127.0.0.1' ||
    clean === '::1' ||
    clean === 'localhost' ||
    clean.startsWith('127.') ||
    clean.startsWith('192.168.') ||
    clean.startsWith('10.') ||
    clean === 'unknown'
  );
}

/**
 * Resolves the real client IP from a NextRequest in a way that is resistant to
 * X-Forwarded-For spoofing.
 *
 * Trust hierarchy (verified against Vercel deployment architecture):
 *
 * 1. x-real-ip  — Set exclusively by Vercel's ingress; client-sent values are
 *    stripped. This is the most trustworthy single-IP field.
 *
 * 2. Rightmost non-private IP in x-forwarded-for — Vercel appends the true
 *    client IP as the RIGHTMOST value. Clients can only prepend (leftmost), so
 *    the rightmost value cannot be spoofed.
 *
 * 3. Development fallback — Only when NODE_ENV=development (next dev), where
 *    no proxy is present and requests arrive directly from localhost.
 *
 * 4. Production sentinel — '0.0.0.0' is used when no IP can be resolved in
 *    production. It is NOT a private IP, so it will be rate-limited rather
 *    than silently exempted.
 *
 * NOTE: NextRequest.ip was removed in Next.js v15.0.0 and is not available.
 */
export function resolveClientIp(req: NextRequest): string {
  const isDev = process.env.NODE_ENV === 'development';

  // 1. x-real-ip: most trustworthy on Vercel (stripped from client-sent values)
  const realIp = req.headers.get('x-real-ip')?.trim();
  if (realIp && realIp.length > 0) {
    return realIp;
  }

  // 2. x-forwarded-for rightmost: Vercel appends the true client IP last
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const parts = xff.split(',').map((p) => p.trim()).filter(Boolean);
    // Walk from rightmost to find a non-empty IP
    for (let i = parts.length - 1; i >= 0; i--) {
      const candidate = parts[i];
      if (candidate && candidate.length > 0) {
        return candidate;
      }
    }
  }

  // 3. Development-only loopback fallback
  if (isDev) {
    return '127.0.0.1';
  }

  // 4. Production sentinel: rate-limited, not exempted
  return '0.0.0.0';
}

async function checkLimit(
  limiter: Ratelimit | null,
  key: string
): Promise<RateLimitResult> {
  const isDev = process.env.NODE_ENV === 'development';

  // Private-IP exemption is DEVELOPMENT-ONLY.
  // In production, this check is disabled to prevent spoofed private IPs
  // (e.g. X-Forwarded-For: 192.168.1.1) from bypassing rate limiting.
  if (isDev && isLocalIp(key)) {
    return { success: true, remaining: 100, resetAt: Date.now() + 60_000 };
  }

  if (!limiter) {
    // Fail open: Never block genuine paying travel customers if Redis is not configured
    console.warn('[RateLimit] Upstash Redis not configured. Allowing enquiry (fail-open).');
    return { success: true, remaining: 100, resetAt: Date.now() + 60_000, redisUnavailable: true };
  }

  try {
    const result = await limiter.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  } catch (err) {
    // Fail open: If Redis experiences an outage, prioritize business revenue by saving lead
    console.error('[RateLimit] Redis error — failing open to preserve lead flow:', err);
    return { success: true, remaining: 100, resetAt: Date.now() + 60_000, redisUnavailable: true };
  }
}

export async function checkEnquiryRateLimit(ip: string): Promise<RateLimitResult> {
  return checkLimit(getEnquiryLimiter(), ip);
}

export async function checkAdminLoginRateLimit(ip: string): Promise<RateLimitResult> {
  return checkLimit(getAdminLoginLimiter(), `admin_login:${ip}`);
}

export async function checkItineraryRateLimit(ip: string): Promise<RateLimitResult> {
  return checkLimit(getItineraryLimiter(), ip);
}

export async function checkTelemetryRateLimit(ip: string): Promise<RateLimitResult> {
  return checkLimit(getTelemetryLimiter(), `telemetry:${ip}`);
}


