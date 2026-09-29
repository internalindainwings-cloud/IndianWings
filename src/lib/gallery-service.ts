import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/database/prisma';
import { GalleryItem } from './gallery-categories-constants';
import { unstable_cache } from 'next/cache';

export { type GalleryItem };

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'gallery-items.json');

async function trySyncLocalFile(items: GalleryItem[]): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(items, null, 2), 'utf-8');
  } catch {
    // Silently ignore EROFS in serverless (e.g. Vercel) environments
  }
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  try {
    const dbRecords = await prisma.galleryItem.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });

    if (dbRecords && dbRecords.length > 0) {
      return dbRecords.map((r) => ({
        id: r.id,
        title: r.title,
        type: (r.type as 'image' | 'video') || 'image',
        url: r.url,
        posterUrl: r.posterUrl || r.url,
        category: r.category,
        categoryLabel: r.categoryLabel || '',
        location: r.location,
        duration: r.duration || '',
        caption: r.caption || '',
        isFeatured: r.isFeatured,
        isActive: r.isActive,
        createdAt: r.createdAt.toISOString(),
      }));
    }
  } catch (dbErr) {
    console.warn('[GalleryService] Database query failed, falling back to static file:', dbErr);
  }

  // Fallback to static JSON file if DB query fails or is empty
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const items: GalleryItem[] = JSON.parse(raw);
    return items;
  } catch (err) {
    console.error('[GalleryService] Error reading fallback gallery-items.json:', err);
    return [];
  }
}

async function fetchActiveGalleryItems(): Promise<GalleryItem[]> {
  const items = await getAllGalleryItems();
  return items.filter((item) => item.isActive !== false);
}

export const getActiveGalleryItems = unstable_cache(
  fetchActiveGalleryItems,
  ['active-gallery-items'],
  { tags: ['gallery'], revalidate: 3600 }
);

export async function createGalleryItem(data: Omit<GalleryItem, 'id' | 'createdAt'>): Promise<GalleryItem> {
  const generatedId = `gal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date();

  let newItem: GalleryItem = {
    ...data,
    id: generatedId,
    createdAt: now.toISOString(),
  };

  try {
    const created = await prisma.galleryItem.create({
      data: {
        id: generatedId,
        title: data.title || 'Untitled',
        type: data.type || 'image',
        url: data.url,
        posterUrl: data.posterUrl || data.url,
        category: data.category || 'all',
        categoryLabel: data.categoryLabel || '',
        location: data.location || 'Kashmir Valley',
        duration: data.duration || '',
        caption: data.caption || '',
        isFeatured: data.isFeatured ?? true,
        isActive: data.isActive ?? true,
        createdAt: now,
      },
    });

    newItem = {
      id: created.id,
      title: created.title,
      type: (created.type as 'image' | 'video') || 'image',
      url: created.url,
      posterUrl: created.posterUrl || created.url,
      category: created.category,
      categoryLabel: created.categoryLabel || '',
      location: created.location,
      duration: created.duration || '',
      caption: created.caption || '',
      isFeatured: created.isFeatured,
      isActive: created.isActive,
      createdAt: created.createdAt.toISOString(),
    };
  } catch (dbErr) {
    console.error('[GalleryService] DB create failed:', dbErr);
  }

  // Attempt local file sync without throwing on EROFS
  getAllGalleryItems().then((all) => trySyncLocalFile(all)).catch(() => {});

  return newItem;
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null> {
  let updatedItem: GalleryItem | null = null;

  try {
    const updated = await prisma.galleryItem.update({
      where: { id },
      data: {
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.type !== undefined && { type: updates.type }),
        ...(updates.url !== undefined && { url: updates.url }),
        ...(updates.posterUrl !== undefined && { posterUrl: updates.posterUrl }),
        ...(updates.category !== undefined && { category: updates.category }),
        ...(updates.categoryLabel !== undefined && { categoryLabel: updates.categoryLabel }),
        ...(updates.location !== undefined && { location: updates.location }),
        ...(updates.duration !== undefined && { duration: updates.duration }),
        ...(updates.caption !== undefined && { caption: updates.caption }),
        ...(updates.isFeatured !== undefined && { isFeatured: updates.isFeatured }),
        ...(updates.isActive !== undefined && { isActive: updates.isActive }),
      },
    });

    updatedItem = {
      id: updated.id,
      title: updated.title,
      type: (updated.type as 'image' | 'video') || 'image',
      url: updated.url,
      posterUrl: updated.posterUrl || updated.url,
      category: updated.category,
      categoryLabel: updated.categoryLabel || '',
      location: updated.location,
      duration: updated.duration || '',
      caption: updated.caption || '',
      isFeatured: updated.isFeatured,
      isActive: updated.isActive,
      createdAt: updated.createdAt.toISOString(),
    };
  } catch (dbErr) {
    console.error('[GalleryService] DB update failed, falling back:', dbErr);
  }

  // If DB didn't find or failed, check in-memory list
  if (!updatedItem) {
    const items = await getAllGalleryItems();
    const index = items.findIndex((i) => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates, id };
      updatedItem = items[index];
    }
  }

  // Attempt local file sync without throwing on EROFS
  getAllGalleryItems().then((all) => trySyncLocalFile(all)).catch(() => {});

  return updatedItem;
}

export async function deleteGalleryItem(id: string): Promise<GalleryItem | null> {
  let removed: GalleryItem | null = null;

  try {
    const deleted = await prisma.galleryItem.delete({
      where: { id },
    });

    removed = {
      id: deleted.id,
      title: deleted.title,
      type: (deleted.type as 'image' | 'video') || 'image',
      url: deleted.url,
      posterUrl: deleted.posterUrl || deleted.url,
      category: deleted.category,
      categoryLabel: deleted.categoryLabel || '',
      location: deleted.location,
      duration: deleted.duration || '',
      caption: deleted.caption || '',
      isFeatured: deleted.isFeatured,
      isActive: deleted.isActive,
      createdAt: deleted.createdAt.toISOString(),
    };
  } catch (dbErr) {
    console.error('[GalleryService] DB delete failed:', dbErr);
  }

  if (!removed) {
    const items = await getAllGalleryItems();
    const index = items.findIndex((i) => i.id === id);
    if (index !== -1) {
      [removed] = items.splice(index, 1);
    }
  }

  // Attempt local file sync without throwing on EROFS
  getAllGalleryItems().then((all) => trySyncLocalFile(all)).catch(() => {});

  // If the file was an uploaded local file under /uploads/gallery/, attempt to delete it from disk
  if (removed?.url && removed.url.startsWith('/uploads/gallery/')) {
    try {
      const localFilePath = path.join(process.cwd(), 'public', removed.url);
      await fs.unlink(localFilePath).catch(() => {});
    } catch {
      // ignore
    }
  }
  if (removed?.posterUrl && removed.posterUrl.startsWith('/uploads/gallery/')) {
    try {
      const localPosterPath = path.join(process.cwd(), 'public', removed.posterUrl);
      await fs.unlink(localPosterPath).catch(() => {});
    } catch {
      // ignore
    }
  }

  return removed;
}
