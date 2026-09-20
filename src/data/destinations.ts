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

// All destinations are loaded dynamically from the database.
// Fallbacks provided for resilient zero-downtime rendering.
export const destinationsData: DestinationItem[] = [
  {
    id: 'dest-gulmarg',
    name: 'Gulmarg',
    slug: 'gulmarg',
    region: 'Baramulla, Jammu & Kashmir',
    tagline: 'Meadows, Snow & Mountain Adventures',
    category: 'Alpine',
    imageUrl: '/images/gallery/gulmarg-snow.jpg',
    gallery: [
      '/images/gallery/gulmarg-snow.jpg',
      '/images/gallery/kashmir-summit-view.png',
      '/images/gallery/pahalgam-valley.jpg',
    ],
    elevation: '2,650 m (8,694 ft)',
    bestSeason: 'Nov – Apr (Snow/Ski) | May – Sep (Meadows)',
    distanceFromSrinagar: '51 km (1.5 hrs)',
    highlights: [
      'Gulmarg Gondola',
      'Snow & winter experiences',
      'Himalayan mountain views',
      'Meadows and nature walks',
      'Skiing and adventure activities',
    ],
    description:
      'Gulmarg is one of Kashmir’s most celebrated mountain destinations, known for its expansive meadows, Himalayan views, winter snow and the famous Gulmarg Gondola. In summer, the landscape turns green and vibrant, while winter brings opportunities for skiing and other snow experiences. Set against the Himalayan mountains, Gulmarg offers a different experience in every season. Best for: Snow lovers • Families • Couples • Adventure travellers • Nature lovers.',
    packageCount: 6,
  },
  {
    id: 'dest-pahalgam',
    name: 'Pahalgam',
    slug: 'pahalgam',
    region: 'Anantnag, Jammu & Kashmir',
    tagline: 'Valleys, Rivers & Alpine Landscapes',
    category: 'Iconic',
    imageUrl: '/images/gallery/pahalgam-valley.jpg',
    gallery: [
      '/images/gallery/pahalgam-valley.jpg',
      '/images/gallery/shikara-dal-lake.jpg',
      '/images/gallery/houseboat-kashmir.jpg',
    ],
    elevation: '2,130 m (7,200 ft)',
    bestSeason: 'Mar – Nov (Valleys) | Dec – Feb (Snow Stays)',
    distanceFromSrinagar: '90 km (2.5 hrs)',
    highlights: [
      'Lidder River landscapes',
      'Mountain and forest views',
      'Valley sightseeing',
      'Outdoor experiences',
      'Gateway towards the Amarnath route',
    ],
    description:
      "Pahalgam is a scenic Kashmir destination surrounded by forested mountains and the flowing Lidder River, offering a combination of peaceful landscapes, valley experiences and outdoor exploration. Known for its green valleys, pine-covered mountains and flowing rivers, Pahalgam is one of the most popular destinations for experiencing Kashmir's natural landscape while enjoying a slower, more peaceful side of Kashmir. Best for: Families • Couples • Nature lovers • Photography • Leisure travellers.",
    packageCount: 5,
  },
  {
    id: 'dest-gurez',
    name: 'Gurez Valley',
    slug: 'gurez-valley',
    region: 'Bandipora, Jammu & Kashmir',
    tagline: 'Explore the Offbeat Side of Kashmir',
    category: 'Off-Beat',
    imageUrl: '/images/gallery/kashmir-summit-view.png',
    gallery: [
      '/images/gallery/kashmir-summit-view.png',
      '/images/gallery/sonmarg-glacier.jpg',
      '/images/gallery/shikara-dal-lake.jpg',
    ],
    elevation: '2,400 m (7,874 ft)',
    bestSeason: 'May – Oct (Open Passes & Verdant Valleys)',
    distanceFromSrinagar: '123 km (5 hrs via Razdan Pass)',
    highlights: [
      'Dramatic Himalayan landscapes',
      'Kishanganga River',
      'Traditional mountain villages',
      'Peaceful surroundings',
      'Offbeat Kashmir experience',
    ],
    description:
      "Gurez Valley offers a quieter side of Kashmir, with dramatic Himalayan landscapes, traditional villages and the Kishanganga River. Away from Kashmir's better-known tourist centres, Gurez Valley offers a more remote mountain experience surrounded by high Himalayan landscapes and traditional settlements. Best for: Offbeat travellers • Photographers • Nature lovers • Adventure seekers • Slow travellers.",
    packageCount: 1,
  },
];
