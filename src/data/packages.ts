export type PackageCategory = 'family' | 'honeymoon' | 'winter' | 'adventure' | 'classic';

export interface PackageItem {
  id: string;
  title: string;
  duration: string;
  tag: string;
  tagColor?: string;
  cardAnimation?: 'none' | 'snow' | 'heart';
  category?: PackageCategory;
  season?: 'winter' | 'spring' | 'summer' | 'autumn';
  imageUrl: string;
  rating: number;
  reviewCount: number;
  destinations: string[];
  inclusions: string[];
  startingPrice: number;
  originalPrice?: number;
  highlights: string[];
}

export const featuredPackagesData: PackageItem[] = [
  {
    id: 'kashmir-classic-odyssey',
    title: 'Kashmir Classic Odyssey',
    duration: '6 Days / 5 Nights',
    tag: 'Best Seller',
    tagColor: 'gold',
    cardAnimation: 'none',
    category: 'classic',
    imageUrl: '/images/gallery/shikara-dal-lake.jpg',
    rating: 4.9,
    reviewCount: 186,
    destinations: ['Srinagar', 'Gulmarg', 'Pahalgam'],
    inclusions: [
      'Luxury Houseboat Stay on Nigeen / Dal Lake',
      'Dedicated Private Chauffeur Sedan / Innova',
      'Daily Gourmet Breakfast & Multi-Course Dinner',
      '1-Hour Sunset Shikara Cruise on Dal Lake',
      'All Fuel, Toll Taxes, Parking & Driver Allowances'
    ],
    startingPrice: 18500,
    originalPrice: 23000,
    highlights: ['Dal Lake Sunset Shikara', 'Betaab & Aru Valley Excursion', 'Gulmarg Mountain Vista'],
  },
  {
    id: 'romantic-kashmir-honeymoon',
    title: 'Romantic Kashmir & Luxury Houseboat Escape',
    duration: '6 Days / 5 Nights',
    tag: 'Honeymoon Special',
    tagColor: 'heart',
    cardAnimation: 'heart',
    category: 'honeymoon',
    imageUrl: '/images/gallery/houseboat-kashmir.jpg',
    rating: 5.0,
    reviewCount: 214,
    destinations: ['Nigeen Lake', 'Pahalgam', 'Gulmarg'],
    inclusions: [
      'Carved Cedar Heritage Houseboat Suite & Heated Stays',
      'Candlelight Dinner with Kashmiri Saffron Kahwa',
      'Flower Bed Decoration & Honeymoon Cake',
      'Private Chauffeur-driven AC Sedan / Innova',
      'Romantic Sunset Shikara Cruise on Nigeen Lake'
    ],
    startingPrice: 24500,
    originalPrice: 29000,
    highlights: ['Private Candlelight Lake Dinner', 'Baisaran Valley Walk', 'Cozy Mountain Fireplace Suite'],
  },
  {
    id: 'winter-wonderland-ski-special',
    title: 'Winter Wonderland & Gulmarg Ski Adventure',
    duration: '5 Days / 4 Nights',
    tag: 'Winter Special',
    tagColor: 'snow',
    cardAnimation: 'snow',
    category: 'winter',
    imageUrl: '/images/gallery/gulmarg-snow.jpg',
    rating: 4.9,
    reviewCount: 168,
    destinations: ['Gulmarg Snow Peak', 'Tangmarg', 'Srinagar'],
    inclusions: [
      'Centrally Heated Alpine Stays with Electric Blankets',
      'Dedicated 4x4 Snow Chains Vehicle for Mountain Passes',
      'Daily Hot Breakfast & Traditional Kashmiri Dinner',
      'Gondola Boarding Guidance & Ski Assistance',
      'Airport Pickup & Drop in Private Heated Cab'
    ],
    startingPrice: 21500,
    originalPrice: 26000,
    highlights: ['Gondola Phase II Apharwat Snowfield', 'Snowmobile & Sledging Thrills', 'Hot Kahwa by Fireplace'],
  },
  {
    id: 'kashmir-family-grand-holiday',
    title: 'Kashmir Family Grand Holiday',
    duration: '7 Days / 6 Nights',
    tag: 'Family Favorite',
    tagColor: 'gold',
    cardAnimation: 'none',
    category: 'family',
    imageUrl: '/images/gallery/pahalgam-valley.jpg',
    rating: 4.9,
    reviewCount: 192,
    destinations: ['Srinagar', 'Sonmarg', 'Gulmarg', 'Pahalgam'],
    inclusions: [
      'Interconnected Family Stays in 4-Star Hotels & Houseboat',
      'Spacious Private Toyota Innova Crysta throughout',
      'All Meals: Daily Buffet Breakfast & Dinner',
      'Dal Lake Shikara Tour & Mughal Gardens Visit',
      '24/7 Dedicated Family Concierge Support in Srinagar'
    ],
    startingPrice: 23000,
    originalPrice: 28500,
    highlights: ['Sonmarg Thajiwas Glacier Meadow', 'Betaab Valley Riverside Strolls', 'Shalimar & Nishat Gardens'],
  },
  {
    id: 'gurez-valley-frontier-expedition',
    title: 'Gurez Valley Frontier & Habba Khatoon Expedition',
    duration: '6 Days / 5 Nights',
    tag: 'Off-Beat Legend',
    tagColor: 'gold',
    cardAnimation: 'none',
    category: 'adventure',
    imageUrl: '/images/gallery/kashmir-summit-view.png',
    rating: 4.9,
    reviewCount: 112,
    destinations: ['Srinagar', 'Razdan Pass', 'Dawar', 'Gurez'],
    inclusions: [
      'Riverside Boutique Wooden Cottages in Dawar',
      'All Official Gurez Border Clearances & Permits',
      'High-Clearance 4x4 SUV with Mountain Chauffeur',
      'Daily Hearty Breakfast & Traditional Campfire Dinner',
      'Guided Cultural Walk in Dard-Shin Heritage Villages'
    ],
    startingPrice: 25500,
    originalPrice: 31000,
    highlights: ['Razdan Pass Panoramic Crest (11,672 ft)', 'Habba Khatoon Peak & Spring', 'Kishan Ganga River Walk'],
  },
  {
    id: 'scenic-kashmir-weekend-escape',
    title: 'Scenic Kashmir Weekend Escape',
    duration: '4 Days / 3 Nights',
    tag: 'Quick Escape',
    tagColor: 'gold',
    cardAnimation: 'none',
    category: 'classic',
    imageUrl: '/images/gallery/sonmarg-glacier.jpg',
    rating: 4.8,
    reviewCount: 98,
    destinations: ['Srinagar', 'Gulmarg'],
    inclusions: [
      '1 Night Luxury Houseboat + 2 Nights 4-Star Deluxe Hotel',
      'Private Airport Transfers & All Sightseeing Cab',
      'Daily Fresh Breakfast & Authentic Dinners',
      '1-Hour Evening Shikara Ride on Dal Lake',
      'Full Day Excursion to Gulmarg Alpine Meadow'
    ],
    startingPrice: 14500,
    originalPrice: 18000,
    highlights: ['Hassle-free Weekend Schedule', 'Gulmarg Day Gondola Ride', 'Srinagar Heritage Old City Walk'],
  },
];
