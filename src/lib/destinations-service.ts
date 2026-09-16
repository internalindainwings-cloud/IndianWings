import { prisma } from '@/lib/database/prisma';
import { destinationsData, DestinationItem } from '@/data/destinations';

export interface EnrichedDestination extends DestinationItem {
  isActive: boolean;
  sortOrder: number;
}

let hasSeededDestinations = false;

export async function ensureDestinationsSeeded(): Promise<void> {
  if (hasSeededDestinations) return;
  try {
    const count = await prisma.destination.count();
    if (count === 0) {
      for (let i = 0; i < destinationsData.length; i++) {
        const d = destinationsData[i];
        await prisma.destination.upsert({
          where: { slug: d.slug },
          update: {},
          create: {
            slug: d.slug,
            name: d.name,
            region: d.region || 'Jammu & Kashmir',
            tagline: d.tagline,
            category: d.category,
            imageUrl: d.imageUrl,
            gallery: d.gallery || [d.imageUrl],
            elevation: d.elevation,
            bestSeason: d.bestSeason,
            distanceFromSrinagar: d.distanceFromSrinagar,
            highlights: d.highlights || [],
            description: d.description,
            packageCount: d.packageCount || 0,
            isActive: true,
            sortOrder: i + 1,
          },
        });
      }
    }
    hasSeededDestinations = true;
  } catch (err) {
    console.warn('[DestinationsService] Seed skipped or DB offline; using memory fallback:', err);
  }
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
    const r = await prisma.destination.findUnique({
      where: { slug },
    });

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
