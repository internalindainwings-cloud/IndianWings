import fs from 'fs/promises';
import path from 'path';

import { GalleryCategory, DEFAULT_GALLERY_CATEGORIES } from './gallery-categories-constants';
export { type GalleryCategory, DEFAULT_GALLERY_CATEGORIES };

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'gallery-categories.json');

import { unstable_cache } from 'next/cache';

async function fetchAllGalleryCategories(): Promise<GalleryCategory[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('[GalleryCategoriesService] Could not read categories file, using defaults:', err);
  }
  return DEFAULT_GALLERY_CATEGORIES;
}

export const getAllGalleryCategories = unstable_cache(
  fetchAllGalleryCategories,
  ['gallery-categories'],
  { tags: ['gallery'], revalidate: 3600 }
);

export async function addGalleryCategory(cat: { name: string; icon?: string; id?: string }): Promise<GalleryCategory> {
  const current = await getAllGalleryCategories();
  const slug = (cat.id || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || `cat-${Date.now()}`;
  
  // Prevent duplicate id
  const existing = current.find((c) => c.id === slug);
  if (existing) {
    return existing;
  }

  const newCat: GalleryCategory = {
    id: slug,
    name: cat.name.trim(),
    icon: cat.icon || '🏷️',
    sortOrder: current.length + 1,
  };

  const updated = [...current, newCat];
  await fs.writeFile(DATA_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return newCat;
}

export async function deleteGalleryCategory(id: string): Promise<boolean> {
  if (id === 'all') return false; // Prevent deleting "All"
  const current = await getAllGalleryCategories();
  const filtered = current.filter((c) => c.id !== id);
  if (filtered.length === current.length) return false;

  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
