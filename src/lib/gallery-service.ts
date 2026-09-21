import fs from 'fs/promises';
import path from 'path';

import { GalleryItem } from './gallery-categories-constants';
export { type GalleryItem };

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'gallery-items.json');

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const items: GalleryItem[] = JSON.parse(raw);
    return items;
  } catch (err) {
    console.error('[GalleryService] Error reading gallery-items.json:', err);
    return [];
  }
}

export async function getActiveGalleryItems(): Promise<GalleryItem[]> {
  const items = await getAllGalleryItems();
  return items.filter((item) => item.isActive !== false);
}

export async function createGalleryItem(data: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem> {
  const items = await getAllGalleryItems();
  const newItem: GalleryItem = {
    ...data,
    id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  items.unshift(newItem);
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(items, null, 2), 'utf-8');
  return newItem;
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
  const items = await getAllGalleryItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...updates,
    id, // protect id from being changed
  };

  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(items, null, 2), 'utf-8');
  return items[index];
}

export async function deleteGalleryItem(id: string): Promise<GalleryItem | null> {
  const items = await getAllGalleryItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const [removed] = items.splice(index, 1);
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(items, null, 2), 'utf-8');

  // If the file was an uploaded local file under /uploads/gallery/, attempt to delete it from disk
  if (removed.url && removed.url.startsWith('/uploads/gallery/')) {
    try {
      const localFilePath = path.join(process.cwd(), 'public', removed.url);
      await fs.unlink(localFilePath).catch(() => {});
    } catch {
      // ignore
    }
  }
  if (removed.posterUrl && removed.posterUrl.startsWith('/uploads/gallery/')) {
    try {
      const localPosterPath = path.join(process.cwd(), 'public', removed.posterUrl);
      await fs.unlink(localPosterPath).catch(() => {});
    } catch {
      // ignore
    }
  }

  return removed;
}
