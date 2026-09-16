import { prisma } from '@/lib/database/prisma';
import { ADVENTURE_ACTIVITIES, AdventureActivityItem } from '@/data/activities-data';

export interface EnrichedActivity extends AdventureActivityItem {
  slug: string;
  priceFrom: number;
  isActive: boolean;
  sortOrder: number;
}

let hasSeededActivities = false;

export async function ensureActivitiesSeeded(): Promise<void> {
  if (hasSeededActivities) return;
  try {
    const count = await prisma.activity.count();
    if (count === 0) {
      for (let i = 0; i < ADVENTURE_ACTIVITIES.length; i++) {
        const a = ADVENTURE_ACTIVITIES[i];
        const slug = a.id || a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await prisma.activity.upsert({
          where: { slug },
          update: {},
          create: {
            name: a.name,
            slug,
            location: a.location,
            category: a.category,
            duration: a.duration,
            difficulty: a.difficulty,
            season: a.season,
            imageUrl: a.imageUrl,
            tags: a.tags || [],
            badge: a.badge || null,
            priceFrom: 1500,
            isActive: true,
            sortOrder: i + 1,
          },
        });
      }
    }
    hasSeededActivities = true;
  } catch (err) {
    console.warn('[ActivitiesService] Seed skipped or DB offline; using memory fallback:', err);
  }
}

export async function getAllActivities(includeDrafts = false): Promise<EnrichedActivity[]> {
  try {
    await ensureActivitiesSeeded();
    const records = await prisma.activity.findMany({
      where: includeDrafts ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    if (records && records.length > 0) {
      return records.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        location: r.location,
        category: r.category as AdventureActivityItem['category'],
        duration: r.duration,
        difficulty: r.difficulty,
        season: r.season,
        imageUrl: r.imageUrl,
        tags: r.tags,
        badge: r.badge || undefined,
        priceFrom: r.priceFrom,
        isActive: r.isActive,
        sortOrder: r.sortOrder,
      }));
    }
  } catch (err) {
    console.warn('[ActivitiesService] DB query failed, falling back to static data:', err);
  }

  // Fallback
  return ADVENTURE_ACTIVITIES.map((a, idx) => ({
    ...a,
    slug: a.id,
    priceFrom: 1500,
    isActive: true,
    sortOrder: idx + 1,
  }));
}
