import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/database/prisma';
import { GalleryCategory, DEFAULT_GALLERY_CATEGORIES } from './gallery-categories-constants';
import { unstable_cache } from 'next/cache';

export { type GalleryCategory, DEFAULT_GALLERY_CATEGORIES };

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'gallery-categories.json');

async function trySyncLocalFile(categories: GalleryCategory[]): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(categories, null, 2), 'utf-8');
  } catch {
    // Silently ignore EROFS in serverless (e.g. Vercel) environments
  }
}

async function fetchAllGalleryCategories(): Promise<GalleryCategory[]> {
  try {
    const dbRecords = await prisma.galleryCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    if (dbRecords && dbRecords.length > 0) {
      return dbRecords.map((r) => ({
        id: r.id,
        name: r.name,
        icon: r.icon || '🏷️',
        sortOrder: r.sortOrder,
      }));
    }
  } catch (dbErr) {
    console.warn('[GalleryCategoriesService] Database query failed, falling back to static file:', dbErr);
  }

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

  try {
    await prisma.galleryCategory.upsert({
      where: { id: slug },
      create: {
        id: slug,
        name: newCat.name,
        icon: newCat.icon,
        sortOrder: newCat.sortOrder || 0,
      },
      update: {
        name: newCat.name,
        icon: newCat.icon,
      },
    });
  } catch (dbErr) {
    console.error('[GalleryCategoriesService] DB upsert failed:', dbErr);
  }

  const updated = [...current, newCat];
  trySyncLocalFile(updated).catch(() => {});

  return newCat;
}

export async function deleteGalleryCategory(id: string): Promise<boolean> {
  if (id === 'all') return false; // Prevent deleting "All"

  try {
    await prisma.galleryCategory.delete({
      where: { id },
    });
  } catch (dbErr) {
    console.warn('[GalleryCategoriesService] DB delete category failed:', dbErr);
  }

  const current = await getAllGalleryCategories();
  const filtered = current.filter((c) => c.id !== id);
  if (filtered.length === current.length) return false;

  trySyncLocalFile(filtered).catch(() => {});
  return true;
}
