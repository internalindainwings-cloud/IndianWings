import { Metadata } from 'next';
import TransportHero from '@/components/transport/TransportHero';
import VehicleFleetGrid from '@/components/transport/VehicleFleetGrid';
import TransportTrustBadges from '@/components/transport/TransportTrustBadges';
import TransportFaq from '@/components/transport/TransportFaq';
import TransportCta from '@/components/transport/TransportCta';
import { getPageHeroById } from '@/lib/page-heroes-service';
import { getAllVehicles } from '@/lib/transport-service';

export const metadata: Metadata = {
  title: 'Jammu, Katra, Srinagar & Udhampur Cabs & Car Rental | The Indian Wings Company',
  description: 'Private chauffeur-driven cabs across Jammu, Katra, Srinagar & Udhampur. Book Toyota Innova Crysta, Maruti Swift, Fortuner 4x4, and Tempo Travellers with 100% all-inclusive pricing.',
  keywords: [
    'Jammu to Srinagar taxi',
    'Katra to Srinagar cab service',
    'Udhampur to Srinagar Vande Bharat cab',
    'Srinagar airport car rental',
    'Innova Crysta rental Kashmir',
    'Swift taxi Jammu Katra Srinagar',
    'Tempo Traveller rental Srinagar Jammu',
    'The Indian Wings Company Transport'
  ],
  openGraph: {
    title: 'Private Cabs & Fleet Across Jammu, Katra, Srinagar & Udhampur | The Indian Wings Company',
    description: 'Verified mountain drivers, modern sanitized vehicles, and transparent 100% all-inclusive billing covering all NH44 highway tolls, border taxes, and fuel.',
    images: ['/images/gallery/pahalgam-valley.jpg'],
  },
  alternates: {
    canonical: '/transport',
  },
};

export const dynamic = 'force-dynamic';

export default async function TransportPage() {
  const [hero, vehicles] = await Promise.all([
    getPageHeroById('transport'),
    getAllVehicles(false)
  ]);

  return (
    <main className="w-full min-h-screen bg-background text-charcoal flex flex-col">
      {/* 1. Hero Section */}
      <TransportHero initialHero={hero} />

      {/* 2. Our Luxury Fleet (1 verified card per category) */}
      <VehicleFleetGrid initialVehicles={vehicles} />

      {/* 4. Trust Pillars & Assurances */}
      <TransportTrustBadges />

      {/* 5. FAQs */}
      <TransportFaq />

      {/* 6. Custom Itinerary CTA */}
      <TransportCta />
    </main>
  );
}
