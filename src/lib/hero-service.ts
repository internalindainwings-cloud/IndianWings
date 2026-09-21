import 'server-only';
import { unstable_cache } from 'next/cache';
import type { HeroHomepageConfig } from '@/data/hero-defaults';
import { defaultHeroConfig } from '@/data/hero-defaults';
import { prisma } from '@/lib/database/prisma';
import { optimizeCloudinaryUrl } from '@/lib/utilities/cloudinary';

export type { HeroHomepageConfig };
export { defaultHeroConfig };

async function fetchHeroConfigFromDb(): Promise<HeroHomepageConfig> {
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

export const getHeroConfig = unstable_cache(
  fetchHeroConfigFromDb,
  ['hero-config'],
  { tags: ['hero'], revalidate: 3600 }
);

export async function updateHeroConfig(newConfig: Partial<HeroHomepageConfig>): Promise<HeroHomepageConfig> {
  const current = await getHeroConfig();
  const updated: HeroHomepageConfig = {
    ...current,
    ...newConfig,
    videoUrl: newConfig.videoUrl !== undefined ? optimizeCloudinaryUrl(newConfig.videoUrl) : current.videoUrl,
    posterUrl: newConfig.posterUrl !== undefined ? optimizeCloudinaryUrl(newConfig.posterUrl) : current.posterUrl,
    slides: Array.isArray(newConfig.slides)
      ? newConfig.slides.map((s) => ({
          ...s,
          videoSrc: s.videoSrc ? optimizeCloudinaryUrl(s.videoSrc) : s.videoSrc,
          poster: s.poster ? optimizeCloudinaryUrl(s.poster) : s.poster,
        }))
      : current.slides,
    trustPills: Array.isArray(newConfig.trustPills) ? newConfig.trustPills : current.trustPills,
  };

  await prisma.siteSetting.upsert({
    where: { id: 'global' },
    update: { heroConfig: updated as object },
    create: { id: 'global', heroConfig: updated as object },
  });

  return updated;
}
