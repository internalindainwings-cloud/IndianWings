import { Metadata } from 'next';
import PackagesPageHero from '@/components/packages/PackagesPageHero';
import PackagesSubNav from '@/components/packages/PackagesSubNav';
import PackagesSection from '@/components/packages/PackagesSection';
import SeasonalPackagesSection from '@/components/packages/SeasonalPackagesSection';
import OffBeatPackagesSection from '@/components/packages/OffBeatPackagesSection';
import PackagesCta from '@/components/packages/PackagesCta';

export const metadata: Metadata = {
  title: 'Kashmir Tour Packages & Holiday Itineraries | The Indian Wings Company',
  description: 'Book customized Kashmir holiday tour packages: 5D/4N, 6D/5N, 7D/6N itineraries. Luxury houseboats, Gulmarg skiing, Pahalgam valleys, and offbeat Gurez expeditions.',
  keywords: [
    'Kashmir tour packages',
    'Kashmir honeymoon package',
    'Gulmarg winter tour package',
    'Kashmir 6 days 5 nights itinerary',
    'Offbeat Kashmir tour packages',
    'The Indian Wings Company packages'
  ],
  openGraph: {
    title: 'Curated Kashmir Tour Packages | The Indian Wings Company',
    description: 'All-inclusive itineraries with premium stays, private sanitized transport, Dal Lake Shikara cruises, and 24/7 ground assistance.',
    images: ['/images/gallery/pahalgam-valley.jpg'],
  },
  alternates: {
    canonical: '/packages',
  },
};

export default function PackagesPage() {
  return (
    <main className="w-full min-h-screen bg-background text-charcoal flex flex-col">
      {/* 1. Hero Header */}
      <PackagesPageHero />

      {/* 2. Sub-Nav to jump between categories */}
      <PackagesSubNav />

      {/* 3. Featured Packages */}
      <div id="featured" className="scroll-mt-28">
        <PackagesSection />
      </div>

      {/* 4. Seasonal Specials */}
      <div id="seasonal" className="scroll-mt-28">
        <SeasonalPackagesSection />
      </div>

      {/* 5. Off-Beat Itineraries */}
      <div id="off-beat" className="scroll-mt-28">
        <OffBeatPackagesSection />
      </div>

      {/* 6. Customization CTA */}
      <PackagesCta />
    </main>
  );
}
