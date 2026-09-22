export interface DestinationAttraction {
  id: string;
  name: string;
  category: 'Most Loved Places' | 'Hills & Mountains' | 'Resorts & Stays' | 'Foodie Hotspots' | 'Adventure' | 'Memorable Experience';
  subtitle: string;
  description: string;
  imageUrl: string;
  duration?: string;
}

export interface DestinationSeason {
  id: string;
  period: string; // e.g. 'DEC - MAR'
  label: 'Peak Season' | 'Moderate Season' | 'Off-season';
  whatToExpect: string;
  thingsYoullLove: string[];
}

export interface DestinationFestival {
  name: string;
  month: string;
  description: string;
}

export interface DestinationDetailContent {
  tagline: string;
  attractions: DestinationAttraction[];
  seasons: DestinationSeason[];
  festivals: DestinationFestival[];
}

export const destinationDetailContentData: Record<string, DestinationDetailContent> = {
  gulmarg: {
    tagline: 'All year round destination',
    attractions: [
      {
        id: 'gul-1',
        name: 'Gulmarg Gondola Ride',
        category: 'Most Loved Places',
        subtitle: 'Scenic Cable-Car Ride',
        description: 'One of the highest operating cable cars in the world, ascending to Apharwat Peak at 13,780 ft with sweeping views of the Pir Panjal range.',
        imageUrl: '/images/gallery/gulmarg-snow.jpg',
        duration: '2–3 Hours',
      },
      {
        id: 'gul-2',
        name: 'Gulmarg Biosphere Reserve',
        category: 'Hills & Mountains',
        subtitle: 'Home to Rare Species',
        description: 'Sanctuary nestled amid dense coniferous forests, home to the endangered musk deer, Himalayan brown bear, and exotic avifauna.',
        imageUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
        duration: 'Half Day',
      },
      {
        id: 'gul-3',
        name: 'Alpather Lake',
        category: 'Hills & Mountains',
        subtitle: 'Photographic Water Body',
        description: 'A high-altitude glacial lake at the foot of Apharwat Peak that remains frozen well into mid-summer, surrounded by jagged cliffs.',
        imageUrl: '/images/gallery/sonmarg-glacier.jpg',
        duration: 'Full Day Trek',
      },
      {
        id: 'gul-4',
        name: 'Historic Highland Stays',
        category: 'Resorts & Stays',
        subtitle: 'Alpine Heritage Chalets',
        description: 'Colonial-era wooden chalets and luxury mountain retreats offering heated pine floors, wood-fired bukharis, and slope-side panoramas.',
        imageUrl: '/images/gallery/houseboat-kashmir.jpg',
        duration: 'Overnight',
      },
      {
        id: 'gul-5',
        name: 'Highland Wazwan & Kehwa Lounge',
        category: 'Foodie Hotspots',
        subtitle: 'Authentic Mountain Flavors',
        description: 'Savor traditional saffron-infused Kashmiri Kehwa paired with slow-cooked Rogan Josh and piping-hot lavasa bread beside roaring log hearths.',
        imageUrl: '/images/gallery/shikara-dal-lake.jpg',
        duration: '1–2 Hours',
      },
      {
        id: 'gul-6',
        name: 'Apharwat Powder Snow Skiing',
        category: 'Adventure',
        subtitle: 'World-Class Snow Bowls',
        description: 'Renowned worldwide for dry powder snow, Apharwat offers backcountry freeride trails and guided ski courses for beginners to veterans.',
        imageUrl: '/images/gallery/gulmarg-snow.jpg',
        duration: '4–6 Hours',
      },
      {
        id: 'gul-7',
        name: 'Strawberry Valley Picnic',
        category: 'Memorable Experience',
        subtitle: 'Emerald Pastures & Wild Berries',
        description: 'A serene pastoral valley famed for summer wild strawberry blossoms, pine forest horse rides, and classic Bollywood cinema backdrops.',
        imageUrl: '/images/gallery/pahalgam-valley.jpg',
        duration: '2–3 Hours',
      },
      {
        id: 'gul-8',
        name: "St. Mary's Historic Church",
        category: 'Most Loved Places',
        subtitle: 'Victorian Architecture (1902)',
        description: 'Century-old British Victorian stone church perched peacefully on a rolling knoll, presenting enchanting snowy silhouettes in winter.',
        imageUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
        duration: '1 Hour',
      },
      {
        id: 'gul-9',
        name: 'Gulmarg Historic Golf Course',
        category: 'Memorable Experience',
        subtitle: 'Highest 18-Hole Course',
        description: 'Established in 1911, this undulating alpine green sits at 8,690 ft, dotted with wildflowers and framed by towering deodar trees.',
        imageUrl: '/images/gallery/pahalgam-valley.jpg',
        duration: '2–3 Hours',
      },
    ],
    seasons: [
      {
        id: 'gul-s1',
        period: 'DEC - MAR',
        label: 'Peak Season',
        whatToExpect: 'Thick powdery snow blanket across meadows and ridges. Sub-zero temperatures, operational Phase I & II Gondolas, and lively winter adventure sports.',
        thingsYoullLove: [
          'Powder snow skiing, snowboarding, and snowmobiling on Apharwat slopes',
          'Cinematic rides on the world-renowned Gulmarg Gondola over snow-covered pine forests',
          'Cozy evenings by wood-burning bukharis with authentic saffron kehwa',
        ],
      },
      {
        id: 'gul-s2',
        period: 'APR - JUN',
        label: 'Moderate Season',
        whatToExpect: 'Lush alpine meadow thaw, blooming wildflowers, cool crisp breezes, and clear blue mountain skies with daytime warmth.',
        thingsYoullLove: [
          'Vibrant green pastures carpeted with buttercups, lupines, and wild daisies',
          'Pony treks to Strawberry Valley and frozen Alpather Lake as ice begins to thaw',
          'Pleasant outdoor weather ideal for family walks, photography, and golf sessions',
        ],
      },
      {
        id: 'gul-s3',
        period: 'JUL - NOV',
        label: 'Off-season',
        whatToExpect: 'Lush monsoon greenery in July-August giving way to crisp autumn mornings, golden chinar foliage, and quiet unhurried pine trails.',
        thingsYoullLove: [
          'Peaceful crowd-free mountain walks through quiet deodar woodland trails',
          'Crisp golden autumn sunshine highlighting Pir Panjal mountain silhouettes',
          'Economical boutique stays with tailored private vehicle arrangements',
        ],
      },
    ],
    festivals: [
      {
        name: 'Gulmarg Winter Festival',
        month: 'December – January',
        description: 'Celebrates winter sports, traditional music, ice sculpting competitions, and evening cultural performances against the snow peaks.',
      },
      {
        name: 'Snow Carnival & Ski Cup',
        month: 'February',
        description: 'Annual championship attracting national skiers, freeriders, and cultural troupes for races on Apharwat slopes.',
      },
    ],
  },
  srinagar: {
    tagline: 'The timeless heart of the Kashmir valley',
    attractions: [
      {
        id: 'sri-1',
        name: 'Dal Lake & Floating Boulevard',
        category: 'Most Loved Places',
        subtitle: 'Jewel in the Crown of Kashmir',
        description: 'Vast, mirror-like lake adorned with intricately carved cedar houseboats, colorful floating flower vendors, and tranquil wooden shikaras.',
        imageUrl: '/images/gallery/shikara-dal-lake.jpg',
        duration: '2–3 Hours',
      },
      {
        id: 'sri-2',
        name: 'Mughal Gardens (Shalimar & Nishat)',
        category: 'Hills & Mountains',
        subtitle: 'Terraced Imperial Sanctuaries',
        description: 'Centuries-old terraced gardens cascading toward the lakeshore, framed by ancient Chinar trees, fountains, and vibrant seasonal blossoms.',
        imageUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
        duration: '2–3 Hours',
      },
      {
        id: 'sri-3',
        name: 'Heritage Cedar Houseboats',
        category: 'Resorts & Stays',
        subtitle: 'Floating Boutique Hospitality',
        description: 'Handcrafted floating palaces made of fragrant deodar wood, featuring Kashmiri walnut wood carvings, Persian rugs, and lakeside dining.',
        imageUrl: '/images/gallery/houseboat-kashmir.jpg',
        duration: 'Overnight',
      },
      {
        id: 'sri-4',
        name: 'Old City Traditional Wazwan Feast',
        category: 'Foodie Hotspots',
        subtitle: 'Master Culinary Tradition',
        description: 'Indulge in a ceremonial 36-course Wazwan feast prepared by master Wazas, featuring Rista, Gushtaba, Tabak Maaz, and Rogan Josh.',
        imageUrl: '/images/gallery/shikara-dal-lake.jpg',
        duration: '1–2 Hours',
      },
      {
        id: 'sri-5',
        name: 'Shankaracharya Hilltop Temple',
        category: 'Adventure',
        subtitle: 'Ancient Stone Shrine & Vistas',
        description: 'Perched at 1,100 ft atop Takht-i-Sulaiman hill, this 9th-century stone temple offers an unmatched 360-degree panorama of Srinagar city.',
        imageUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
        duration: '2 Hours',
      },
      {
        id: 'sri-6',
        name: 'Sunrise Floating Vegetable Market',
        category: 'Memorable Experience',
        subtitle: 'Centuries-Old Morning Tradition',
        description: 'An early-morning spectacle on the inner waterways of Dal Lake where local farmers trade fresh produce and water lilies from wooden boats.',
        imageUrl: '/images/gallery/shikara-dal-lake.jpg',
        duration: '1.5 Hours',
      },
    ],
    seasons: [
      {
        id: 'sri-s1',
        period: 'APR - JUN',
        label: 'Peak Season',
        whatToExpect: 'Warm, pleasant sunny days with cool evenings. Blooming tulips, blooming lotus flowers on Nigeen Lake, and vibrant Mughal garden fountains.',
        thingsYoullLove: [
          'Visiting the Indira Gandhi Memorial Tulip Garden in full vibrant bloom',
          'Sunset shikara rides across Dal Lake as the Zabarwan range turns golden',
          'Al-fresco evening dining on houseboat verandas under star-filled valley skies',
        ],
      },
      {
        id: 'sri-s2',
        period: 'SEP - NOV',
        label: 'Moderate Season',
        whatToExpect: 'Mild temperatures, crisp autumn breezes, and the world-famous golden Chinar transformation across the entire valley.',
        thingsYoullLove: [
          'Walking through the fire-red and gold Chinar avenues of Naseem Bagh',
          'Sipping warm saffron kehwa while watching mist rise from Dal Lake',
          'Exploring artisanal carpet, pashmina, and walnut carving workshops in Downtown',
        ],
      },
      {
        id: 'sri-s3',
        period: 'DEC - FEB',
        label: 'Off-season',
        whatToExpect: 'Cold temperatures with occasional snowfall blanketing Mughal pavilions and frozen edges along quiet waterways.',
        thingsYoullLove: [
          'Intimate winter stays on heated houseboats equipped with authentic bukharis',
          'Serene, unhurried city walks free from commercial hustle and crowds',
          'Steaming samovar tea, Harissa breakfasts in the historic Old City',
        ],
      },
    ],
    festivals: [
      {
        name: 'Kashmir Tulip Festival',
        month: 'April',
        description: 'Asia’s largest tulip festival with over 1.5 million tulips across 60+ varieties blooming beneath the Zabarwan mountain backdrop.',
      },
      {
        name: 'Shikara Festival',
        month: 'July – August',
        description: 'Colorful water pageant on Dal Lake with decorated boat races, dragon boats, and floating music recitals.',
      },
    ],
  },
  pahalgam: {
    tagline: 'The idyllic valley of shepherds and gushing alpine rivers',
    attractions: [
      {
        id: 'pah-1',
        name: 'Betaab Valley Meadows',
        category: 'Most Loved Places',
        subtitle: 'Picturesque Fir-Clad Basin',
        description: 'Sprawling river meadow encircled by deodar woods and snow peaks, named after the iconic 1983 Bollywood film that made it legendary.',
        imageUrl: '/images/gallery/pahalgam-valley.jpg',
        duration: '2–3 Hours',
      },
      {
        id: 'pah-2',
        name: 'Aru Valley & Wild Himalayan Gateway',
        category: 'Hills & Mountains',
        subtitle: 'Eco-Tourism Haven',
        description: 'Picturesque village nestled 12 km upstream from Pahalgam, serving as base camp for trekking expeditions to Kolahoi Glacier and Tarsar Lake.',
        imageUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
        duration: 'Half Day',
      },
      {
        id: 'pah-3',
        name: 'Lidder River Riverside Cottages',
        category: 'Resorts & Stays',
        subtitle: 'Pine Wood Solitude',
        description: 'Boutique riverfront lodges nestled right beside the crystal Lidder River, offering sound-of-water sleep and mountain morning views.',
        imageUrl: '/images/gallery/houseboat-kashmir.jpg',
        duration: 'Overnight',
      },
      {
        id: 'pah-4',
        name: 'Lidder River Trout Angling & Grills',
        category: 'Foodie Hotspots',
        subtitle: 'Fresh Himalayan Trout',
        description: 'Freshly prepared brown and rainbow trout cooked with local mountain herbs and Kashmiri spices at charming riverside restaurants.',
        imageUrl: '/images/gallery/pahalgam-valley.jpg',
        duration: '1–2 Hours',
      },
      {
        id: 'pah-5',
        name: 'White Water Rafting on Lidder River',
        category: 'Adventure',
        subtitle: 'Grade II & III River Rapids',
        description: 'Exhilarating river rafting along the frothing rapids of the Lidder River, guided by certified river safety masters.',
        imageUrl: '/images/gallery/sonmarg-glacier.jpg',
        duration: '2 Hours',
      },
      {
        id: 'pah-6',
        name: 'Baisaran (Mini Switzerland) Pony Ride',
        category: 'Memorable Experience',
        subtitle: 'Hilltop Pine Glade',
        description: 'A hilltop clearing surrounded by dense pine groves and towering mountain peaks, accessible via scenic bridle path pony trails.',
        imageUrl: '/images/gallery/pahalgam-valley.jpg',
        duration: '2–3 Hours',
      },
    ],
    seasons: [
      {
        id: 'pah-s1',
        period: 'APR - JUN',
        label: 'Peak Season',
        whatToExpect: 'Lush green valleys, roaring melted Lidder waters, warm comfortable days and pleasant mountain evenings.',
        thingsYoullLove: [
          'Picnics along the lush riverside banks of Betaab and Aru valleys',
          'White-water river rafting and trout angling along the Lidder River',
          'Pleasant pony rides through high pine forests up to Baisaran meadow',
        ],
      },
      {
        id: 'pah-s2',
        period: 'JUL - OCT',
        label: 'Moderate Season',
        whatToExpect: 'Gentle summer transitioning into brilliant golden autumn amber across riverside willow and walnut groves.',
        thingsYoullLove: [
          'Trekking base camp journeys toward Kolahoi Glacier and high alpine lakes',
          'Fresh walnut harvest and apple orchard picking throughout the valley',
          'Cool, refreshing autumn weather ideal for extended outdoor riverside exploration',
        ],
      },
      {
        id: 'pah-s3',
        period: 'NOV - FEB',
        label: 'Off-season',
        whatToExpect: 'Peaceful snow-dusted pine woods, frosty river stones, and absolute tranquility away from peak pilgrimage and tour crowds.',
        thingsYoullLove: [
          'Snow-covered pine landscapes creating enchanting winter wonderland vistas',
          'Quiet romantic stays with wood-burning fireplaces and warm hospitality',
          'Scenic unhurried winter drives along the snow-banked Lidder Valley road',
        ],
      },
    ],
    festivals: [
      {
        name: 'Pahalgam Cultural & River Festival',
        month: 'May – June',
        description: 'Celebrates Kashmiri folk music, local handicraft exhibitions, and river sports tournaments along the Lidder River banks.',
      },
    ],
  },
  sonmarg: {
    tagline: 'Meadow of Gold & high alpine glacier gateway',
    attractions: [
      {
        id: 'son-1',
        name: 'Thajiwas Glacier Excursion',
        category: 'Most Loved Places',
        subtitle: 'Year-Round Alpine Glacier',
        description: 'Spectacular hanging glacier easily accessible via pony ride or gentle trek, featuring perennial snow cover and mountain streams.',
        imageUrl: '/images/gallery/sonmarg-glacier.jpg',
        duration: '3–4 Hours',
      },
      {
        id: 'son-2',
        name: 'Zoji La Pass & Zero Point',
        category: 'Hills & Mountains',
        subtitle: 'Dramatic High Mountain Gateway',
        description: 'Strategic high-altitude mountain pass on the Srinagar-Leh highway, presenting breathtaking snow walls and raw trans-Himalayan cliffs.',
        imageUrl: '/images/gallery/gulmarg-snow.jpg',
        duration: 'Half Day',
      },
      {
        id: 'son-3',
        name: 'Sindh River Alpine Camps',
        category: 'Resorts & Stays',
        subtitle: 'Luxury Riverside Glamping',
        description: 'Boutique all-weather luxury safari tents set along the gushing Sindh River with direct views of snow-draped alpine peaks.',
        imageUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
        duration: 'Overnight',
      },
      {
        id: 'son-4',
        name: 'Sindh Valley Trout & Campfire',
        category: 'Foodie Hotspots',
        subtitle: 'Fresh Glacial Trout Delicacies',
        description: 'Glacial water trout harvested fresh and grilled with wild Himalayan herbs beside crackling riverside fire pits.',
        imageUrl: '/images/gallery/sonmarg-glacier.jpg',
        duration: '1–2 Hours',
      },
      {
        id: 'son-5',
        name: 'Great Lakes Trek Base Camp',
        category: 'Adventure',
        subtitle: 'Kashmir’s Ultimate Alpine Trek',
        description: 'Starting point for the legendary Kashmir Great Lakes trek traversing Vishansar, Gadsar, and Satsar alpine water bodies.',
        imageUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
        duration: 'Multi-Day Expedition',
      },
      {
        id: 'son-6',
        name: 'Baltal Valley Camp Exploration',
        category: 'Memorable Experience',
        subtitle: 'Rugged Canyon Pastures',
        description: 'Scenic base valley surrounded by towering vertical rock walls, serving as the northern staging ground for mountain treks.',
        imageUrl: '/images/gallery/sonmarg-glacier.jpg',
        duration: '2 Hours',
      },
    ],
    seasons: [
      {
        id: 'son-s1',
        period: 'MAY - SEP',
        label: 'Peak Season',
        whatToExpect: 'Clear mountain access, sunny days, blooming alpine pastures, and lively glacier excursions under pleasant weather.',
        thingsYoullLove: [
          'Snow sledging and photography on the slopes of Thajiwas Glacier',
          'Scenic excursions up to Zoji La Pass and Zero Point snow fields',
          'High-altitude camping under pristine dark skies beside the Sindh River',
        ],
      },
      {
        id: 'son-s2',
        period: 'OCT - NOV',
        label: 'Moderate Season',
        whatToExpect: 'Crisp pre-winter cold, golden alpine grasses, and early snow dustings on the higher mountain peaks.',
        thingsYoullLove: [
          'Quiet uncrowded glacier walks with pristine crisp visibility',
          'Vibrant autumn colors contrasting sharply against snowy crags',
          'Photography of early snowfall dustings over the Sindh River basin',
        ],
      },
      {
        id: 'son-s3',
        period: 'DEC - APR',
        label: 'Off-season',
        whatToExpect: 'Heavy snow accumulations closing upper passes; accessible via snow-cleared roads for specialized winter travelers.',
        thingsYoullLove: [
          'Raw untouched deep snowscapes for serious wilderness seekers',
          'Winter solitude away from commercial summer tour routes',
          'Pristine white landscapes untouched by footsteps or traffic',
        ],
      },
    ],
    festivals: [
      {
        name: 'Sindh Darshan & River Celebration',
        month: 'June',
        description: 'Cultural gathering celebrating the pristine waters of the Sindh River with local folk songs, prayer ceremonies, and nature walks.',
      },
    ],
  },
  'gurez-valley': {
    tagline: 'Explore the Offbeat Side of Kashmir',
    attractions: [
      {
        id: 'gur-1',
        name: 'Habba Khatoon Peak & Spring',
        category: 'Most Loved Places',
        subtitle: 'Pyramid-Shaped Mountain Peak',
        description: 'Legendary pyramid mountain named after the 16th-century poetess-queen Habba Khatoon, rising abruptly above the turquoise Kishanganga River with a crystal-clear spring waterfall at its base.',
        imageUrl: '/images/gallery/kashmir-summit-view.png',
        duration: '2–3 Hours',
      },
      {
        id: 'gur-2',
        name: 'Dawar Heritage Settlement',
        category: 'Hills & Mountains',
        subtitle: 'Ancient Dard-Shin Center',
        description: 'The central township of Gurez, characterized by traditional log-wood architecture, ancient archaeological relics, and warm Dard-Shin mountain hospitality.',
        imageUrl: '/images/gallery/pahalgam-valley.jpg',
        duration: 'Half Day',
      },
      {
        id: 'gur-3',
        name: 'Tulail Valley Expedition',
        category: 'Hills & Mountains',
        subtitle: 'Untouched Wilderness Border Valley',
        description: 'A breathtaking 40 km excursion deeper past Dawar through rustic wooden hamlets, wildflower pastures, and scenic Kishanganga riverbends.',
        imageUrl: '/images/gallery/sonmarg-glacier.jpg',
        duration: 'Full Day',
      },
      {
        id: 'gur-4',
        name: 'Riverside Log Camps & Stays',
        category: 'Resorts & Stays',
        subtitle: 'Offbeat Alpine Stays',
        description: 'Peaceful wooden cottages and comfortable riverside camping setups right beside the rushing Kishanganga River with mountain views.',
        imageUrl: '/images/gallery/houseboat-kashmir.jpg',
        duration: 'Overnight',
      },
      {
        id: 'gur-5',
        name: 'Traditional Dardic & Kashmiri Kehwa',
        category: 'Foodie Hotspots',
        subtitle: 'Mountain Flavors & Breads',
        description: 'Warm up with saffron and wild herb kehwa accompanied by traditional tandoori flatbreads and home-cooked Kashmiri dishes.',
        imageUrl: '/images/gallery/shikara-dal-lake.jpg',
        duration: '1 Hour',
      },
      {
        id: 'gur-6',
        name: 'Razdan Pass (11,672 ft) Crossing',
        category: 'Adventure',
        subtitle: 'Thrilling Mountain Pass',
        description: 'Dramatic high-altitude mountain pass offering 360-degree vistas of the Pir Panjal, Mt Harmukh, and the roaring Kishanganga canyon.',
        imageUrl: '/images/gallery/gulmarg-snow.jpg',
        duration: '2 Hours',
      },
    ],
    seasons: [
      {
        id: 'gur-s1',
        period: 'MAY - SEP',
        label: 'Peak Season',
        whatToExpect: 'Passes are fully open, lush emerald meadows, blooming wildflowers, and refreshing crisp alpine breezes.',
        thingsYoullLove: [
          'Spectacular views of Habba Khatoon Peak and the azure Kishanganga River',
          'Full-day expeditions to remote Tulail Valley wooden villages',
          'Pleasant daytime temperatures ideal for photography and village walks',
        ],
      },
      {
        id: 'gur-s2',
        period: 'OCT - NOV',
        label: 'Moderate Season',
        whatToExpect: 'Golden autumn grasslands, crisp morning chill, and early dusting of snow on the upper Himalayan ridgelines.',
        thingsYoullLove: [
          'Striking contrast between golden valley fields and snow-capped peaks',
          'Peaceful, unhurried atmosphere with genuine local cultural interaction',
          'Crisp mountain visibility ideal for landscape photography',
        ],
      },
      {
        id: 'gur-s3',
        period: 'DEC - APR',
        label: 'Off-season',
        whatToExpect: 'Heavy snowfall across Razdan Pass closes surface access; valley rests under pristine white winter silence.',
        thingsYoullLove: [
          'Untouched deep winter snow cover across the entire Himalayan basin',
        ],
      },
    ],
    festivals: [
      {
        name: 'Gurez Tourism & Culture Festival',
        month: 'July – August',
        description: 'Annual cultural celebration organized by J&K Tourism showcasing traditional Shin-Dard folk dance, music, handicrafts, and local cuisines.',
      },
    ],
  },
};

destinationDetailContentData['gurez'] = destinationDetailContentData['gurez-valley'];

// Fallback content generator for off-beat / other destinations (Gurez, Doodhpathri, Yusmarg, Sinthan Top, Bangus)
export function getDestinationContentBySlug(slug: string, name: string): DestinationDetailContent {
  const normalizedSlug = slug.toLowerCase();
  if (destinationDetailContentData[normalizedSlug]) {
    return destinationDetailContentData[normalizedSlug];
  }

  // Graceful fallback keeping real content principles and dynamic destination name
  return {
    tagline: `Pristine Himalayan landscapes and authentic mountain charm in ${name}`,
    attractions: [
      {
        id: `${normalizedSlug}-1`,
        name: `${name} Valley Meadows`,
        category: 'Most Loved Places',
        subtitle: 'Untouched Natural Sanctuary',
        description: `Sprawling pastoral meadows and crystal-clear mountain streams sheltered beneath the majestic Himalayan ridges of ${name}.`,
        imageUrl: '/images/gallery/pahalgam-valley.jpg',
        duration: '2–3 Hours',
      },
      {
        id: `${normalizedSlug}-2`,
        name: `${name} Ridge Viewpoint`,
        category: 'Hills & Mountains',
        subtitle: 'High Mountain Panoramas',
        description: `Elevated vantage points offering 360-degree views across untamed pine forests and snow-crested mountain peaks.`,
        imageUrl: '/images/gallery/sonmarg-glacier.jpg',
        duration: 'Half Day',
      },
      {
        id: `${normalizedSlug}-3`,
        name: 'Eco Pine Lodges & Alpine Camps',
        category: 'Resorts & Stays',
        subtitle: 'Rustic Mountain Hospitality',
        description: `Peaceful wooden eco-lodges and comfortable alpine camping setups designed to immerse travelers in nature.`,
        imageUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
        duration: 'Overnight',
      },
      {
        id: `${normalizedSlug}-4`,
        name: 'Local Shepherd Trails & Kehwa Stops',
        category: 'Foodie Hotspots',
        subtitle: 'Traditional Warmth',
        description: `Warm up with authentic saffron kehwa and fresh mountain breads at welcoming local village tea stops.`,
        imageUrl: '/images/gallery/shikara-dal-lake.jpg',
        duration: '1 Hour',
      },
      {
        id: `${normalizedSlug}-5`,
        name: 'Wilderness Stream Trek',
        category: 'Adventure',
        subtitle: 'Off-Beat Exploration',
        description: `Guided trek along gushing mountain streams, untouched wildflower glades, and remote forest trails.`,
        imageUrl: '/images/gallery/gulmarg-snow.jpg',
        duration: '3–5 Hours',
      },
      {
        id: `${normalizedSlug}-6`,
        name: 'Stargazing in Dark Sky Zone',
        category: 'Memorable Experience',
        subtitle: 'Pristine Night Skies',
        description: `Zero light pollution allows breathtaking views of the Milky Way, shooting stars, and crisp mountain constellations.`,
        imageUrl: 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png',
        duration: 'Evening',
      },
    ],
    seasons: [
      {
        id: `${normalizedSlug}-s1`,
        period: 'MAY - SEP',
        label: 'Peak Season',
        whatToExpect: `Lush emerald meadows, clear mountain trails, and pleasant daytime temperatures ideal for exploration in ${name}.`,
        thingsYoullLove: [
          'Boundless green carpets dotted with wildflowers and grazing sheep',
          'Crystal-clear streams and refreshing pine forest air',
          'Safe and comfortable road access through scenic mountain routes',
        ],
      },
      {
        id: `${normalizedSlug}-s2`,
        period: 'OCT - NOV',
        label: 'Moderate Season',
        whatToExpect: `Crisp autumn mornings, golden alpine grasses, and early snow dustings on surrounding mountain crests.`,
        thingsYoullLove: [
          'Absolute peacefulness with very few tourists',
          'Stunning contrast between golden meadows and snowy ridges',
          'Clear crisp skies ideal for landscape photography',
        ],
      },
      {
        id: `${normalizedSlug}-s3`,
        period: 'DEC - APR',
        label: 'Off-season',
        whatToExpect: `Heavy winter snow cover with serene mountain stillness and quiet winter landscapes.`,
        thingsYoullLove: [
          'Untouched pristine snowfields stretching as far as the eye can see',
          'Authentic cozy village stays with wood fires and traditional hospitality',
        ],
      },
    ],
    festivals: [
      {
        name: `${name} Cultural & Nature Meet`,
        month: 'July',
        description: `Local folk music recitals, community gatherings, and nature conservation walks showcasing regional Dardic and Kashmiri heritage.`,
      },
    ],
  };
}
