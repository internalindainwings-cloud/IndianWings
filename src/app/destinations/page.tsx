import { Metadata } from 'next';
import DestinationsPageHero from '@/components/destinations/DestinationsPageHero';
import DestinationsPageGrid from '@/components/destinations/DestinationsPageGrid';
import DestinationsCta from '@/components/destinations/DestinationsCta';
import { getAllDestinations } from '@/lib/destinations-service';
import { getPageHeroById } from '@/lib/page-heroes-service';

export const metadata: Metadata = {
  title: 'Kashmir Destinations & Travel Guide | The Indian Wings Company',
  description: 'Explore breathtaking Kashmir destinations: Srinagar, Gulmarg, Pahalgam, Sonmarg, Doodhpathri, and Gurez Valley. Authentic travel guides, seasons, and itineraries.',
  keywords: [
    'Kashmir destinations list',
    'Best places to visit in Kashmir',
    'Srinagar tourist places',
    'Gulmarg travel guide',
    'Pahalgam valley trip',
    'Sonmarg Thajiwas glacier',
    'Doodhpathri offbeat Kashmir',
    'The Indian Wings Company destinations'
  ],
  openGraph: {
    title: 'Explore Kashmir Destinations | The Indian Wings Company',
    description: 'Iconic valleys, snow-capped alpine meadows, and offbeat wonders across Kashmir.',
    images: ['https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789975327/dest_hero.jpg'],
  },
  alternates: {
    canonical: '/destinations',
  },
};

export const dynamic = 'force-dynamic';

export default async function DestinationsPage() {
  const [allDestinations, hero] = await Promise.all([
    getAllDestinations(false),
    getPageHeroById('destinations')
  ]);

  return (
    <main className="w-full min-h-screen bg-background text-charcoal flex flex-col">
      {/* 1. Hero Header */}
      <DestinationsPageHero initialHero={hero} />

      {/* 2. Filterable Destinations Grid */}
      <DestinationsPageGrid initialDestinations={allDestinations} />

      {/* 3. Personalized Valley Curation CTA */}
      <DestinationsCta />
    </main>
  );
}
