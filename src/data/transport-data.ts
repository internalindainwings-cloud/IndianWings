export interface VehicleFleetItem {
  id: string;
  name: string;
  category: 'Sedan / Hatch' | 'Luxury MPV' | 'VIP SUV' | 'Group Traveller' | 'Adventure 4x4';
  seats: string;
  bags: string;
  ac: string;
  fuel: string;
  imageUrl: string;
  tags: string[];
  badge?: string;
  pricePerDay?: number;
}

export interface PickupDropRoute {
  id: string;
  origin: 'Jammu' | 'Katra' | 'Srinagar' | 'Udhampur';
  destination: string;
  routeTitle: string;
  via: string;
  distance: string;
  duration: string;
  highlights: string[];
  cabs: string;
  isPopular?: boolean;
}

// Exactly 1 curated, verified vehicle card per category (concise & clean)
export const VEHICLE_FLEET: VehicleFleetItem[] = [
  {
    id: 'swift-dzire',
    name: 'Maruti Suzuki Dzire',
    category: 'Sedan / Hatch',
    seats: '4 Seats',
    bags: '2 Bags',
    ac: 'Air Conditioned',
    fuel: 'Petrol / Diesel',
    imageUrl: '/images/fleet/swift-dzire.jpg',
    tags: [
      'Ideal for couples & small families',
      'Smooth ride on 4-lane NH44 highway',
      '100% Sanitized with experienced driver'
    ],
    badge: 'Best for Couples',
    pricePerDay: 2500
  },
  {
    id: 'innova-crysta',
    name: 'Toyota Innova Crysta',
    category: 'Luxury MPV',
    seats: '6–7 Seats',
    bags: '4 Bags',
    ac: 'Dual-Zone AC',
    fuel: 'Diesel Turbo',
    imageUrl: '/images/fleet/innova-crysta.jpg',
    tags: [
      'Captain seats with premium legroom',
      'Top choice for family vacations',
      'Smooth hill-climb suspension'
    ],
    badge: 'Most Popular',
    pricePerDay: 3800
  },
  {
    id: 'fortuner-4x4',
    name: 'Toyota Fortuner 4x4',
    category: 'VIP SUV',
    seats: '6 Seats',
    bags: '3 Bags',
    ac: 'Climate Control',
    fuel: '4x4 Diesel',
    imageUrl: '/images/fleet/fortuner.jpg',
    tags: [
      'VIP travel & high-profile protocol',
      'Dominant road presence & safety',
      'All-weather mountain capability'
    ],
    badge: 'VIP Luxury',
    pricePerDay: 6500
  },
  {
    id: 'tempo-traveller',
    name: 'Force Tempo Traveller',
    category: 'Group Traveller',
    seats: '12–17 Seats',
    bags: '10+ Bags',
    ac: 'Individual AC Vents',
    fuel: 'Diesel Heavy',
    imageUrl: '/images/fleet/tempo-traveller.jpg',
    tags: [
      'Pushback ergonomic luxury seats',
      'Dedicated high luggage capacity',
      'Perfect for large families & groups'
    ],
    badge: 'Group Choice',
    pricePerDay: 5500
  },
  {
    id: 'thar-4x4',
    name: 'Mahindra Thar 4x4',
    category: 'Adventure 4x4',
    seats: '4 Seats',
    bags: '2 Bags',
    ac: 'Air Conditioned',
    fuel: '4x4 Turbo',
    imageUrl: '/images/fleet/thar.jpg',
    tags: [
      'Equipped for snow & winter ice roads',
      'Rugged high-pass trails & off-roading',
      'Unmatched Himalayan terrain control'
    ],
    badge: 'Snow & Off-Road',
    pricePerDay: 4800
  }
];


export const PICKUP_DROP_ROUTES: PickupDropRoute[] = [
  {
    id: 'jammu-srinagar',
    origin: 'Jammu',
    destination: 'Srinagar',
    routeTitle: 'Jammu → Srinagar',
    via: 'via NH44 & Chenani-Nashri Tunnel',
    distance: '250 km',
    duration: '6–7 hrs',
    highlights: ['Chenani-Nashri Tunnel', 'Navayug Tunnel', 'Patnitop Bypass'],
    cabs: 'Swift • Innova Crysta • Tempo',
    isPopular: true
  },
  {
    id: 'katra-srinagar',
    origin: 'Katra',
    destination: 'Srinagar',
    routeTitle: 'Katra → Srinagar',
    via: 'Direct from Katra hotel/helipad to Kashmir',
    distance: '235 km',
    duration: '6–6.5 hrs',
    highlights: ['Doorstep Katra Pickup', 'Qazigund Bypass', 'Zero Vehicle Change'],
    cabs: 'Swift • Innova Crysta • Tempo',
    isPopular: true
  },
  {
    id: 'udhampur-srinagar',
    origin: 'Udhampur',
    destination: 'Srinagar',
    routeTitle: 'Udhampur → Srinagar',
    via: 'Vande Bharat Express Railhead Connection',
    distance: '200 km',
    duration: '5–5.5 hrs',
    highlights: ['Vande Bharat Pickup', 'Saves 1.5 hrs Road Time', 'Train Delay Buffer'],
    cabs: 'Swift • Innova Crysta • Tempo',
    isPopular: true
  },
  {
    id: 'jammu-katra',
    origin: 'Jammu',
    destination: 'Katra',
    routeTitle: 'Jammu → Katra',
    via: 'Jammu Tawi / Airport to Vaishno Devi Base',
    distance: '45 km',
    duration: '1 hr',
    highlights: ['Airport/Station Meet & Greet', 'NH144 Express', 'Doorstep Drop'],
    cabs: 'Swift • Innova Crysta • Traveller',
    isPopular: false
  },
  {
    id: 'udhampur-katra',
    origin: 'Udhampur',
    destination: 'Katra',
    routeTitle: 'Udhampur → Katra',
    via: 'Direct Railhead Shuttle to Holy Town',
    distance: '35 km',
    duration: '45–50 mins',
    highlights: ['Fast Connecting Cab', 'Luggage Assistance', 'Fixed Rates'],
    cabs: 'Swift • Innova Crysta',
    isPopular: false
  },
  {
    id: 'srinagar-destinations',
    origin: 'Srinagar',
    destination: 'Gulmarg / Pahalgam / Sonmarg',
    routeTitle: 'Srinagar Airport → Mountain Resorts',
    via: 'SXR Airport / Dal Lake to Gulmarg / Pahalgam',
    distance: '55 km',
    duration: '1.5–2 hrs',
    highlights: ['Flight Tracking', 'Name Placard Meet', 'Resort Drop'],
    cabs: 'Swift • Innova Crysta • Fortuner',
    isPopular: true
  }
];

export const TRANSPORT_TRUST_PILLARS = [
  {
    icon: 'ShieldCheck',
    title: 'Verified Mountain Chauffeurs',
    desc: 'Commercial licenses, 10+ years high-altitude experience, and highway expertise.'
  },
  {
    icon: 'Receipt',
    title: 'All-Inclusive Pricing',
    desc: 'All NH44 tunnel tolls, state entry taxes, driver food, and fuel included.'
  },
  {
    icon: 'Clock',
    title: 'Delay-Protected Pickup',
    desc: 'Complimentary waiting time for Vande Bharat train and flight schedule shifts.'
  },
  {
    icon: 'Snowflake',
    title: 'Winter Snow Chains',
    desc: 'Certified metal snow chains ready for high mountain winter snow.'
  }
];

export const TRANSPORT_FAQS = [
  {
    question: 'Are highway tolls and driver allowances included?',
    answer: 'Yes, 100%. Every inter-city quote includes all NH44 tunnel tolls (Chenani-Nashri, Banihal-Qazigund), state taxes, driver allowance, and fuel. No hidden extras.'
  },
  {
    question: 'What happens if our train or flight is delayed?',
    answer: 'We track Vande Bharat trains and Srinagar flight radars live. Your driver waits with zero stress or sudden cancellation.'
  },
  {
    question: 'Is Maruti Swift / Dzire comfortable for Jammu–Srinagar?',
    answer: 'Yes. With the new 4-lane NH44 expressway and wide tunnel bypasses, Swift and Dzire offer smooth, economical rides for couples and small families.'
  },
  {
    question: 'Can your cabs do local sightseeing in Pahalgam and Gulmarg?',
    answer: 'Our cabs drop you directly at your resort. For internal points (like Aru/Betaab Valley in Pahalgam), local union cabs are required by local regulations, which we can pre-coordinate for you.'
  }
];
