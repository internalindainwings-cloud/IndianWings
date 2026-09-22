export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Travel Guide' | 'Seasonal Tips' | 'Adventure' | 'Culture & Food';
  imageUrl: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
}

export const defaultBlogPosts: BlogPostItem[] = [
  {
    id: 'blog-1',
    slug: 'best-time-to-visit-kashmir',
    title: 'Best Time to Visit Kashmir: Month-by-Month Weather, Snow & Blossoms Guide',
    excerpt: 'Planning your dream vacation to Kashmir? Here is the ultimate season-by-season guide covering snowfall in Gulmarg, spring tulips in Srinagar, and pleasant summer in Pahalgam.',
    content: `
Kashmir is celebrated as "Paradise on Earth" throughout the year, but every season unfolds a radically distinct personality. Whether you are chasing powdery winter snow in Gulmarg or strolling through blossoming almond orchards in Srinagar, choosing the right month is crucial for your itinerary.

### 1. Winter Magic (December to February)
- **What to Expect:** Heavy snowfall transforms the valley into a glittering white wonderland. Gulmarg becomes Asia's premier skiing destination with Phase 1 and 2 Gondola operating above 13,000 feet.
- **Ideal For:** Skiers, snowboarders, honeymoon couples, and anyone seeking pure snowfall.
- **Key Highlights:** Snowmobiling, Buqhari-warmed houseboats, hot Kashmiri Kahwa.

### 2. Spring Bloom (March to May)
- **What to Expect:** Snow melts to reveal millions of vibrant blossoms. Asia’s largest Tulip Garden at Siraj Bagh opens in April with over 60 varieties of blooming tulips.
- **Ideal For:** Nature photographers, families, and couples.
- **Key Highlights:** Indira Gandhi Memorial Tulip Garden, Badamwari almond blossoms, pleasant daytime temperatures (15°C to 22°C).

### 3. Summer Splendor (June to August)
- **What to Expect:** Lush alpine meadows, gushing trout streams in Pahalgam, and clear sunny skies across Sonmarg glaciers.
- **Ideal For:** Trekking, river rafting, family road trips avoiding the Indian plains' summer heat.
- **Key Highlights:** Betaab Valley, Aru Valley, Thajiwas Glacier pony treks.

### 4. Autumn Golden Chinar (September to November)
- **What to Expect:** The iconic Chinar trees turn fiery shades of crimson, gold, and amber. The weather turns crisp and clear with fresh apple harvests in Sopore and saffron blooms in Pampore.
- **Ideal For:** Culture enthusiasts, romantic holidays, and peaceful crowd-free sightseeing.
    `.trim(),
    category: 'Travel Guide',
    imageUrl: '/images/gallery/gulmarg-snow.jpg',
    author: {
      name: 'Mrs. Komal & Team',
      role: 'Founder & Valley Specialist',
      avatar: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
    },
    publishedAt: '2026-01-15',
    readTime: '6 min read',
    tags: ['Kashmir Travel Guide', 'Best Time to Visit', 'Gulmarg Snow', 'Srinagar Weather'],
    metaTitle: 'Best Time to Visit Kashmir 2026: Month-by-Month Guide | The Indian Wings Company',
    metaDescription: 'Discover the best time to visit Kashmir. Complete month-by-month weather analysis, snowfall dates in Gulmarg, tulip blooms in Srinagar, and travel tips.',
    isActive: true,
  },
  {
    id: 'blog-2',
    slug: 'gulmarg-gondola-ticket-booking-guide',
    title: 'Gulmarg Gondola Phase 1 & Phase 2 Ticket Booking: Complete Guide & Tips',
    excerpt: 'Everything you need to know about booking official Gulmarg Gondola tickets online: slot timings, OTP requirements, weather alerts, and how to avoid travel agent scams.',
    content: `
The Gulmarg Gondola is the world's second-highest cable car project, soaring to a staggering 13,780 feet atop Apharwat Peak. Because of overwhelming demand, understanding the government's strict online ticketing system is essential.

### Gondola Phases Explained
1. **Phase 1 (Gulmarg to Kongdoori - 8,530 ft to 10,000 ft):** Takes approximately 9 minutes. Offers access to beginner ski slopes, snowmobiles, and cozy pine-side cafes.
2. **Phase 2 (Kongdoori to Apharwat Peak - 10,000 ft to 13,780 ft):** High-alpine terrain. Only recommended for travelers with basic altitude acclimatization. Provides breathtaking views of K2 and Nanga Parbat on clear days.

### Essential Booking Rules
- **Official Portal Only:** Always book strictly via the official J&K Cable Car Corporation portal (jammukashmircablecar.com).
- **OTP Verification:** Tickets are strictly linked to the primary passenger’s mobile OTP and Government photo ID.
- **Advance Window:** Slots open up to 30 days in advance. High-season slots (Dec to Feb & May to June) sell out within minutes of opening.
- **Weather Contingency:** In case of high winds or technical maintenance, tickets for unoperated phases are automatically refunded online to the source account.
    `.trim(),
    category: 'Adventure',
    imageUrl: '/images/gallery/sonmarg-glacier.jpg',
    author: {
      name: 'Srinagar Operations Desk',
      role: 'High-Altitude Ground Coordinator',
      avatar: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
    },
    publishedAt: '2026-02-01',
    readTime: '5 min read',
    tags: ['Gulmarg Gondola', 'Cable Car Booking', 'Apharwat Peak', 'Kashmir Winter Tips'],
    metaTitle: 'Gulmarg Gondola Ticket Booking Guide 2026: Phase 1 & 2 Slots | The Indian Wings Company',
    metaDescription: 'Step-by-step guide to booking Gulmarg Gondola tickets online. Learn about slot timings, phase rates, weather safety, and ID verification rules.',
    isActive: true,
  },
  {
    id: 'blog-3',
    slug: 'what-to-pack-for-kashmir-winter-trip',
    title: 'What to Pack for a Kashmir Winter Trip: Clothing, Thermals & Essentials',
    excerpt: 'Stay warm and comfortable in sub-zero Himalayan weather. Our curated packing checklist for Gulmarg, Pahalgam, and Dal Lake houseboats.',
    content: `
Kashmir winters are enchanting, with temperatures dropping between 5°C and -12°C. Dressing in strategic thermal layers rather than a single bulky jacket is the secret to staying warm and mobile.

### The 3-Layer Golden Rule
1. **Base Layer (Moisture Wicking):** Merino wool or high-grade synthetic thermal top and bottom. Avoid cotton innerwear as it traps perspiration and induces chills.
2. **Middle Layer (Insulation):** Heavy fleece pullover or lightweight down jacket to trap core body heat.
3. **Outer Shell (Weatherproof):** Windproof and waterproof winter parka with a deep hood.

### Footwear & Extremity Protection
- **Boots:** High-ankle waterproof boots with deep rubber treads. Snow boots can also be rented in Tangmarg before climbing to Gulmarg.
- **Gloves:** Waterproof insulated ski mittens or thermal fleece-lined leather gloves.
- **Socks:** 4-5 pairs of thick merino wool socks.
- **Headwear:** Woollen balaclava or fleece beanie covering the ears and forehead completely.

### Essential Medicines & Tech Tips
- Keep lithium phone batteries inside your inner coat pocket, as extreme cold drains battery life rapidly.
- Pack cold relief balms, lip moisturizers with SPF, high-SPF sunscreen (snow reflection causes sunburns), and basic altitude headache tablets.
    `.trim(),
    category: 'Seasonal Tips',
    imageUrl: '/images/gallery/shikara-dal-lake.jpg',
    author: {
      name: 'Mrs. Komal & Team',
      role: 'Founder & Valley Specialist',
      avatar: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
    },
    publishedAt: '2026-02-10',
    readTime: '4 min read',
    tags: ['Kashmir Packing Checklist', 'Winter Clothing Guide', 'Thermal Wear', 'Gulmarg Preparation'],
    metaTitle: 'What to Pack for Kashmir Winter Trip: Essential Clothing Checklist | The Indian Wings Company',
    metaDescription: 'Ultimate packing checklist for your Kashmir winter holiday. Detailed recommendations for thermals, snow boots, jackets, and essential cold weather gear.',
    isActive: true,
  },
  {
    id: 'blog-4',
    slug: 'doodhpathri-vs-pahalgam-comparison',
    title: 'Doodhpathri vs Pahalgam: Which Valley Should You Visit in Kashmir?',
    excerpt: 'Comparing the pristine tranquility of Doodhpathri with the iconic charm and rich activities of Pahalgam. Which one fits your itinerary better?',
    content: `
When planning a 5 to 7-day Kashmir holiday, travelers often wonder whether to prioritize the legendary valley of Pahalgam or the untouched serenity of Doodhpathri (The Valley of Milk).

### Pahalgam: The Established Alpine Jewel
- **Vibe:** Bustling mountain town nestled along the Lidder River with luxury resorts, riverside cafes, and world-class hospitality.
- **Top Attractions:** Betaab Valley, Aru Valley, Baisaran (Mini Switzerland), and Chandanwari.
- **Best For:** Couples seeking 2-night riverside luxury, families wanting horse rides, and river rafting enthusiasts.
- **Drive Time from Srinagar:** Approximately 2.5 hours (90 km).

### Doodhpathri: The Untouched Meadow of Peace
- **Vibe:** Vast, crowd-free rolling green meadows with foaming alpine streams (Shaliganga River) named for milk-white frothing water.
- **Top Attractions:** Untamed pine glades, pristine shepherd trails, crystal-clear river picnics.
- **Best For:** Travelers who dislike commercial crowds, day trips from Srinagar (only 1.5 hours), and romantic quiet strolls.
- **Drive Time from Srinagar:** Approximately 1.5 hours (42 km).

### Our Verdict
If your tour is 6 days or longer, spend **2 nights in Pahalgam** and take a scenic **day excursion to Doodhpathri** on your way to Srinagar Airport!
    `.trim(),
    category: 'Travel Guide',
    imageUrl: '/images/gallery/pahalgam-valley.jpg',
    author: {
      name: 'Srinagar Operations Desk',
      role: 'Handcrafted Itinerary Curator',
      avatar: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
    },
    publishedAt: '2026-02-18',
    readTime: '5 min read',
    tags: ['Doodhpathri', 'Pahalgam', 'Kashmir Valleys', 'Itinerary Planning'],
    metaTitle: 'Doodhpathri vs Pahalgam Comparison: Which is Better? | The Indian Wings Company',
    metaDescription: 'Doodhpathri or Pahalgam? Compare distance from Srinagar, attractions, crowd levels, and hotel options to choose the right destination for your holiday.',
    isActive: true,
  },
];
