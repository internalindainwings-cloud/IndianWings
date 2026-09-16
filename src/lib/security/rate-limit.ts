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
    limiter: Ratelimit.slidingWindow(6, '10 m'),
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
    limiter: Ratelimit.slidingWindow(5, '15 m'),
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
    limiter: Ratelimit.slidingWindow(8, '10 m'),
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

async function checkLimit(
  limiter: Ratelimit | null,
  key: string
): Promise<RateLimitResult> {
  if (!limiter) {
    console.warn('[RateLimit] Upstash Redis not configured. Failing closed for security.');
    return { success: false, remaining: 0, resetAt: Date.now() + 60_000, redisUnavailable: true };
  }

  try {
    const result = await limiter.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
    };
  } catch (err) {
    console.error('[RateLimit] Redis error — failing closed:', err);
    return { success: false, remaining: 0, resetAt: Date.now() + 60_000, redisUnavailable: true };
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
