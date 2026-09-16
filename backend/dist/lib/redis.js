"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.telemetryLimiter = exports.itineraryLimiter = exports.adminLoginLimiter = exports.enquiryLimiter = void 0;
const ratelimit_1 = require("@upstash/ratelimit");
const redis_1 = require("@upstash/redis");
const env_1 = require("../config/env");
const redis = new redis_1.Redis({
    url: env_1.env.UPSTASH_REDIS_REST_URL,
    token: env_1.env.UPSTASH_REDIS_REST_TOKEN,
});
exports.enquiryLimiter = new ratelimit_1.Ratelimit({
    redis,
    limiter: ratelimit_1.Ratelimit.slidingWindow(6, '10 m'),
    prefix: 'rl:enquiry',
});
exports.adminLoginLimiter = new ratelimit_1.Ratelimit({
    redis,
    limiter: ratelimit_1.Ratelimit.slidingWindow(5, '15 m'),
    prefix: 'rl:admin_login',
});
exports.itineraryLimiter = new ratelimit_1.Ratelimit({
    redis,
    limiter: ratelimit_1.Ratelimit.slidingWindow(8, '10 m'),
    prefix: 'rl:itinerary',
});
exports.telemetryLimiter = new ratelimit_1.Ratelimit({
    redis,
    limiter: ratelimit_1.Ratelimit.slidingWindow(60, '1 m'),
    prefix: 'rl:telemetry',
});
