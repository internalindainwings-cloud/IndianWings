import 'server-only';
import type { HeroHomepageConfig } from '@/data/hero-defaults';
import { defaultHeroConfig } from '@/data/hero-defaults';
import { prisma } from '@/lib/database/prisma';

export type { HeroHomepageConfig };
export { defaultHeroConfig };

export async function getHeroConfig(): Promise<HeroHomepageConfig> {
  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 'global' },
      select: { heroConfig: true },
    });

    const stored = settings?.heroConfig as Partial<HeroHomepageConfig> | null;
    if (!stored) return defaultHeroConfig;

    return {
      ...defaultHeroConfig,
      ...stored,
      slides: Array.isArray(stored.slides) && stored.slides.length > 0
        ? stored.slides
        : defaultHeroConfig.slides,
      trustPills: Array.isArray(stored.trustPills) && stored.trustPills.length > 0
        ? stored.trustPills
        : defaultHeroConfig.trustPills,
    };
  } catch (err) {
    console.warn('[HeroService] Could not read hero config from DB, returning default:', err);
    return defaultHeroConfig;
  }
}

export async function updateHeroConfig(newConfig: Partial<HeroHomepageConfig>): Promise<HeroHomepageConfig> {
  const current = await getHeroConfig();
  const updated: HeroHomepageConfig = {
    ...current,
    ...newConfig,
    slides: Array.isArray(newConfig.slides) ? newConfig.slides : current.slides,
    trustPills: Array.isArray(newConfig.trustPills) ? newConfig.trustPills : current.trustPills,
  };

  await prisma.siteSetting.upsert({
    where: { id: 'global' },
    update: { heroConfig: updated as object },
    create: { id: 'global', heroConfig: updated as object },
  });

  return updated;
}
