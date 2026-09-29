import { prisma } from '@/lib/database/prisma';
import { ADVENTURE_ACTIVITIES, AdventureActivityItem } from '@/data/activities-data';

export interface EnrichedActivity extends AdventureActivityItem {
  slug: string;
  priceFrom: number;
  isActive: boolean;
  sortOrder: number;
}

export async function cleanupMockActivities(): Promise<void> {
  // Mock activities already cleaned up; no-op to prevent write query overhead on read paths
  return;
}

let hasCheckedActivitiesSeed = false;

export async function ensureActivitiesSeeded(): Promise<void> {
  if (hasCheckedActivitiesSeed) return;
  try {
    const count = await prisma.activity.count();
    if (count === 0 && ADVENTURE_ACTIVITIES.length > 0) {
      for (let i = 0; i < ADVENTURE_ACTIVITIES.length; i++) {
        const item = ADVENTURE_ACTIVITIES[i];
        await prisma.activity.upsert({
          where: { slug: item.id },
          create: {
            name: item.name,
            slug: item.id,
            location: item.location,
            category: item.category,
            duration: item.duration,
            difficulty: item.difficulty,
            season: item.season,
            imageUrl: item.imageUrl,
            tags: item.tags,
            badge: item.badge || null,
            priceFrom: item.id.includes('skiing') ? 4500 : item.id.includes('safari') ? 4200 : item.id.includes('paragliding') ? 3500 : item.id.includes('trout') ? 3200 : item.id.includes('trek') ? 2900 : item.id.includes('balloon') ? 2800 : item.id.includes('snowmobile') ? 2500 : item.id.includes('gondola') || item.id.includes('atv') ? 2200 : item.id.includes('rafting') ? 1800 : 1200,
            isActive: true,
            sortOrder: i + 1,
          },
          update: {},
        });
      }
    }
    hasCheckedActivitiesSeed = true;
  } catch (err) {
    console.warn('[ActivitiesService] ensureActivitiesSeeded error:', err);
  }
}

export async function getAllActivities(includeDrafts = false): Promise<EnrichedActivity[]> {
  try {
    await cleanupMockActivities();
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
