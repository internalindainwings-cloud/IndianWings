import { prisma } from '@/lib/database/prisma';
import { writtenReviews } from '@/data/written-reviews';
import { videoReviews } from '@/data/video-reviews';

export interface EnrichedReview {
  id: string;
  name: string;
  city: string;
  review: string;
  rating: number;
  avatarUrl?: string | null;
  type: 'written' | 'video' | 'gallery';
  videoUrl?: string | null;
  videoDuration?: string | null;
  videoQuote?: string | null;
  imageUrl?: string | null;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
}

let hasSeededReviews = false;

export async function ensureReviewsSeeded(): Promise<void> {
  if (hasSeededReviews) return;
  try {
    const count = await prisma.customerReview.count();
    if (count === 0) {
      // Seed written reviews
      for (let i = 0; i < writtenReviews.length; i++) {
        const wr = writtenReviews[i];
        await prisma.customerReview.create({
          data: {
            name: wr.name,
            city: wr.city,
            review: wr.review,
            rating: wr.rating || 5,
            avatarUrl: wr.avatarUrl || null,
            type: 'written',
            featured: true,
            isActive: true,
            sortOrder: i + 1,
          },
        });
      }

      // Seed video reviews
      for (let i = 0; i < videoReviews.length; i++) {
        const vr = videoReviews[i];
        await prisma.customerReview.create({
          data: {
            name: vr.name,
            city: vr.city,
            review: vr.quote || 'Unforgettable Kashmir trip!',
            rating: 5,
            type: 'video',
            videoUrl: vr.videoUrl,
            videoDuration: vr.duration,
            videoQuote: vr.quote,
            imageUrl: vr.posterUrl,
            featured: Boolean(vr.featured),
            isActive: true,
            sortOrder: i + 10,
          },
        });
      }
    }
    hasSeededReviews = true;
  } catch (err) {
    console.warn('[ReviewsService] Seed skipped or DB offline; using fallback:', err);
  }
}

export async function getAllReviews(includeDrafts = false, type?: string): Promise<EnrichedReview[]> {
  try {
    await ensureReviewsSeeded();
    const whereClause: Record<string, unknown> = {};
    if (!includeDrafts) whereClause.isActive = true;
    if (type) whereClause.type = type;

    const records = await prisma.customerReview.findMany({
      where: whereClause,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    if (records && records.length > 0) {
      return records.map((r) => ({
        id: r.id,
        name: r.name,
        city: r.city,
        review: r.review,
        rating: r.rating,
        avatarUrl: r.avatarUrl,
        type: r.type as 'written' | 'video' | 'gallery',
        videoUrl: r.videoUrl,
        videoDuration: r.videoDuration,
        videoQuote: r.videoQuote,
        imageUrl: r.imageUrl,
        featured: r.featured,
        isActive: r.isActive,
        sortOrder: r.sortOrder,
      }));
    }
  } catch (err) {
    console.warn('[ReviewsService] DB query failed, using fallback:', err);
  }

  // Fallback
  const writtenFallback: EnrichedReview[] = writtenReviews.map((w, idx) => ({
    id: w.id,
    name: w.name,
    city: w.city,
    review: w.review,
    rating: w.rating || 5,
    avatarUrl: w.avatarUrl,
    type: 'written',
    featured: true,
    isActive: true,
    sortOrder: idx + 1,
  }));

  const videoFallback: EnrichedReview[] = videoReviews.map((v, idx) => ({
    id: v.id,
    name: v.name,
    city: v.city,
    review: v.quote || '',
    rating: 5,
    type: 'video',
    videoUrl: v.videoUrl,
    videoDuration: v.duration,
    videoQuote: v.quote,
    imageUrl: v.posterUrl,
    featured: Boolean(v.featured),
    isActive: true,
    sortOrder: idx + 10,
  }));

  const combined = [...writtenFallback, ...videoFallback];
  return type ? combined.filter((c) => c.type === type) : combined;
}
