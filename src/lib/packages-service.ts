import { prisma } from '@/lib/database/prisma';
import { featuredPackagesData, PackageItem } from '@/data/packages';
import { seasonalPackagesData } from '@/data/seasonal-packages';
import { offBeatPackagesData } from '@/data/off-beat-packages';

import type {
  ItineraryDay,
  PackageStayItem,
  PackageTransportItem,
  PackageFaqItem,
  PackageCancellationTier,
  EnrichedPackage,
  PackageCategoryItem,
} from '@/data/package-defaults';

import {
  defaultPackageStays,
  defaultPackageTransports,
  defaultPackageFaqsList,
  defaultCancellationPolicy,
} from '@/data/package-defaults';

export type {
  ItineraryDay,
  PackageStayItem,
  PackageTransportItem,
  PackageFaqItem,
  PackageCancellationTier,
  EnrichedPackage,
  PackageCategoryItem,
};

export {
  defaultPackageStays,
  defaultPackageTransports,
  defaultPackageFaqsList,
  defaultCancellationPolicy,
};

import { generatePackageSlug } from '@/lib/utilities/slug';
export { generatePackageSlug };

/* ── Default Inclusions & Exclusions ───────────────────────────── */
const defaultInclusions = [
  'Boutique Hotels / Luxury Houseboat Stays with Heating',
  'Dedicated Private Chauffeur-driven Sanitized Cab (Innova / Sedan)',
  'Daily Delicious Breakfast & Traditional Dinner',
  '1-Hour Sunset / Sunrise Shikara Cruise on Dal Lake',
  'All Toll Taxes, Fuel, Parking & Driver Night Allowances',
  '24/7 Dedicated Srinagar Ground Support & Tour Concierge',
];

const defaultExclusions = [
  'Airfare / Train tickets to Srinagar',
  'Gulmarg Gondola Phase 1 & Phase 2 cable car tickets',
  'Pony / Horse rides in Baisaran, Thajiwas or Gulmarg',
  'Personal expenses, shopping, laundry, and tipping',
  'Entry tickets to Mughal Gardens and monuments',
  'Travel Insurance & emergency medical evacuation',
];

/* ── Generate Realistic Day-by-Day Itinerary ───────────────────── */
function generateDefaultItinerary(title: string, destinations: string[], duration: string): ItineraryDay[] {
  const daysMatch = duration.match(/(\d+)\s*D/i);
  const totalDays = daysMatch ? parseInt(daysMatch[1], 10) : 5;
  const primaryDest = destinations[1] || 'Gulmarg';
  const secondaryDest = destinations[2] || destinations[0] || 'Pahalgam';

  const days: ItineraryDay[] = [
    {
      day: 1,
      title: 'Arrival in Srinagar — Gateway to Paradise & Dal Lake Shikara',
      description: 'Meet and greet by your private chauffeur at Srinagar International Airport. Transfer to your luxury carved cedar-wood houseboat on Nigeen / Dal Lake. In the evening, embark on a serene 1-hour Shikara cruise watching the golden sunset over Zabarwan mountains.',
      activities: ['Airport pickup & traditional welcome', 'Houseboat check-in & Kahwa tea', 'Sunset Shikara ride'],
      meals: 'Dinner Included',
      stay: 'Luxury Heritage Houseboat, Srinagar',
    },
    {
      day: 2,
      title: `Scenic Drive to ${primaryDest} — Meadows of Bliss`,
      description: `After a hearty breakfast, drive through scenic apple orchards and pine forests to ${primaryDest}. Enjoy the crisp mountain breeze, take scenic photography stops, and check into your mountain view resort.`,
      activities: ['Scenic valley drive', 'Forest nature walk', 'Local artisan shopping'],
      meals: 'Breakfast & Dinner Included',
      stay: `Centrally Heated Mountain Resort, ${primaryDest}`,
    },
  ];

  if (totalDays >= 4) {
    days.push({
      day: 3,
      title: `Alpine Exploration in ${primaryDest} — Glaciers & Pine Trails`,
      description: `Dedicate the full day to exploring the iconic landmarks of ${primaryDest}. Experience breathtaking cable car or pony trail vistas, untouched glacial streams, and authentic Kashmiri hospitality.`,
      activities: ['High-altitude sightseeing', 'Snow activities / Meadow walks', 'Photography at scenic viewpoints'],
      meals: 'Breakfast & Dinner Included',
      stay: `Centrally Heated Mountain Resort, ${primaryDest}`,
    });
  }

  if (totalDays >= 5) {
    days.push({
      day: 4,
      title: `Journey to ${secondaryDest} — Valley of Shepherds & Gushing Streams`,
      description: `Drive towards picturesque ${secondaryDest}, tracing the glistening turquoise Lidder/Sindh river. En-route, visit the historical saffron fields of Pampore and Awantipora ruins.`,
      activities: ['Pampore saffron fields visit', 'Riverside photography', 'Evening stroll in local markets'],
      meals: 'Breakfast & Dinner Included',
      stay: `Riverside Luxury Hotel, ${secondaryDest}`,
    });
  }

  if (totalDays >= 6) {
    days.push({
      day: 5,
      title: `Hidden Valleys & Nature Walks in ${secondaryDest}`,
      description: `Discover untouched pine glades, pristine meadows (Betaab / Aru / Baisaran), and crystal-clear mountain streams. Enjoy samovar tea amidst snow-dusted peaks.`,
      activities: ['Valley excursions', 'Picnic by the river', 'Traditional Wazwan tasting'],
      meals: 'Breakfast & Dinner Included',
      stay: `Riverside Luxury Hotel, ${secondaryDest}`,
    });
  }

  if (totalDays >= 7) {
    days.push({
      day: 6,
      title: 'Return to Srinagar — Mughal Heritage & Old Bazaar Treasures',
      description: 'Head back to Srinagar. Explore the imperial Mughal Gardens: Nishat Bagh (Garden of Bliss) and Shalimar Bagh (Abode of Love). Spend the afternoon browsing authentic GI-tagged Pashmina shawls and walnut wood carvings in the historic old quarters.',
      activities: ['Mughal Gardens tour', 'Pashmina & Walnut wood artisans', 'Lakeside promenade walk'],
      meals: 'Breakfast & Dinner Included',
      stay: 'Premium Boutique Hotel, Srinagar',
    });
  }

  // Final Day
  days.push({
    day: totalDays,
    title: 'Farewell Kashmir — Cherished Memories & Departure',
    description: 'Relish your final Kashmiri breakfast overlooking the mountains. Your private vehicle transfers you smoothly to Srinagar International Airport for your return flight home, with unforgettable memories of the valley.',
    activities: ['Breakfast with valley view', 'Souvenir packing', 'Assisted Airport drop-off'],
    meals: 'Breakfast Included',
    stay: 'Departure (Flight Home)',
  });

  return days;
}

/* ── Map Static Item to Enriched Package ───────────────────────── */
function staticToEnriched(item: PackageItem, categorySlug: string, sortOrder: number): EnrichedPackage {
  const slug = generatePackageSlug(item.title, item.duration);
  const itinerary = generateDefaultItinerary(item.title, item.destinations, item.duration);

  return {
    id: item.id,
    slug,
    title: item.title,
    categorySlug,
    duration: item.duration,
    tag: item.tag,
    tagColor: item.tagColor || null,
    cardAnimation: item.cardAnimation || (item.tagColor === 'snow' || item.tagColor === 'heart' ? item.tagColor : null),
    imageUrl: item.imageUrl,
    videoUrl: null,
    galleryUrls: [item.imageUrl, '/images/gallery/shikara-dal-lake.jpg', '/images/gallery/gulmarg-snow.jpg'],
    rating: item.rating,
    reviewCount: item.reviewCount,
    destinations: item.destinations,
    inclusions: item.inclusions && item.inclusions.length > 0 ? item.inclusions : defaultInclusions,
    exclusions: defaultExclusions,
    highlights: item.highlights || [],
    startingPrice: item.startingPrice,
    originalPrice: item.originalPrice || null,
    isFeatured: categorySlug === 'featured',
    isActive: true,
    sortOrder,
    itinerary,
    metaTitle: `${item.title} (${item.duration}) | Best Kashmir Packages`,
    metaDescription: `Book ${item.title} for ${item.duration} starting at ₹${item.startingPrice.toLocaleString('en-IN')}/person. Includes ${item.inclusions.slice(0, 3).join(', ')}. 100% verified stays.`,
    keywords: [item.title, 'Kashmir tour package', ...item.destinations.map((d) => `${d} tour`), 'Kashmir itinerary'],
    canonicalUrl: `https://theindianwings.com/packages/${slug}`,
    noIndex: false,
  };
}

/* ── Static Fallback Repository (Zero Downtime) ────────────────── */
function getStaticFallbackPackages(): EnrichedPackage[] {
  const featured = featuredPackagesData.map((p, i) => staticToEnriched(p, 'featured', i + 1));
  const seasonal = seasonalPackagesData.map((p, i) => staticToEnriched(p, 'seasonal', i + 10));
  const offbeat = offBeatPackagesData.map((p, i) => staticToEnriched(p, 'offbeat', i + 20));
  return [...featured, ...seasonal, ...offbeat];
}

const defaultCategories: PackageCategoryItem[] = [
  { id: 'cat-featured', slug: 'featured', name: 'Featured & Classic', description: 'Timeless Kashmir itineraries covering Srinagar, Gulmarg & Pahalgam', sortOrder: 1, isActive: true },
  { id: 'cat-seasonal', slug: 'seasonal', name: 'Seasonal Specials', description: 'Handcrafted itineraries for Winter Snow, Tulip Festival & Autumn Chinar', sortOrder: 2, isActive: true },
  { id: 'cat-offbeat', slug: 'offbeat', name: 'Off-Beat Expeditions', description: 'Untouched Himalayan valleys: Gurez, Doodhpathri, Bangus & Sinthan Top', sortOrder: 3, isActive: true },
];

/* ── Auto-Seed Database if Empty ───────────────────────────────── */
let hasSeeded = false;

export async function ensureDatabaseSeeded(): Promise<void> {
  if (hasSeeded) return;
  try {
    const catCount = await prisma.packageCategory.count();
    if (catCount === 0) {
      for (const cat of defaultCategories) {
        await prisma.packageCategory.upsert({
          where: { slug: cat.slug },
          update: {},
          create: {
            slug: cat.slug,
            name: cat.name,
            description: cat.description,
            sortOrder: cat.sortOrder,
            isActive: true,
          },
        });
      }
    }

    const pkgCount = await prisma.package.count();
    if (pkgCount === 0) {
      const fallbackList = getStaticFallbackPackages();
      const categories = await prisma.packageCategory.findMany();
      const catMap = new Map(categories.map((c) => [c.slug, c.id]));

      for (const p of fallbackList) {
        await prisma.package.create({
          data: {
            slug: p.slug,
            title: p.title,
            categorySlug: p.categorySlug,
            categoryId: catMap.get(p.categorySlug) || null,
            duration: p.duration,
            tag: p.tag,
            tagColor: p.tagColor,
            imageUrl: p.imageUrl,
            videoUrl: p.videoUrl,
            galleryUrls: p.galleryUrls,
            rating: p.rating,
            reviewCount: p.reviewCount,
            destinations: p.destinations,
            inclusions: p.inclusions,
            exclusions: p.exclusions,
            highlights: p.highlights,
            startingPrice: p.startingPrice,
            originalPrice: p.originalPrice,
            isFeatured: p.isFeatured,
            isActive: p.isActive,
            sortOrder: p.sortOrder,
            itinerary: p.itinerary as unknown as object,
            metaTitle: p.metaTitle,
            metaDescription: p.metaDescription,
            keywords: p.keywords,
            canonicalUrl: p.canonicalUrl,
            noIndex: p.noIndex,
          },
        });
      }
    }
    hasSeeded = true;
  } catch (err) {
    console.warn('[PackagesService] Auto-seed skipped or database offline; using memory fallback:', err);
  }
}

/* ── Public Retrieval APIs ─────────────────────────────────────── */

function parseItineraryPayload(raw: any, defaultTitle: string, defaultDestinations: string[], defaultDuration: string) {
  if (!raw) {
    return {
      days: generateDefaultItinerary(defaultTitle, defaultDestinations, defaultDuration),
      overviewParagraph: null,
      stays: defaultPackageStays,
      transports: defaultPackageTransports,
      faqs: defaultPackageFaqsList,
      cancellationPolicy: defaultCancellationPolicy,
    };
  }

  if (Array.isArray(raw)) {
    return {
      days: raw.length > 0 ? (raw as ItineraryDay[]) : generateDefaultItinerary(defaultTitle, defaultDestinations, defaultDuration),
      overviewParagraph: null,
      stays: defaultPackageStays,
      transports: defaultPackageTransports,
      faqs: defaultPackageFaqsList,
      cancellationPolicy: defaultCancellationPolicy,
    };
  }

  if (typeof raw === 'object') {
    return {
      days: Array.isArray(raw.days) && raw.days.length > 0 ? (raw.days as ItineraryDay[]) : generateDefaultItinerary(defaultTitle, defaultDestinations, defaultDuration),
      overviewParagraph: typeof raw.overviewParagraph === 'string' ? raw.overviewParagraph : null,
      stays: Array.isArray(raw.stays) && raw.stays.length > 0 ? (raw.stays as PackageStayItem[]) : defaultPackageStays,
      transports: Array.isArray(raw.transports) && raw.transports.length > 0 ? (raw.transports as PackageTransportItem[]) : defaultPackageTransports,
      faqs: Array.isArray(raw.faqs) && raw.faqs.length > 0 ? (raw.faqs as PackageFaqItem[]) : defaultPackageFaqsList,
      cancellationPolicy: Array.isArray(raw.cancellationPolicy) && raw.cancellationPolicy.length > 0 ? (raw.cancellationPolicy as PackageCancellationTier[]) : defaultCancellationPolicy,
    };
  }

  return {
    days: generateDefaultItinerary(defaultTitle, defaultDestinations, defaultDuration),
    overviewParagraph: null,
    stays: defaultPackageStays,
    transports: defaultPackageTransports,
    faqs: defaultPackageFaqsList,
    cancellationPolicy: defaultCancellationPolicy,
  };
}

export async function getAllPackages(includeDrafts = false): Promise<EnrichedPackage[]> {
  try {
    await ensureDatabaseSeeded();
    const records = await prisma.package.findMany({
      where: includeDrafts ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    if (records && records.length > 0) {
      return records.map((r) => {
        const parsed = parseItineraryPayload(r.itinerary, r.title, r.destinations, r.duration);
        return {
          id: r.id,
          slug: r.slug,
          title: r.title,
          categorySlug: r.categorySlug,
          categoryId: r.categoryId,
          duration: r.duration,
          tag: r.tag,
          tagColor: r.tagColor,
          cardAnimation: (r.tagColor === 'snow' || r.tagColor === 'heart' || r.tagColor === 'none' ? r.tagColor : null) as any,
          imageUrl: r.imageUrl,
          videoUrl: r.videoUrl,
          galleryUrls: r.galleryUrls,
          rating: r.rating,
          reviewCount: r.reviewCount,
          destinations: r.destinations,
          inclusions: r.inclusions.length > 0 ? r.inclusions : defaultInclusions,
          exclusions: r.exclusions.length > 0 ? r.exclusions : defaultExclusions,
          highlights: r.highlights,
          startingPrice: r.startingPrice,
          originalPrice: r.originalPrice,
          isFeatured: r.isFeatured,
          isActive: r.isActive,
          sortOrder: r.sortOrder,
          itinerary: parsed.days,
          overviewParagraph: parsed.overviewParagraph,
          stays: parsed.stays,
          transports: parsed.transports,
          faqs: parsed.faqs,
          cancellationPolicy: parsed.cancellationPolicy,
          metaTitle: r.metaTitle || `${r.title} | The Indian Wings Company`,
          metaDescription: r.metaDescription || `Book ${r.title} with verified stays and private transport.`,
          keywords: r.keywords,
          canonicalUrl: r.canonicalUrl || `https://theindianwings.com/packages/${r.slug}`,
          noIndex: r.noIndex,
          updatedAt: r.updatedAt,
        };
      });
    }
  } catch (err) {
    console.error('[PackagesService] Error querying Prisma, returning fallback:', err);
  }

  // Fallback to in-memory datasets
  const fallback = getStaticFallbackPackages();
  return includeDrafts ? fallback : fallback.filter((p) => p.isActive);
}

export async function getPackageBySlug(slug: string): Promise<EnrichedPackage | null> {
  try {
    await ensureDatabaseSeeded();
    let r = await prisma.package.findUnique({
      where: { slug },
    });

    if (!r) {
      const baseSlug = slug.replace(/-\d+d-\d+n$/i, '');
      r = await prisma.package.findFirst({
        where: {
          OR: [
            { slug },
            { slug: baseSlug },
            { slug: { startsWith: `${baseSlug}-` } },
          ],
        },
      });
    }

    if (r) {
      const parsed = parseItineraryPayload(r.itinerary, r.title, r.destinations, r.duration);
      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        categorySlug: r.categorySlug,
        categoryId: r.categoryId,
        duration: r.duration,
        tag: r.tag,
        tagColor: r.tagColor,
        cardAnimation: (r.tagColor === 'snow' || r.tagColor === 'heart' || r.tagColor === 'none' ? r.tagColor : null) as any,
        imageUrl: r.imageUrl,
        videoUrl: r.videoUrl,
        galleryUrls: r.galleryUrls,
        rating: r.rating,
        reviewCount: r.reviewCount,
        destinations: r.destinations,
        inclusions: r.inclusions.length > 0 ? r.inclusions : defaultInclusions,
        exclusions: r.exclusions.length > 0 ? r.exclusions : defaultExclusions,
        highlights: r.highlights,
        startingPrice: r.startingPrice,
        originalPrice: r.originalPrice,
        isFeatured: r.isFeatured,
        isActive: r.isActive,
        sortOrder: r.sortOrder,
        itinerary: parsed.days,
        overviewParagraph: parsed.overviewParagraph,
        stays: parsed.stays,
        transports: parsed.transports,
        faqs: parsed.faqs,
        cancellationPolicy: parsed.cancellationPolicy,
        metaTitle: r.metaTitle || `${r.title} | The Indian Wings Company`,
        metaDescription: r.metaDescription || `Book ${r.title} with verified stays and private transport.`,
        keywords: r.keywords,
        canonicalUrl: r.canonicalUrl || `https://theindianwings.com/packages/${r.slug}`,
        noIndex: r.noIndex,
        updatedAt: r.updatedAt,
      };
    }
  } catch (err) {
    console.error('[PackagesService] Error fetching by slug, falling back:', err);
  }

  // Fallback search
  const fallback = getStaticFallbackPackages();
  const directMatch = fallback.find((p) => p.slug === slug || p.id === slug);
  if (directMatch) return directMatch;

  if (slug === 'winter-wonderland-powder-snow-ski-6d-5n' || slug === 'winter-wonderland-snow-ski-package-6d-5n') {
    return fallback.find((p) => p.id === 'seasonal-1' || p.title.toLowerCase().includes('winter wonderland')) || null;
  }

  return null;
}

export async function getCategories(): Promise<PackageCategoryItem[]> {
  try {
    await ensureDatabaseSeeded();
    const categories = await prisma.packageCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { packages: true },
        },
      },
    });

    if (categories && categories.length > 0) {
      return categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        sortOrder: c.sortOrder,
        isActive: c.isActive,
        packageCount: c._count.packages,
      }));
    }
  } catch (err) {
    console.error('[PackagesService] Error fetching categories, using fallback:', err);
  }

  return defaultCategories;
}

export function getCategoryLabel(categorySlugOrTag?: string | null): string {
  const cat = (categorySlugOrTag || '').toLowerCase();
  if (cat.includes('honeymoon')) return 'Romantic Honeymoon';
  if (cat.includes('winter') || cat.includes('ski')) return 'Winter Snow & Skiing';
  if (cat.includes('offbeat') || cat.includes('expedition')) return 'Off-Beat Expedition';
  if (cat.includes('family') || cat.includes('heritage')) return 'Family & Classic Heritage';
  return 'Family & Classic Heritage';
}

export function getBestForLabel(categorySlugOrTag?: string | null): string {
  const cat = (categorySlugOrTag || '').toLowerCase();
  if (cat.includes('honeymoon')) return 'Couples & Honeymooners';
  if (cat.includes('winter') || cat.includes('ski')) return 'Snow Lovers, Skiers & Adventure Seekers';
  if (cat.includes('offbeat') || cat.includes('expedition')) return 'Trekkers, Explorers & Nature Enthusiasts';
  return 'Families, Couples & Small Groups';
}
