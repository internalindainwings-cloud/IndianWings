import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '../config/env';

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const enquiryLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(6, '10 m'),
  prefix: 'rl:enquiry',
});

export const adminLoginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  prefix: 'rl:admin_login',
});

export const itineraryLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(8, '10 m'),
  prefix: 'rl:itinerary',
});

export const telemetryLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  prefix: 'rl:telemetry',
});
