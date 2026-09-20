import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  ADMIN_SECRET_KEY: z.string().min(32, 'ADMIN_SECRET_KEY must be at least 32 characters'),
  ADMIN_PASSWORD: z.string().min(1, 'ADMIN_PASSWORD is required'),
  ADMIN_API_SECRET: z.string().min(1, 'ADMIN_API_SECRET is required'),

  UPSTASH_REDIS_REST_URL: z.string().url('UPSTASH_REDIS_REST_URL must be a valid URL'),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'UPSTASH_REDIS_REST_TOKEN is required'),

  FRONTEND_ORIGIN: z.string().url('FRONTEND_ORIGIN must be a valid URL'),
  BOTPRESS_WEBHOOK_SECRET: z.string().min(32, 'BOTPRESS_WEBHOOK_SECRET must be at least 32 characters'),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),

  VERCEL_REVALIDATE_TOKEN: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
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

export const env = parsed.data;
