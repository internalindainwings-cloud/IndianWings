export interface AdventureActivityItem {
  id: string;
  name: string;
  location: string;
  category: 'Snow & Winter' | 'Water Sports' | 'Aerial & Flying' | 'Trails & Off-Road';
  duration: string;
  difficulty: string;
  season: string;
  imageUrl: string;
  tags: string[];
  badge?: string;
}

export interface ActivitySafetyPillar {
  icon: string;
  title: string;
  desc: string;
}

export const ADVENTURE_ACTIVITIES: AdventureActivityItem[] = [
  {
    id: 'gulmarg-skiing',
    name: 'Alpine Skiing & Snowboarding',
    location: 'Gulmarg (Mt. Apharwat)',
    category: 'Snow & Winter',
    duration: '2–4 hrs / Multi-Day',
    difficulty: 'Beginner to Pro',
    season: 'Dec – April',
    imageUrl: '/images/gallery/gulmarg-snow.jpg',
    tags: ['Certified Ski Instructor', 'All Ski Gear & Boots Included', 'Phase 1 & 2 Slopes'],
    badge: 'World Class'
  },
  {
    id: 'lidder-rafting',
    name: 'Lidder White Water Rafting',
    location: 'Pahalgam (Lidder River)',
    category: 'Water Sports',
    duration: '45–90 mins',
    difficulty: 'Grade II to IV',
    season: 'May – Sep',
    imageUrl: '/images/gallery/pahalgam-valley.jpg',
    tags: ['ISO Certified Life Vests', 'Experienced River Guide', 'GoPro Footage Available'],
    badge: 'High Adrenaline'
  },
  {
    id: 'paragliding-srinagar',
    name: 'Tandem High-Altitude Paragliding',
    location: 'Astanmarg / Harwan, Srinagar',
    category: 'Aerial & Flying',
    duration: '15–25 mins Flight',
    difficulty: 'Easy / All Ages',
    season: 'All Year (Fair Weather)',
    imageUrl: '/images/gallery/kashmir-summit-view.png',
    tags: ['Dual-Tandem Certified Pilot', 'Panoramic Dal Lake Views', 'Full Safety Briefing'],
    badge: 'Top Aerial Thrill'
  },
  {
    id: 'snowmobile-gulmarg',
    name: 'Glacial Snowmobile (Snow Scooter)',
    location: 'Gulmarg & Sonmarg',
    category: 'Snow & Winter',
    duration: '30–60 mins',
    difficulty: 'Easy / Thrill',
    season: 'Dec – March',
    imageUrl: '/images/gallery/gulmarg-snow.jpg',
    tags: ['Guided Snow Trail', 'High-Speed Powdery Snow Glide', 'Warm Helmets Provided'],
    badge: 'Winter Thrill'
  },
  {
    id: 'atv-quad-biking',
    name: 'All-Terrain ATV Quad Biking',
    location: 'Gulmarg & Pahalgam',
    category: 'Trails & Off-Road',
    duration: '30–60 mins',
    difficulty: 'Moderate / Fun',
    season: 'All Year',
    imageUrl: '/images/gallery/sonmarg-glacier.jpg',
    tags: ['Pine Forest Trail', '4x4 Automatic Quad Bikes', 'Guide Escort Included'],
    badge: 'Off-Road Fun'
  },
  {
    id: 'alpine-lake-trekking',
    name: 'Alpine Lake Wilderness Day Trek',
    location: 'Sonmarg & Aru Valley',
    category: 'Trails & Off-Road',
    duration: '4–6 hrs',
    difficulty: 'Moderate',
    season: 'June – Oct',
    imageUrl: '/images/gallery/sonmarg-glacier.jpg',
    tags: ['Local Trek Leader', 'Packed Mountain Lunch', 'Turquoise Glacial Streams'],
    badge: 'Nature Trek'
  },
  {
    id: 'horseback-trail-riding',
    name: 'Pahalgam Pine Valley Horseback Trail',
    location: 'Pahalgam (Baisaran Valley)',
    category: 'Trails & Off-Road',
    duration: '2–3 hrs',
    difficulty: 'Easy / Family Friendly',
    season: 'All Year',
    imageUrl: '/images/gallery/pahalgam-valley.jpg',
    tags: ['Gentle Mountain Ponies', 'Scenic Deodar Forest Path', 'Mini-Switzerland Vistas'],
    badge: 'Classic Scenic'
  },
  {
    id: 'hot-air-ballooning',
    name: 'Hot Air Balloon Tethered Flight',
    location: 'Zabarwan Park, Dal Lake',
    category: 'Aerial & Flying',
    duration: '10–15 mins Flight',
    difficulty: 'Easy / Family Friendly',
    season: 'April – Nov',
    imageUrl: '/images/gallery/shikara-dal-lake.jpg',
    tags: ['360° Dal Lake Panorama', 'Suitable for Kids & Seniors', 'Professional Ground Crew'],
    badge: 'Family Favorite'
  }
];

export const ACTIVITY_SAFETY_PILLARS: ActivitySafetyPillar[] = [
  {
    icon: 'ShieldCheck',
    title: 'Certified Instructors',
    desc: 'All river guides, ski instructors, and tandem pilots hold government and JKMHC licenses.'
  },
  {
    icon: 'LifeBuoy',
    title: 'ISO Safety Equipment',
    desc: 'International standard helmets, life vests, ski gear, and dual paragliding parachutes.'
  },
  {
    icon: 'CloudSun',
    title: 'Weather-Safe Guarantee',
    desc: 'If weather prevents flying, rafting, or skiing, reschedule instantly or receive a 100% refund.'
  },
  {
    icon: 'HeartPulse',
    title: 'First-Aid Preparedness',
    desc: 'All adventure field teams carry medical kits and high-altitude emergency protocols.'
  }
];

export const ACTIVITY_FAQS = [
  {
    question: 'Are these adventure activities suitable for beginners and kids?',
    answer: 'Yes! Paragliding, ATV quad biking, river rafting, and snowmobiling are conducted in tandem with certified professionals. No previous experience is required.'
  },
  {
    question: 'What gear or clothing do we need to bring for snow activities?',
    answer: 'For skiing and snowmobiling in Gulmarg, certified rental shops provide snow boots, insulated parkas, and gloves at reasonable daily rates. Just wear warm thermal inner layers.'
  },
  {
    question: 'What is the minimum age for white water rafting in Pahalgam?',
    answer: 'The minimum age for the joy/beginner stretch (Grade II) is 12 years with parental consent. River guides provide fitted life jackets and helmets for all participants.'
  },
  {
    question: 'What happens if rain, wind, or snow cancels our flight or activity?',
    answer: 'Safety comes first. Any activity cancelled due to adverse weather or government advisories is rescheduled free of charge, or refunded completely with zero deduction.'
  }
];
