export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities?: string[];
  meals?: string; // e.g. "Breakfast & Dinner Included"
  stay?: string;  // e.g. "4-Star Luxury Resort in Gulmarg"
  imageUrl?: string;
  image?: string;
}

export interface PackageStayItem {
  id?: string;
  name: string;
  type: string;
  location: string;
  image?: string;
  features: string[];
}

export interface PackageTransportItem {
  id?: string;
  name: string;
  type: string;
  seats: string;
  luggage?: string;
  tag?: string;
  ideal?: string;
  image?: string;
  features: string[];
}

export interface PackageFaqItem {
  question: string;
  answer: string;
}

export interface PackageCancellationTier {
  window: string;
  refund: string;
  note: string;
}

export interface EnrichedPackage {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  categoryId?: string | null;
  duration: string;
  tag: string;
  tagColor?: string | null;
  cardAnimation?: 'none' | 'snow' | 'heart' | null;
  imageUrl: string;
  videoUrl?: string | null;
  galleryUrls: string[];
  rating: number;
  reviewCount: number;
  destinations: string[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  startingPrice: number;
  originalPrice?: number | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  itinerary: ItineraryDay[];
  overviewParagraph?: string | null;
  stays?: PackageStayItem[];
  transports?: PackageTransportItem[];
  faqs?: PackageFaqItem[];
  cancellationPolicy?: PackageCancellationTier[];
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords: string[];
  canonicalUrl?: string | null;
  noIndex: boolean;
  updatedAt?: Date | string;
}

export interface PackageCategoryItem {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
  packageCount?: number;
}

export const defaultPackageStays: PackageStayItem[] = [
  {
    id: 'stay-1',
    name: 'Luxury Cedar-Wood Houseboat',
    type: 'Signature Kashmir Experience',
    location: 'Dal Lake / Nigeen Lake, Srinagar',
    image: '/images/gallery/shikara-dal-lake.jpg',
    features: [
      'Winter Heating: Electric bed warmers & traditional Kashmiri bukhari heaters to keep your room cozy.',
      'Included Dining: Freshly brewed Kashmiri Kahwa, daily buffet breakfast & lavish home-cooked wazwan dinners.',
      'Complimentary Shikara: 1-hour sunset Shikara cruise gliding past floating lotus gardens.',
    ],
  },
  {
    id: 'stay-2',
    name: 'Gulmarg & Pahalgam Valley Stays',
    type: 'Alpine Valley Resorts',
    location: 'Pine-view balconies & riverside retreats',
    image: '/images/gallery/pahalgam-valley.jpg',
    features: [
      'Tier Options: Choice between 3★ Deluxe, 4★ Premium, or 5★ Luxury resorts tailored to your preference.',
      'Strict Hygiene Guarantee: Personally inspected by our Srinagar team for clean linen, 24/7 power backup & hot water.',
      'Peaceful Mountain Sleep: Located in quiet pine glades away from commercial highway noise.',
    ],
  },
];

export const defaultPackageTransports: PackageTransportItem[] = [
  {
    id: 'crysta',
    name: 'Toyota Innova Crysta',
    type: 'Premium Mountain SUV',
    seats: '6-7 Seater',
    luggage: '4 Large Bags',
    tag: 'Most Popular for Kashmir',
    ideal: 'Families (4-6 persons) & Small Groups',
    image: '/images/fleet/innova-crysta.jpg',
    features: [
      'Separate rear heater & AC vents',
      'Reclining captain armchairs',
      'High ground clearance for snow',
      'Luggage carrier included',
    ],
  },
  {
    id: 'dzire',
    name: 'Swift Dzire / Toyota Etios',
    type: 'Executive Sedan',
    seats: '4 Seater',
    luggage: '2 Medium Bags',
    tag: 'Ideal for Couples',
    ideal: 'Couples & Solo Travelers (2-3 persons)',
    image: '/images/fleet/swift-dzire.jpg',
    features: [
      'Chamber heater & climate control',
      'Comfortable cushioned seats',
      'Smooth valley highway travel',
      'Sanitized after every transfer',
    ],
  },
  {
    id: 'urbania',
    name: 'Force Urbania / Luxury Tempo',
    type: 'Executive Mini Coach',
    seats: '10-14 Seater',
    luggage: '10+ Bags',
    tag: 'Luxury Group Travel',
    ideal: 'Large Family Reunions & Corporate Groups',
    image: '/images/fleet/urbania.jpg',
    features: [
      'Individual air/heating vents per seat',
      'Panoramic mountain view windows',
      'Ergonomic plush bucket recliners',
      'Dedicated luggage compartment',
    ],
  },
  {
    id: 'thar',
    name: 'Mahindra Thar 4x4 / Snow-Chains Cab',
    type: 'All-Terrain 4WD',
    seats: '4 Seater',
    luggage: '2 Soft Bags',
    tag: 'Winter High-Altitude Terrain',
    ideal: 'Snow Seekers & Glacial Trail Explorers',
    image: '/images/fleet/thar.jpg',
    features: [
      'Heavy-gauge snow chains equipped',
      '4x4 low range transmission',
      'Specialized Tangmarg-to-Gondola permit',
      'Glacier trained mountain driver',
    ],
  },
];

export const defaultPackageFaqsList: PackageFaqItem[] = [
  {
    question: 'Is this package suitable for families with senior citizens and children?',
    answer:
      'Yes, our itineraries are curated with gentle pacing, private heating-equipped vehicles, and hotels with elevator/ground floor access.',
  },
  {
    question: 'Are Gondola cable car tickets included in this package?',
    answer:
      'Gondola Phase 1 & 2 tickets must be booked through the official J&K Tourism portal due to strict OTP-linked government rules, but our team assists you with slot timing.',
  },
  {
    question: 'What clothing should we pack for this tour?',
    answer:
      'For winter tours (Nov-Mar), pack thermal innerwear, heavy fleece jackets, waterproof boots, and woollen gloves. For spring/summer, light woollens and windcheaters suffice.',
  },
  {
    question: 'Do mobile phone postpaid SIM cards work in Kashmir?',
    answer:
      'Only postpaid connections (Airtel, Jio, BSNL) function in Jammu & Kashmir due to telecom security regulations. Prepaid SIMs from other states will not work.',
  },
];

export const defaultCancellationPolicy: PackageCancellationTier[] = [
  {
    window: '30+ Days Prior',
    refund: '90% Refund',
    note: 'Only a minimal 10% administrative fee applies, or transfer 100% of your advance to any future date.',
  },
  {
    window: '15 – 29 Days Prior',
    refund: '70% Refund',
    note: '30% retention to cover hotel and cab reservation deposits held by mountain operators.',
  },
  {
    window: '7 – 14 Days Prior',
    refund: '50% Refund',
    note: '50% refund on total package value due to peak season houseboat and alpine hotel guarantees.',
  },
  {
    window: 'Less than 7 Days',
    refund: 'Non-Refundable',
    note: 'Non-refundable due to 100% non-cancellable commitments for cabs, chauffeurs, and resort suites.',
  },
];
