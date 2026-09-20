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

// All adventure activities are loaded dynamically from the database.
export const ADVENTURE_ACTIVITIES: AdventureActivityItem[] = [];


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
