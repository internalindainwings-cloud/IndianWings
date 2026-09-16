"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('3001'),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    ADMIN_SECRET_KEY: zod_1.z.string().min(32, 'ADMIN_SECRET_KEY must be at least 32 characters'),
    ADMIN_PASSWORD: zod_1.z.string().min(1, 'ADMIN_PASSWORD is required'),
    ADMIN_API_SECRET: zod_1.z.string().min(1, 'ADMIN_API_SECRET is required'),
    UPSTASH_REDIS_REST_URL: zod_1.z.string().url('UPSTASH_REDIS_REST_URL must be a valid URL'),
    UPSTASH_REDIS_REST_TOKEN: zod_1.z.string().min(1, 'UPSTASH_REDIS_REST_TOKEN is required'),
    FRONTEND_ORIGIN: zod_1.z.string().url('FRONTEND_ORIGIN must be a valid URL'),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.string().optional(),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    SMTP_FROM: zod_1.z.string().optional(),
    VERCEL_REVALIDATE_TOKEN: zod_1.z.string().optional(),
    NEXT_PUBLIC_SITE_URL: zod_1.z.string().url().optional(),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    console.error('[Config] Missing or invalid environment variables:');
    Object.entries(errors).forEach(([key, messages]) => {
        console.error(`  ${key}: ${messages?.join(', ')}`);
    });
    process.exit(1);
}
exports.env = parsed.data;
