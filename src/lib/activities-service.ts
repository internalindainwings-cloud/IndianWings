import { prisma } from '@/lib/database/prisma';
import { ADVENTURE_ACTIVITIES, AdventureActivityItem } from '@/data/activities-data';

export interface EnrichedActivity extends AdventureActivityItem {
  slug: string;
  priceFrom: number;
  isActive: boolean;
  sortOrder: number;
}

let hasSeededActivities = false;
let hasCleanedMockActivities = false;

export async function cleanupMockActivities(): Promise<void> {
  if (hasCleanedMockActivities) return;
  try {
    await prisma.activity.deleteMany({
      where: {
        slug: {
          in: [
            'gulmarg-skiing',
            'lidder-rafting',
            'paragliding-srinagar',
            'snowmobile-gulmarg',
            'atv-quad-biking',
            'alpine-lake-trekking',
            'horseback-trail-riding',
            'hot-air-ballooning',
          ],
        },
      },
    });
    hasCleanedMockActivities = true;
  } catch (err) {
    console.warn('[ActivitiesService] Mock activities cleanup error (skipped):', err);
  }
}

export async function ensureActivitiesSeeded(): Promise<void> {
  // Auto-seeding mock activities is disabled to keep UI & DB dynamic and clean
  return;
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
