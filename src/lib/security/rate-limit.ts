import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let redis: Redis | null = null;
let enquiryLimiter: Ratelimit | null = null;
let adminLoginLimiter: Ratelimit | null = null;
let itineraryLimiter: Ratelimit | null = null;

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

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
  redisUnavailable?: boolean;
}

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

async function checkLimit(
  limiter: Ratelimit | null,
  key: string
): Promise<RateLimitResult> {
  // Always allow localhost & private IPs to prevent developer/tester lockouts
  if (isLocalIp(key)) {
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
