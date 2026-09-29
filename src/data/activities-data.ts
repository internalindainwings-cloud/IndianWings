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

// Curated adventure activities matching all adventure categories
export const ADVENTURE_ACTIVITIES: AdventureActivityItem[] = [
  {
    id: 'gulmarg-backcountry-skiing-snowboarding',
    name: 'Gulmarg Backcountry Skiing & Snowboarding',
    location: 'Gulmarg (Mt. Apharwat Phase 2)',
    category: 'Snow & Winter',
    duration: 'Full Day (5–6 hrs)',
    difficulty: 'Intermediate to Expert',
    season: 'Dec – Apr',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80',
    tags: ['Certified Ski Guide', 'Avalanche Gear & Beepers', 'Phase 2 Lift Passes'],
    badge: 'Most Popular',
  },
  {
    id: 'gulmarg-snowmobile-safari',
    name: 'Gulmarg High-Altitude Snowmobile Safari',
    location: 'Gulmarg (Kongdoori Valley)',
    category: 'Snow & Winter',
    duration: '1–2 hrs',
    difficulty: 'Beginner Friendly',
    season: 'Dec – Mar',
    imageUrl: '/images/gallery/gulmarg-snow.jpg',
    tags: ['4-Stroke Snowmobiles', 'Full Thermal Suits & Helmet', 'Guided Trail Route'],
    badge: 'Family Favorite',
  },
  {
    id: 'thajiwas-glacier-snow-trek',
    name: 'Thajiwas Glacier Ice Sledge & Snow Trek',
    location: 'Sonmarg (Thajiwas Glacier)',
    category: 'Snow & Winter',
    duration: '3–4 hrs',
    difficulty: 'Easy to Moderate',
    season: 'Nov – May',
    imageUrl: '/images/gallery/sonmarg-glacier.jpg',
    tags: ['Local Mountain Pony Assist', 'Traditional Wooden Sledges', 'Warm Kahwa at Base'],
    badge: 'Scenic Thrill',
  },
  {
    id: 'lidder-river-rafting-pahalgam',
    name: 'Lidder River White Water Rafting (Grade III)',
    location: 'Pahalgam (Lidder River)',
    category: 'Water Sports',
    duration: '1.5–2 hrs',
    difficulty: 'Moderate (12+ Yrs)',
    season: 'Apr – Sep',
    imageUrl: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=1200&q=80',
    tags: ['JKMHC Certified Guides', 'ISO Rated Life Vests & Helmets', 'Rescue Kayaker Escort'],
    badge: 'High Adrenaline',
  },
  {
    id: 'dal-lake-sunset-kayaking',
    name: 'Sunset Dal Lake Kayaking & Lotus Channel Expedition',
    location: 'Srinagar (Nigeen & Dal Lake)',
    category: 'Water Sports',
    duration: '2–3 hrs',
    difficulty: 'Easy (All Ages)',
    season: 'Mar – Nov',
    imageUrl: '/images/gallery/shikara-dal-lake.jpg',
    tags: ['Single & Tandem Ocean Kayaks', 'Floating Flower Gardens Route', 'Life Vests & Dry Bags'],
    badge: 'Serene Adventure',
  },
  {
    id: 'kokernag-bringhi-trout-angling',
    name: 'High Altitude Kokernag & Bringhi Trout Angling',
    location: 'Kokernag & Verinag Valley',
    category: 'Water Sports',
    duration: 'Half Day (4 hrs)',
    difficulty: 'All Skill Levels',
    season: 'Apr – Oct',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    tags: ['Catch & Release Permits', 'Fly-Fishing Tackle Provided', 'Local Angling Master'],
    badge: 'Exclusive',
  },
  {
    id: 'astanmarg-tandem-paragliding-srinagar',
    name: 'Astanmarg High Tandem Paragliding Flight',
    location: 'Srinagar (Astanmarg Top - 7,400 ft)',
    category: 'Aerial & Flying',
    duration: '15–20 Mins Airtime',
    difficulty: 'No Experience Needed',
    season: 'Mar – Nov',
    imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Certified Tandem Master Pilot', 'Dual Reserve Parachute', 'GoPro 4K Video Recording'],
    badge: 'Top Rated',
  },
  {
    id: 'gulmarg-gondola-skywalk',
    name: 'Gulmarg Gondola & High-Peak Apharwat Skywalk',
    location: 'Gulmarg (Phase 1 & Phase 2 - 13,780 ft)',
    category: 'Aerial & Flying',
    duration: '3–4 hrs',
    difficulty: 'Easy (High Altitude)',
    season: 'All Year Round',
    imageUrl: '/images/gallery/kashmir-summit-view.png',
    tags: ['Pre-Booked Slot Assist', 'World 2nd Highest Cable Car', 'Panoramic Pir Panjal Views'],
    badge: 'Must Experience',
  },
  {
    id: 'kashmir-hot-air-balloon',
    name: 'Kashmir Valley Hot Air Tethered Balloon Experience',
    location: 'Srinagar (Zabarwan Mountain Base)',
    category: 'Aerial & Flying',
    duration: '30–45 Mins Session',
    difficulty: 'Relaxed & Easy',
    season: 'Apr – Oct',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
    tags: ['Commercial Balloon Pilot', 'Aerial Dal Lake Panorama', 'Safety Tethered System'],
    badge: 'Romantic Sky',
  },
  {
    id: 'baisaran-valley-atv-quad-biking',
    name: 'Baisaran Valley ATV Quad Biking Trail',
    location: 'Pahalgam (Baisaran Mini Switzerland)',
    category: 'Trails & Off-Road',
    duration: '1–2 hrs',
    difficulty: 'Moderate Thrill',
    season: 'Mar – Nov',
    imageUrl: 'https://images.unsplash.com/photo-1579294800821-694d95e86143?auto=format&fit=crop&w=1200&q=80',
    tags: ['Heavy-Duty 500cc Polaris ATVs', 'Off-Road Mud & Pine Forest Trail', 'Safety Helmet & Marshals'],
    badge: 'Top Bestseller',
  },
  {
    id: 'kashmir-great-lakes-day-trek',
    name: 'Kashmir Great Lakes Day-Trek & Alpine Meadow Trail',
    location: 'Sonmarg (Nichnai & Table Top)',
    category: 'Trails & Off-Road',
    duration: 'Full Day (6–7 hrs)',
    difficulty: 'Moderate to Challenging',
    season: 'Jun – Oct',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Certified Wilderness Guide', 'Packed Organic Lunch & Fruit', 'Trekking Poles & First Aid'],
    badge: 'Pure Nature',
  },
  {
    id: 'sinthan-top-4x4-offroad-safari',
    name: 'Sinthan Top & Peer Ki Gali 4x4 Off-Road Safari',
    location: 'Pir Panjal (Sinthan Top - 12,500 ft)',
    category: 'Trails & Off-Road',
    duration: 'Full Day Expedition',
    difficulty: 'Rugged Mountain Safari',
    season: 'May – Nov',
    imageUrl: '/images/gallery/pahalgam-valley.jpg',
    tags: ['Modified Mahindra Thar 4x4', 'Expert High-Pass Chauffeur', 'Snow Wall Crossing Experience'],
    badge: 'Wilderness',
  },
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
