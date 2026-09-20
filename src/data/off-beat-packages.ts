import { PackageItem } from './packages';

// Off-beat packages managed in database; fallback provided for resilient zero-downtime rendering
export const offBeatPackagesData: PackageItem[] = [
  {
    id: 'offbeat-gurez-7d-6n',
    slug: 'gurez-valley-7d-6n',
    title: 'Gurez Valley — 7 Days / 6 Nights',
    categorySlug: 'offbeat',
    duration: '7 Days / 6 Nights',
    tag: 'Off-Beat Special',
    tagColor: 'emerald',
    cardAnimation: 'none',
    category: 'adventure',
    season: 'summer',
    imageUrl: '/images/gallery/kashmir-summit-view.png',
    rating: 4.9,
    reviewCount: 84,
    destinations: ['Srinagar', 'Gurez Valley', 'Dawar', 'Tulail Valley', 'Gulmarg'],
    inclusions: [
      '3 Nights Gurez Valley & 3 Nights Srinagar Stays',
      'Private Mountain Cab with Chauffeur for all 7 Days',
      'Daily Breakfast & Traditional Dinners Included',
      '1-Hour Sunset Shikara Ride on Dal Lake',
      'Full Day Excursion to Tulail Valley & Habba Khatoon',
      'Day Excursion to Gulmarg & Mughal Gardens',
      'All Border Permits & Checkpoint Formalities',
    ],
    startingPrice: 21500,
    originalPrice: 28500,
    highlights: [
      'Razdan Pass (11,672 ft) Crossing',
      'Habba Khatoon Peak & Spring Waterfall',
      'Pristine Kishanganga Riverfront & Tulail Valley',
      'Dal Lake Shikara & Gulmarg Alpine Meadow',
    ],
  },
];
