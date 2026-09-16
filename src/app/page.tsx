import { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { getHeroConfig } from "@/lib/hero-service";
import { LeadFormSection } from "@/components/forms/LeadFormSection";
import WhyTravelWithUsSection from "@/components/trust/WhyTravelWithUsSection";
import { PackagesSection } from "@/components/packages/PackagesSection";
import { SeasonalPackagesSection } from "@/components/packages/SeasonalPackagesSection";
import { OffBeatPackagesSection } from "@/components/packages/OffBeatPackagesSection";
import { DestinationsSection } from "@/components/destinations/DestinationsSection";
import { BrandsSection } from "@/components/brands/BrandsSection";
import { FounderMessage } from "@/components/team/FounderMessage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theindianwings.com';

export const metadata: Metadata = {
  title: 'The Indian Wings Company | Premium Kashmir Tour Packages & Holidays',
  description: 'Book customized Kashmir holiday packages with local valley experts. Srinagar houseboats, Gulmarg gondola tours, Pahalgam valleys, private transport, and 24/7 on-ground assistance.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'The Indian Wings Company | Premium Kashmir Tour Packages & Holidays',
    description: 'Book customized Kashmir holiday packages with local valley experts. Srinagar houseboats, Gulmarg skiing, Pahalgam valleys, and private sanitized transport.',
    url: siteUrl,
    siteName: 'The Indian Wings Company',
    images: [
      {
        url: '/assets/hero.png',
        width: 1200,
        height: 630,
        alt: 'The Indian Wings Company - Handcrafted Kashmir Holidays',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Indian Wings Company | Premium Kashmir Tour Packages',
    description: 'Customized Kashmir tour packages, verified luxury houseboats, and private cabs.',
    images: ['/assets/hero.png'],
  },
};

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TravelAgency',
      '@id': `${siteUrl}/#organization`,
      name: 'The Indian Wings Company',
      url: siteUrl,
      logo: `${siteUrl}/assets/client_logo.png`,
      description: 'Premier travel agency specializing in handcrafted Kashmir holiday itineraries, verified houseboat stays, and private mountain transport.',
      telephone: '+919906000000',
      email: 'info@theindianwingscompany.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Boulevard Road, Dal Lake',
        addressLocality: 'Srinagar',
        addressRegion: 'Jammu & Kashmir',
        postalCode: '190001',
        addressCountry: 'IN',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'The Indian Wings Company',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
    },
  ],
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  const heroConfig = await getHeroConfig();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      <HeroSection heroConfig={heroConfig} />
      <LeadFormSection />
      <WhyTravelWithUsSection />
      
      {/* 1. Featured Packages */}
      <PackagesSection />

      {/* 2. Seasonal Packages */}
      <SeasonalPackagesSection />

      {/* 3. Off Beat Packages */}
      <OffBeatPackagesSection />

      {/* 4. Featured Destinations */}
      <DestinationsSection />

      {/* 5. Trusted Partners Marquee Bar (Compact, No Giant Heading) */}
      <BrandsSection />

      {/* 6. Founder's Message — Mrs. Komal */}
      <FounderMessage />
    </main>
  );
}
