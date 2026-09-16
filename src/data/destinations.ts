export interface DestinationItem {
  id: string;
  slug: string;
  name: string;
  region: string;
  tagline: string;
  category: 'Iconic' | 'Alpine' | 'Off-Beat';
  imageUrl: string;
  gallery: string[];
  elevation: string;
  bestSeason: string;
  distanceFromSrinagar: string;
  highlights: string[];
  description: string;
  packageCount: number;
}

export const destinationsData: DestinationItem[] = [
  {
    id: 'dest-srinagar',
    slug: 'srinagar',
    name: 'Srinagar',
    region: 'Jammu & Kashmir',
    tagline: 'The Venice of the East & Summer Capital',
    category: 'Iconic',
    imageUrl: '/images/gallery/shikara-dal-lake.jpg',
    gallery: [
      '/images/gallery/shikara-dal-lake.jpg',
      '/images/gallery/houseboat-kashmir.jpg',
      '/assets/hero.png',
      '/images/gallery/pahalgam-valley.jpg',
    ],
    elevation: '1,585 m (5,200 ft)',
    bestSeason: 'All Year Round',
    distanceFromSrinagar: 'City Center (0 km)',
    highlights: ['Dal & Nigeen Lake Shikaras', 'Historic Mughal Gardens', 'Old City Heritage Walk'],
    description: 'Surrounded by the majestic Zabarwan mountains, Srinagar is celebrated for serene houseboats, blooming lotus gardens, and rich Sufi history.',
    packageCount: 14,
  },
  {
    id: 'dest-gulmarg',
    slug: 'gulmarg',
    name: 'Gulmarg',
    region: 'Jammu & Kashmir',
    tagline: 'Meadow of Flowers & Asia’s Ski Haven',
    category: 'Alpine',
    imageUrl: '/images/gallery/gulmarg-snow.jpg',
    gallery: [
      '/images/gallery/gulmarg-snow.jpg',
      '/assets/hero.png',
      '/images/gallery/sonmarg-glacier.jpg',
      '/images/gallery/shikara-dal-lake.jpg',
    ],
    elevation: '2,650 m (8,690 ft)',
    bestSeason: 'Nov – Mar (Snow) / May – Sep (Lush)',
    distanceFromSrinagar: '51 km (1.5 hrs)',
    highlights: ['Phase II Apharwat Gondola', 'Powder Snow Skiing', 'Highest 18-Hole Golf Course'],
    description: 'A world-famous alpine haven offering one of the highest cable cars in the world, powder snow bowls, and panoramic views of Nanga Parbat.',
    packageCount: 18,
  },
  {
    id: 'dest-pahalgam',
    slug: 'pahalgam',
    name: 'Pahalgam',
    region: 'Jammu & Kashmir',
    tagline: 'Valley of Shepherds & Lidder Waters',
    category: 'Iconic',
    imageUrl: '/images/gallery/pahalgam-valley.jpg',
    gallery: [
      '/images/gallery/pahalgam-valley.jpg',
      '/images/gallery/sonmarg-glacier.jpg',
      '/images/gallery/shikara-dal-lake.jpg',
      '/images/gallery/houseboat-kashmir.jpg',
    ],
    elevation: '2,130 m (7,200 ft)',
    bestSeason: 'Mar – Nov',
    distanceFromSrinagar: '90 km (2.5 hrs)',
    highlights: ['Betaab & Aru Valleys', 'Baisaran (Mini Switzerland)', 'White Water River Rafting'],
    description: 'Dotted with pine woods, sparkling mountain streams, and pastoral meadows, Pahalgam is the quintessential romantic and family mountain escape.',
    packageCount: 16,
  },
  {
    id: 'dest-sonmarg',
    slug: 'sonmarg',
    name: 'Sonmarg',
    region: 'Jammu & Kashmir',
    tagline: 'Meadow of Gold & Gateway to Ladakh',
    category: 'Alpine',
    imageUrl: '/images/gallery/sonmarg-glacier.jpg',
    gallery: [
      '/images/gallery/sonmarg-glacier.jpg',
      '/images/gallery/gulmarg-snow.jpg',
      '/assets/hero.png',
      '/images/gallery/pahalgam-valley.jpg',
    ],
    elevation: '2,740 m (8,990 ft)',
    bestSeason: 'Apr – Oct',
    distanceFromSrinagar: '80 km (2.5 hrs)',
    highlights: ['Thajiwas Glacier Trek', 'Zero Point Snow Excursion', 'Sindh River Trout Angling'],
    description: 'Cradled by snowy peaks and tumbling glaciers, Sonmarg is the starting point of legendary treks into high-altitude alpine lakes.',
    packageCount: 12,
  },
  {
    id: 'dest-doodhpathri',
    slug: 'doodhpathri',
    name: 'Doodhpathri',
    region: 'Jammu & Kashmir',
    tagline: 'Valley of Milk & Emerald Pine Woods',
    category: 'Off-Beat',
    imageUrl: '/images/gallery/pahalgam-valley.jpg',
    gallery: [
      '/images/gallery/pahalgam-valley.jpg',
      '/images/gallery/sonmarg-glacier.jpg',
      '/assets/hero.png',
      '/images/gallery/shikara-dal-lake.jpg',
    ],
    elevation: '2,730 m (8,956 ft)',
    bestSeason: 'May – Oct',
    distanceFromSrinagar: '42 km (1.5 hrs)',
    highlights: ['Shaliganga Gushing Stream', 'Untouched Rolling Grasslands', 'Pine Woodland Horse Trails'],
    description: 'A secluded bowl of velvety green slopes and crystal streams named for its milk-like frothing waters, blissfully free from crowds.',
    packageCount: 8,
  },
  {
    id: 'dest-gurez',
    slug: 'gurez',
    name: 'Gurez Valley',
    region: 'Jammu & Kashmir',
    tagline: 'Frontier Sanctuary & Dardic Folklore',
    category: 'Off-Beat',
    imageUrl: '/images/gallery/kashmir-summit-view.png',
    gallery: [
      '/assets/hero.png',
      '/images/gallery/sonmarg-glacier.jpg',
      '/images/gallery/gulmarg-snow.jpg',
      '/images/gallery/pahalgam-valley.jpg',
    ],
    elevation: '2,400 m (7,874 ft)',
    bestSeason: 'Jun – Oct',
    distanceFromSrinagar: '123 km (5 hrs)',
    highlights: ['Pyramidal Habba Khatoon Peak', 'Turquoise Kishanganga River', 'Ancient Wooden Villages'],
    description: 'An ancient Silk Route outpost tucked against the Line of Control, home to pristine pine slopes and warm-hearted Dard-Shin hospitality.',
    packageCount: 6,
  },
  {
    id: 'dest-yusmarg',
    slug: 'yusmarg',
    name: 'Yusmarg',
    region: 'Jammu & Kashmir',
    tagline: 'Meadow of Jesus & Alpine Stillness',
    category: 'Off-Beat',
    imageUrl: '/images/gallery/houseboat-kashmir.jpg',
    gallery: [
      '/images/gallery/houseboat-kashmir.jpg',
      '/images/gallery/pahalgam-valley.jpg',
      '/images/gallery/shikara-dal-lake.jpg',
      '/images/gallery/sonmarg-glacier.jpg',
    ],
    elevation: '2,396 m (7,860 ft)',
    bestSeason: 'Apr – Nov',
    distanceFromSrinagar: '47 km (1.5 hrs)',
    highlights: ['Nilnag Deep Blue Lake', 'Doodh Ganga Waterfall Trek', 'Pine Forest Solitude'],
    description: 'Surrounded by pine-blanketed ridges and snow-crested Pir Panjal peaks, Yusmarg offers absolute peace and untouched natural beauty.',
    packageCount: 7,
  },
  {
    id: 'dest-sinthan',
    slug: 'sinthan-top',
    name: 'Sinthan Top',
    region: 'Jammu & Kashmir',
    tagline: '360° Panoramic High Mountain Pass',
    category: 'Off-Beat',
    imageUrl: '/images/gallery/kashmir-summit-view.png',
    gallery: [
      '/assets/hero.png',
      '/images/gallery/gulmarg-snow.jpg',
      '/images/gallery/sonmarg-glacier.jpg',
      '/images/gallery/shikara-dal-lake.jpg',
    ],
    elevation: '3,800 m (12,467 ft)',
    bestSeason: 'May – Nov',
    distanceFromSrinagar: '130 km (4 hrs)',
    highlights: ['Year-round Snow Vantage Point', 'Daksum Dense Deodar Forests', 'Connecting Kashmir to Kishtwar'],
    description: 'A dramatic high-altitude pass offering dizzying vistas where clouds drift beneath your feet and untouched snow lingers well into summer.',
    packageCount: 5,
  },
  {
    id: 'dest-bangus',
    slug: 'bangus',
    name: 'Bangus Valley',
    region: 'Jammu & Kashmir',
    tagline: 'The Secret Biosphere of North Kashmir',
    category: 'Off-Beat',
    imageUrl: '/images/gallery/sonmarg-glacier.jpg',
    gallery: [
      '/images/gallery/sonmarg-glacier.jpg',
      '/images/gallery/pahalgam-valley.jpg',
      '/assets/hero.png',
      '/images/gallery/shikara-dal-lake.jpg',
    ],
    elevation: '3,000 m (9,842 ft)',
    bestSeason: 'Jun – Sep',
    distanceFromSrinagar: '128 km (4.5 hrs)',
    highlights: ['Boda & Lokut Bangus Basins', 'Rare Himalayan Flora & Fauna', 'Untamed Wild Camping'],
    description: 'One of the least explored alpine valleys in Kashmir, featuring boundless wildflower meadows enclosed by lofty cedar and fir ridges.',
    packageCount: 4,
  },
];

export function getDestinationBySlug(slug: string): DestinationItem | undefined {
  return destinationsData.find((d) => d.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllDestinationSlugs(): string[] {
  return destinationsData.map((d) => d.slug);
}
