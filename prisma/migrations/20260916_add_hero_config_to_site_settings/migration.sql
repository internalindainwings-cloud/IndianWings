-- Migration: add_hero_config_to_site_settings
-- Safe additive change: adds nullable heroConfig column to site_settings
-- Apply to Neon production with: prisma migrate deploy

ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "heroConfig" JSONB;
