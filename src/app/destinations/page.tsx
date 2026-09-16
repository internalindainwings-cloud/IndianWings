import { Metadata } from 'next';
import DestinationsPageHero from '@/components/destinations/DestinationsPageHero';
import DestinationsPageGrid from '@/components/destinations/DestinationsPageGrid';
import DestinationsCta from '@/components/destinations/DestinationsCta';

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
    images: ['/images/gallery/shikara-dal-lake.jpg'],
  },
  alternates: {
    canonical: '/destinations',
  },
};

export default function DestinationsPage() {
  return (
    <main className="w-full min-h-screen bg-background text-charcoal flex flex-col">
      {/* 1. Hero Header */}
      <DestinationsPageHero />

      {/* 2. Filterable Destinations Grid */}
      <DestinationsPageGrid />

      {/* 3. Personalized Valley Curation CTA */}
      <DestinationsCta />
    </main>
  );
}
