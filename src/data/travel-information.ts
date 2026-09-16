export interface TravelQuickTip {
  id: string;
  icon: string;
  title: string;
  shortDesc: string;
  badge?: string;
  badgeType?: 'warning' | 'info' | 'success';
}

export interface TravelSectionItem {
  title: string;
  description: string;
  bullets?: string[];
  alert?: {
    type: 'warning' | 'info' | 'tip';
    text: string;
  };
}

export interface TravelInfoSection {
  id: string;
  navTitle: string;
  title: string;
  subtitle: string;
  icon: string;
  items: TravelSectionItem[];
}

export interface TravelFaq {
  question: string;
  answer: string;
  category: string;
}

export const TRAVEL_QUICK_TIPS: TravelQuickTip[] = [
  {
    id: 'sim',
    icon: 'Smartphone',
    title: 'Postpaid SIM Mandatory',
    shortDesc: 'Prepaid SIMs from other states do not work in J&K due to telecom regulations. Ensure you have a Postpaid connection or purchase a local SIM.',
    badge: 'Crucial Requirement',
    badgeType: 'warning'
  },
  {
    id: 'airport',
    icon: 'Plane',
    title: 'Airport Security Timeline',
    shortDesc: 'Srinagar Airport (SXR) has strict 3-tier security. Report at least 2.5 to 3 hours prior to departure.',
    badge: 'Departure Advisory',
    badgeType: 'info'
  },
  {
    id: 'gondola',
    icon: 'CableCar',
    title: 'Pre-book Gulmarg Gondola',
    shortDesc: 'Phase 1 & 2 tickets sell out weeks in advance. Always book strictly via official JKTDC portal before travel.',
    badge: 'High Demand',
    badgeType: 'warning'
  },
  {
    id: 'cabs',
    icon: 'Car',
    title: 'Local Union Taxi System',
    shortDesc: 'Srinagar cabs can drop you at Gulmarg, Pahalgam, and Sonmarg, but local sightseeing requires local union vehicles.',
    badge: 'Transparent Advisory',
    badgeType: 'info'
  },
  {
    id: 'cash',
    icon: 'Banknote',
    title: 'Carry Adequate Cash',
    shortDesc: 'While UPI works in Srinagar, remote valleys, pony handlers, sledge riders, and rural tea stalls rely strictly on cash.',
    badge: 'Payment Tip',
    badgeType: 'success'
  },
  {
    id: 'id',
    icon: 'ShieldCheck',
    title: 'Valid Government Photo ID',
    shortDesc: 'Carry original Aadhaar, Passport, or Voter ID for every traveler for hotel check-ins, security gates, and checkpoints.',
    badge: 'Mandatory',
    badgeType: 'info'
  }
];

export const TRAVEL_INFO_SECTIONS: TravelInfoSection[] = [
  {
    id: 'connectivity',
    navTitle: 'SIM & Connectivity',
    title: 'Mobile Networks, SIM Cards & WiFi',
    subtitle: 'Stay connected throughout your Kashmiri getaway without unexpected network blackouts.',
    icon: 'Wifi',
    items: [
      {
        title: 'The Postpaid Connection Rule',
        description: 'By order of the Department of Telecommunications (DoT), all prepaid mobile connections issued outside Jammu & Kashmir are automatically blocked from national roaming within the territory.',
        bullets: [
          'Postpaid SIM cards from Jio, Airtel, and BSNL work smoothly with high-speed 4G/5G data in Srinagar, Gulmarg, and Pahalgam.',
          'Prepaid connections from outside J&K will completely lose signal the moment you land or cross the state border.',
          'If you only have a prepaid connection, convert it to postpaid with your operator 3-4 days before your departure date.'
        ],
        alert: {
          type: 'warning',
          text: 'Crucial: Convert your mobile connection to Postpaid before traveling, or prepare to purchase a tourist SIM upon arrival.'
        }
      },
      {
        title: 'Buying a Local Tourist SIM in Srinagar',
        description: 'If you arrive with an inactive prepaid connection, authorized telecom counters are situated right inside Srinagar Airport Arrival Terminal (Jio, Airtel, BSNL).',
        bullets: [
          'Requirements: Original Aadhaar Card or Passport, plus 1 passport-sized photo.',
          'Activation typically takes between 2 to 4 hours post-verification.',
          'Tourist SIMs come bundled with 1.5GB/day data and unlimited domestic calling valid for 28 days.'
        ]
      },
      {
        title: 'High-Speed WiFi in Stays & Houseboats',
        description: 'Practically all registered luxury hotels, resorts, and premium heritage houseboats on Dal and Nigeen Lake provide complimentary high-speed optical fiber WiFi. Work-from-Kashmir travelers report steady connections suitable for Zoom calls and video streaming.'
      }
    ]
  },
  {
    id: 'airport-logistics',
    navTitle: 'Airport Protocols',
    title: 'Srinagar Airport (SXR) Guidelines & Protocols',
    subtitle: 'Smooth arrivals and departure procedures through one of India’s highest-security airports.',
    icon: 'Plane',
    items: [
      {
        title: 'Departure Timing & Multi-Tier Screening',
        description: 'Sheikh ul-Alam International Airport operates under high-security guidelines supervised by CISF and Jammu & Kashmir Police. Security procedures include vehicle perimeter screening before reaching the terminal.',
        bullets: [
          'Arrive at least 2.5 to 3 hours prior to your scheduled domestic flight departure.',
          'Initial vehicle baggage drop-off occurs approx. 1 km prior to the departure porch, followed by terminal entry verification.',
          'Always keep hard copy or downloaded offline flight e-tickets and original Government Photo IDs ready.'
        ],
        alert: {
          type: 'info',
          text: 'Power banks, camera spare lithium batteries, and electronic chargers must strictly remain in hand baggage. Never pack them in check-in luggage.'
        }
      },
      {
        title: 'Arrival Pickups & Transfers',
        description: 'When traveling with The Indian Wings Company, your private chauffeur greets you right at the designated tourist arrival lounge holding a personalized name placard. For independent travelers, a Government Prepaid Taxi Counter is positioned outside the arrival gates.'
      }
    ]
  },
  {
    id: 'local-transport',
    navTitle: 'Local Transport & Cabs',
    title: 'The Kashmir Union Taxi System & Internal Transfers',
    subtitle: 'Clear, transparent explanations to help you navigate valley travel with zero friction or confusion.',
    icon: 'Car',
    items: [
      {
        title: 'How Union Cabs Work in Tourist Hubs',
        description: 'Jammu & Kashmir has localized Taxi Operators Unions in Gulmarg, Pahalgam, and Sonmarg to protect local livelihoods. Outside vehicles (including Srinagar cabs and self-drive cars) are permitted to drop tourists off at their resort or main taxi stand, but are restricted from carrying out internal sightseeing points.',
        bullets: [
          'Pahalgam: Srinagar cabs drop you at the main town. To visit Aru Valley, Betaab Valley, and Chandanwari, a local Pahalgam Union Cab must be hired (rates are fixed by the J&K Tourism department).',
          'Sonmarg: During winter/spring, outside cabs drop at Zero Point / Gagangir checkpoint; local union 4x4 snow-chain cabs operate the final snowy stretch into the main valley and Thajiwas Glacier route.',
          'Gulmarg: In heavy winter snow (Dec–March), standard vehicles must halt at Tangmarg. Union 4x4 vehicles fitted with metallic snow chains ferry passengers up the 12 km winding snow climb to Gulmarg bowl.'
        ],
        alert: {
          type: 'tip',
          text: 'With The Indian Wings Company, our customized luxury itineraries clearly coordinate and pre-arrange all internal union transitions in advance.'
        }
      },
      {
        title: 'Pony Rides & Sledge Operations',
        description: 'Pony operators (Khachurwalas) and wooden sledge pullers operate extensively in Gulmarg meadows, Sonmarg Thajiwas, and Pahalgam Baisaran (Mini Switzerland). Rates are regulated by the tourism board, though seasonal bargaining is standard practice. Always clarify the total round-trip package rate before embarking.'
      },
      {
        title: 'Shikara Rides on Dal & Nigeen Lakes',
        description: 'Official J&K Tourism Shikara tariffs are approximately ₹700 to ₹1,000 per hour per boat (seating up to 4 adults). Sunrise floating vegetable market tours typically require a 2 to 3 hour private hire.'
      }
    ]
  },
  {
    id: 'gondola-booking',
    navTitle: 'Gulmarg Gondola',
    title: 'Gulmarg Gondola: Phase 1 & Phase 2 Complete Guide',
    subtitle: 'How to conquer Asia’s highest operating cable car without ticketing mishaps.',
    icon: 'CableCar',
    items: [
      {
        title: 'Phase 1 vs. Phase 2 Explained',
        description: 'The Gulmarg Gondola rises across two breathtaking altitude tiers against Mt. Apharwat:',
        bullets: [
          'Phase 1 (Gulmarg Resort to Kongdoori): 2,690m to 3,050m (approx. 10,000 ft). Lush pine bowl, cafes, snow activities during early spring and winter.',
          'Phase 2 (Kongdoori to Apharwat Peak): 3,050m to 3,950m (approx. 13,050 ft). Dramatic alpine glacial peak, sub-zero snowfields, panoramic Pir Panjal peaks, and Line of Control vantage.'
        ]
      },
      {
        title: 'Official Online Ticketing Protocol',
        description: 'Physical ticket counters at Gulmarg Gondola have been permanently discontinued. Every single ticket must be booked exclusively through the official J&K Cable Car Corporation portal (jammukashmircablecar.com).',
        bullets: [
          'Slots open 30 days in advance and sell out within minutes during peak season (April–June & Christmas/New Year).',
          'Children above 3 years require a full ticket.',
          'Always carry the original photo ID matching the name entered during ticket booking.'
        ],
        alert: {
          type: 'warning',
          text: 'Beware of unofficial touts promising offline tickets. Always book tickets directly or coordinate through your verified tour operator.'
        }
      }
    ]
  },
  {
    id: 'packing-clothing',
    navTitle: 'Clothing & Packing',
    title: 'Season-Wise Packing Guide & Dress Etiquette',
    subtitle: 'Stay warm, dry, and comfortable across changing Himalayan microclimates.',
    icon: 'Shirt',
    items: [
      {
        title: 'Winter & Snow Season (December – March)',
        description: 'Sub-zero temperatures dropping to -5°C in Srinagar and -12°C in Gulmarg require serious cold-weather layering.',
        bullets: [
          'Base Layer: 2-3 sets of high-grade merino wool or synthetic thermal innerwear (top & bottoms).',
          'Mid Layer: Fleece sweaters, cashmere cardigans, or warm wool pullovers.',
          'Outer Layer: Windproof, waterproof down jacket or parka with insulated hood.',
          'Footwear: Waterproof snow boots with aggressive tread. High-ankle socks (wool/merino).',
          'Accessories: Balaclava or fleece beanie, polar fleece gloves, UV polarized sunglasses (essential against blinding snow glare).'
        ]
      },
      {
        title: 'Spring & Autumn (April – May & September – November)',
        description: 'Crisp, sunny days with chilly mornings and brisk evenings (8°C to 22°C).',
        bullets: [
          'Comfortable cotton t-shirts and shirts paired with light jackets or trench coats.',
          'Pashmina shawls, light wool sweaters, and a compact windbreaker.',
          'Sturdy walking shoes or sneakers with comfortable cushioning for heritage walks.'
        ]
      },
      {
        title: 'Summer (June – August)',
        description: 'Pleasant and mild in Srinagar (20°C to 30°C), while higher elevations like Sonmarg and Gulmarg stay cool (12°C to 18°C). Pack breathable cotton clothing plus 1-2 light evening cardigans.'
      },
      {
        title: 'Cultural Etiquette at Holy Shrines & Heritage Sites',
        description: 'When visiting religious shrines like Hazratbal Mosque, Jamia Masjid, Charar-e-Sharief, or Shankaracharya Temple:',
        bullets: [
          'Modest dress is mandatory for both men and women: shoulders and knees must remain covered.',
          'Women should carry a scarf, dupatta, or stole to cover their heads before entering mosque courtyards.',
          'Footwear must be removed before entering inner sanctums. Clean socks are recommended.'
        ]
      }
    ]
  },
  {
    id: 'money-banking',
    navTitle: 'Money & Payments',
    title: 'ATMs, Digital Payments & Cash Requirements',
    subtitle: 'Smooth financial planning for hassle-free shopping and rural valley excursions.',
    icon: 'CreditCard',
    items: [
      {
        title: 'Digital UPI & Card Acceptance',
        description: 'Google Pay, PhonePe, and Paytm UPI are ubiquitous throughout Srinagar city, including high-end handicraft showrooms on Polo View, dining establishments along Boulevard Road, and retail stores.',
        bullets: [
          'Major credit and debit cards (Visa, Mastercard) are accepted in 4-star and 5-star hotels and certified J&K Government Arts Emporiums.',
          'A 2% merchant fee may apply for credit card usage at select heritage shops.'
        ]
      },
      {
        title: 'When & Where Cash is Non-Negotiable',
        description: 'Do not rely entirely on digital payments once traveling beyond Srinagar city limits.',
        bullets: [
          'In remote mountain spots (Doodhpathri, Sinthan Top, Aru Valley), internet connectivity can experience periodic dips, causing UPI transactions to time out.',
          'Pony riders, wooden sledges, Shikara rides, roasted corn vendors, and roadside tea stalls operate almost exclusively on cash currency.',
          'Carry ₹5,000 to ₹10,000 in small denominations (₹100, ₹200, ₹500 notes) per family for daily day-trips.'
        ],
        alert: {
          type: 'info',
          text: 'J&K Bank has the most dense and reliable ATM network across all towns and mountain highways in the valley.'
        }
      }
    ]
  },
  {
    id: 'health-safety',
    navTitle: 'Health & Altitude',
    title: 'High Altitude Health, Weather & Safety Guidelines',
    subtitle: 'Keep your body energized and protected across high mountain passes.',
    icon: 'HeartPulse',
    items: [
      {
        title: 'Altitude Acclimatization at Apharwat & High Passes',
        description: 'While Srinagar sits at a comfortable 5,200 ft, Phase 2 Gulmarg exceeds 13,050 ft and Sinthan Top crosses 12,500 ft. Visitors may experience mild shortness of breath or slight dizziness.',
        bullets: [
          'Drink plenty of fluids: sip warm Kashmiri Kahwa (infused with saffron, cinnamon, and almonds) to stay energized.',
          'Avoid running or rapid ascents immediately upon reaching high gondola stations.',
          'Carry prescribed basic medications (pain relievers, anti-motion sickness tablets, hydration salts).',
          'Seniors and travelers with pre-existing cardiovascular or respiratory conditions should consult their doctor before taking Gondola Phase 2.'
        ]
      },
      {
        title: 'Tourist Safety & Local Hospitality',
        description: 'Kashmiris are globally renowned for "Mehmaan Nawazi" (legendary warmth and hospitality toward guests). Jammu & Kashmir has a dedicated Tourist Police wing stationed at major points (TRC Srinagar, Gulmarg, Pahalgam, Sonmarg) to assist travelers.',
        bullets: [
          'Tourist Police 24/7 Helpline: +91-194-2457956 / 112',
          'Tourism Reception Centre (TRC) Srinagar: +91-194-2502279',
          'Srinagar International Airport Helpdesk: +91-194-2303000'
        ]
      }
    ]
  }
];

export const TRAVEL_FAQS: TravelFaq[] = [
  {
    category: 'Safety',
    question: 'Is Kashmir safe for family vacations, women travelers, and honeymooners?',
    answer: 'Absolutely. Over 2 million tourists visit Kashmir annually with complete peace of mind. Tourist hubs such as Srinagar, Gulmarg, Pahalgam, and Sonmarg are exceptionally peaceful, family-friendly, and hospitable. The local people are deeply welcoming, and tourism infrastructure operates under vigilant state care.'
  },
  {
    category: 'Connectivity',
    question: 'Will my Jio or Airtel prepaid mobile phone work in Kashmir?',
    answer: 'No. Prepaid SIM cards issued anywhere outside Jammu & Kashmir are blocked by government telecom regulations upon entry. Only Postpaid numbers work. If you have a prepaid connection, either convert it to postpaid before traveling or pick up a tourist SIM at Srinagar Airport.'
  },
  {
    category: 'Activities',
    question: 'How many days in advance should I book tickets for the Gulmarg Gondola?',
    answer: 'We strongly recommend booking Gulmarg Gondola Phase 1 and Phase 2 tickets at least 20 to 30 days prior to your travel date on the official J&K Cable Car website (jammukashmircablecar.com), especially between April–June and December–January, as daily ticket quotas sell out very rapidly.'
  },
  {
    category: 'Transport',
    question: 'Why do we need local union cabs in Pahalgam and Gulmarg?',
    answer: 'Local taxi unions exist to distribute tourism revenue fairly to rural mountain drivers. Outside cabs (from Srinagar) are allowed to transport you to your resort or main town, but internal routes (e.g. Aru, Betaab Valley, Chandanwari in Pahalgam, or winter snow chain drives up Tangmarg-Gulmarg) require authorized local union vehicles.'
  },
  {
    category: 'Winter',
    question: 'Can I rent warm snow jackets, waterproof boots, and gloves in Gulmarg?',
    answer: 'Yes! Tangmarg (the town at the base of Gulmarg hill) and Gulmarg itself feature dozens of certified gear rental shops offering warm heavy parkas, waterproof rubber gumboots, gloves, and ski suits at reasonable daily rates (approx. ₹250–₹500 per day).'
  },
  {
    category: 'Payments',
    question: 'Do Google Pay, PhonePe, and credit cards work everywhere in Kashmir?',
    answer: 'UPI and cards work seamlessly across hotels, cafes, and handicraft emporiums in Srinagar. However, once you travel to remote valleys, meadow viewpoints, or hire pony riders and wooden sledges, internet networks may fluctuate. Always maintain ₹5,000–₹10,000 in liquid cash for daily activities.'
  }
];
