import fs from 'fs/promises';
import path from 'path';
import { PageHeroConfig, DEFAULT_PAGE_HEROES } from './page-heroes-constants';

export type { PageHeroConfig };
export { DEFAULT_PAGE_HEROES };

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'page-heroes.json');

export async function getAllPageHeroes(): Promise<Record<string, PageHeroConfig>> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PAGE_HEROES, ...parsed };
  } catch (err) {
    console.error('[PageHeroesService] Failed to read page-heroes.json, using defaults:', err);
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

  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(all, null, 2), 'utf-8');
  return all[id];
}
