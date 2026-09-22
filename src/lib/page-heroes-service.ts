import { PageHeroConfig, DEFAULT_PAGE_HEROES } from './page-heroes-constants';
import { prisma } from './database/prisma';

export type { PageHeroConfig };
export { DEFAULT_PAGE_HEROES };

export async function getAllPageHeroes(): Promise<Record<string, PageHeroConfig>> {
  try {
    const settings = await prisma.siteSetting.findUnique({
      where: { id: 'global' },
    });
    
    if (settings && settings.pageHeroesConfig) {
      const parsed = typeof settings.pageHeroesConfig === 'string' 
        ? JSON.parse(settings.pageHeroesConfig) 
        : settings.pageHeroesConfig;
      return { ...DEFAULT_PAGE_HEROES, ...(parsed as any) };
    }
    
    return DEFAULT_PAGE_HEROES;
  } catch (err) {
    console.error('[PageHeroesService] Failed to read pageHeroesConfig from DB, using defaults:', err);
    return DEFAULT_PAGE_HEROES;
  }
}

export async function getPageHeroById(id: string): Promise<PageHeroConfig> {
  const all = await getAllPageHeroes();
  return all[id] || DEFAULT_PAGE_HEROES[id] || {
    id,
    name: id,
    route: `/${id}`,
    desktopImageUrl: '/images/gallery/shikara-dal-lake.jpg',
    mobileImageUrl: '/images/gallery/shikara-dal-lake.jpg',
  };
}

export async function updatePageHero(
  id: string,
  updates: Partial<Pick<PageHeroConfig, 'desktopImageUrl' | 'mobileImageUrl' | 'heading'>>
): Promise<PageHeroConfig> {
  const all = await getAllPageHeroes();
  const current = all[id] || DEFAULT_PAGE_HEROES[id] || {
    id,
    name: id,
    route: `/${id}`,
    desktopImageUrl: '',
    mobileImageUrl: '',
  };

  all[id] = {
    ...current,
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  };

  await prisma.siteSetting.upsert({
    where: { id: 'global' },
    create: {
      id: 'global',
      pageHeroesConfig: all as any,
    },
    update: {
      pageHeroesConfig: all as any,
    },
  });

  return all[id];
}

