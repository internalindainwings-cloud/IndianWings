import { Metadata } from 'next';
import TravelInfoHero from '@/components/travel-info/TravelInfoHero';
import TravelInfoSubNav from '@/components/travel-info/TravelInfoSubNav';
import TravelInfoQuickTips from '@/components/travel-info/TravelInfoQuickTips';
import TravelInfoDetailedSections from '@/components/travel-info/TravelInfoDetailedSections';
import TravelInfoFaqAccordion from '@/components/travel-info/TravelInfoFaqAccordion';
import TravelInfoCta from '@/components/travel-info/TravelInfoCta';

export const metadata: Metadata = {
  title: 'Kashmir Travel Information & Guidelines | The Indian Wings Company',
  description: 'Essential Kashmir travel guide: Postpaid SIM regulations, Srinagar airport security timeline, local union taxi guidelines, Gulmarg Gondola booking rules, and high-altitude packing checklist.',
  keywords: [
    'Kashmir travel information',
    'Kashmir SIM card postpaid rule',
    'Srinagar airport guidelines',
    'Pahalgam union taxi system',
    'Gulmarg Gondola booking advance',
    'Kashmir packing list winter summer',
    'Is Kashmir safe for tourists',
    'The Indian Wings Company Kashmir guide'
  ],
  openGraph: {
    title: 'Essential Kashmir Travel Information & Guide | The Indian Wings Company',
    description: 'Expert local advice for travelers visiting Kashmir. Guidelines on SIM cards, internal transport, weather packing, and safety.',
    images: ['/images/gallery/shikara-dal-lake.jpg'],
  },
  alternates: {
    canonical: '/bucket-list/travel-information',
  },
};

export default function TravelInformationPage() {
  return (
    <main className="w-full min-h-screen bg-background text-[#222222] flex flex-col">
      {/* 1. Hero Header */}
      <TravelInfoHero />

      {/* 2. Sticky Sub Navigation */}
      <TravelInfoSubNav />

      {/* 3. 6 Golden Rules / At a Glance */}
      <TravelInfoQuickTips />

      {/* 4. Comprehensive Deep Travel Sections */}
      <TravelInfoDetailedSections />

      {/* 5. FAQs Accordion */}
      <TravelInfoFaqAccordion />

      {/* 6. Expert Travel Assistance CTA */}
      <TravelInfoCta />
    </main>
  );
}
