import { Metadata } from 'next';
import ActivitiesHero from '@/components/activities/ActivitiesHero';
import ActivityCardsGrid from '@/components/activities/ActivityCardsGrid';
import ActivitiesSafetyPillars from '@/components/activities/ActivitiesSafetyPillars';
import ActivitiesFaq from '@/components/activities/ActivitiesFaq';
import ActivitiesCta from '@/components/activities/ActivitiesCta';

export const metadata: Metadata = {
  title: 'Kashmir Adventure Activities & Sports | The Indian Wings Company',
  description: 'Book thrilling Kashmir adventures: Gulmarg skiing & snowmobile, Pahalgam white water rafting, Srinagar tandem paragliding, and ATV quad biking with certified instructors.',
  keywords: [
    'Gulmarg skiing lessons booking',
    'Pahalgam white water rafting Lidder',
    'Paragliding in Srinagar Astanmarg',
    'Gulmarg snowmobile price',
    'ATV quad biking Kashmir',
    'Kashmir adventure tour packages',
    'The Indian Wings Company activities'
  ],
  openGraph: {
    title: 'Kashmir Adventure Activities & Expeditions | The Indian Wings Company',
    description: 'Certified instructors, international safety gear, and mountain thrills across Gulmarg, Pahalgam, and Srinagar.',
    images: ['/images/gallery/gulmarg-snow.jpg'],
  },
  alternates: {
    canonical: '/activities',
  },
};

export default function ActivitiesPage() {
  return (
    <main className="w-full min-h-screen bg-background text-[#222222] flex flex-col">
      {/* 1. Hero */}
      <ActivitiesHero />

      {/* 2. Activities Grid (Sleek, Minimal Cards with Category Filter) */}
      <ActivityCardsGrid />

      {/* 3. Safety & Equipment Pillars */}
      <ActivitiesSafetyPillars />

      {/* 4. FAQs */}
      <ActivitiesFaq />

      {/* 5. Custom Adventure Itinerary CTA */}
      <ActivitiesCta />
    </main>
  );
}
