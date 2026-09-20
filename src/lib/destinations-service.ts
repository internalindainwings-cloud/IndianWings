import { prisma } from '@/lib/database/prisma';
import { destinationsData, DestinationItem } from '@/data/destinations';

export interface EnrichedDestination extends DestinationItem {
  isActive: boolean;
  sortOrder: number;
}

let hasSeededDestinations = false;

export async function ensureDestinationsSeeded(): Promise<void> {
  // Auto-seeding disabled to prevent dummy destinations from returning
  return;
}

export async function getAllDestinations(includeDrafts = false): Promise<EnrichedDestination[]> {
  try {
    await ensureDestinationsSeeded();
    const records = await prisma.destination.findMany({
      where: includeDrafts ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    if (records && records.length > 0) {
      return records.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        region: r.region,
        tagline: r.tagline,
        category: r.category as 'Iconic' | 'Alpine' | 'Off-Beat',
        imageUrl: r.imageUrl,
        gallery: r.gallery,
        elevation: r.elevation,
        bestSeason: r.bestSeason,
        distanceFromSrinagar: r.distanceFromSrinagar,
        highlights: r.highlights,
        description: r.description,
        packageCount: r.packageCount,
        isActive: r.isActive,
        sortOrder: r.sortOrder,
      }));
    }
  } catch (err) {
    console.warn('[DestinationsService] DB query failed, falling back to static data:', err);
  }

  // Fallback
  return destinationsData.map((d, idx) => ({
    ...d,
    isActive: true,
    sortOrder: idx + 1,
  }));
}

export async function getDestinationBySlug(slug: string): Promise<EnrichedDestination | null> {
  try {
    await ensureDestinationsSeeded();
    let r = await prisma.destination.findUnique({
      where: { slug },
    });

    if (!r) {
      const altSlug = slug.endsWith('-valley') ? slug.replace(/-valley$/i, '') : `${slug}-valley`;
      r = await prisma.destination.findFirst({
        where: {
          OR: [
            { slug },
            { slug: altSlug },
            { name: { contains: slug.replace(/-/g, ' '), mode: 'insensitive' } },
          ],
        },
      });
    }

    if (r) {
      return {
        id: r.id,
        slug: r.slug,
        name: r.name,
        region: r.region,
        tagline: r.tagline,
        category: r.category as 'Iconic' | 'Alpine' | 'Off-Beat',
        imageUrl: r.imageUrl,
        gallery: r.gallery,
        elevation: r.elevation,
        bestSeason: r.bestSeason,
        distanceFromSrinagar: r.distanceFromSrinagar,
        highlights: r.highlights,
        description: r.description,
        packageCount: r.packageCount,
        isActive: r.isActive,
        sortOrder: r.sortOrder,
      };
    }
  } catch (err) {
    console.warn('[DestinationsService] DB query by slug failed, checking fallback:', err);
  }

  const fallback = destinationsData.find((d) => d.slug === slug || d.id === slug);
  return fallback ? { ...fallback, isActive: true, sortOrder: 1 } : null;
}

export async function getAllDestinationSlugs(): Promise<string[]> {
  try {
    const destinations = await getAllDestinations(false);
    return destinations.map((d) => d.slug);
  } catch {
    return [];
  }
}
