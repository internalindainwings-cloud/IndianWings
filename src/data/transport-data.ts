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

export const VEHICLE_FLEET: VehicleFleetItem[] = [
  {
    id: 'swift-dzire',
    name: 'Maruti Suzuki Swift / Dzire',
    category: 'Sedan / Hatch',
    seats: '4 Seats',
    bags: '2 Bags',
    ac: 'AC & Heater',
    fuel: 'Petrol / Diesel',
    imageUrl: '/images/fleet/swift-dzire.jpg',
    tags: ['Couple & Solo Friendly', 'All NH44 Tolls Included', 'Verified Mountain Driver'],
    badge: 'Best Value'
  },
  {
    id: 'innova-crysta',
    name: 'Toyota Innova Crysta',
    category: 'Luxury MPV',
    seats: '6+1 Seats',
    bags: '4 Bags',
    ac: 'Dual-Zone AC',
    fuel: 'Diesel',
    imageUrl: '/images/fleet/innova-crysta.jpg',
    tags: ['Captain Recliner Seats', 'Snow Chains Ready', 'Top Family Choice'],
    badge: 'Most Popular'
  },
  {
    id: 'fortuner-4x4',
    name: 'Toyota Fortuner 4x4',
    category: 'VIP SUV',
    seats: '6 Seats',
    bags: '4 Bags',
    ac: 'Climate Control',
    fuel: 'Diesel',
    imageUrl: '/images/fleet/fortuner.jpg',
    tags: ['4x4 Heavy Snow Traction', 'VIP Protocol Driver', 'Extreme Altitude Ready'],
    badge: 'VIP Luxury'
  },
  {
    id: 'force-urbania',
    name: 'Force Urbania Luxury Van',
    category: 'Group Traveller',
    seats: '10–14 Seats',
    bags: '10 Bags',
    ac: 'Individual AC Louvers',
    fuel: 'Diesel',
    imageUrl: '/images/fleet/urbania.jpg',
    tags: ['Business Class Recliners', 'Panoramic Windows', 'Corporate & Wedding Fleet'],
    badge: 'Ultra Luxury'
  },
  {
    id: 'tempo-traveller',
    name: 'Force Tempo Traveller',
    category: 'Group Traveller',
    seats: '12 / 17 / 26 Seats',
    bags: '15+ Bags',
    ac: 'Double Blower AC',
    fuel: 'Diesel',
    imageUrl: '/images/fleet/tempo-traveller.jpg',
    tags: ['Pushback Seats', 'Roof Luggage Carrier', 'Vaishno Devi Pilgrims'],
    badge: 'Group Choice'
  },
  {
    id: 'thar-4x4',
    name: 'Mahindra Thar 4x4 / Scorpio-N',
    category: 'Adventure 4x4',
    seats: '4–6 Seats',
    bags: '2 Bags',
    ac: 'AC & Heating',
    fuel: 'Diesel',
    imageUrl: '/images/fleet/thar.jpg',
    tags: ['Off-Road 4x4', 'Gurez & Sinthan Pass', 'Rugged Snow Clearance'],
    badge: 'Adventure'
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
