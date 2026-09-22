import { Metadata } from "next";
import { headers } from "next/headers";
import nextDynamic from "next/dynamic";
import { HeroSection } from "@/components/hero/HeroSection";
import { getHeroConfig } from "@/lib/hero-service";
import { LeadFormSection } from "@/components/forms/LeadFormSection";
import WhyTravelWithUsSection from "@/components/trust/WhyTravelWithUsSection";
const PackagesSection = nextDynamic(() => import('@/components/packages/PackagesSection').then((m) => ({ default: m.PackagesSection })));
const SeasonalPackagesSection = nextDynamic(() => import('@/components/packages/SeasonalPackagesSection').then((m) => ({ default: m.SeasonalPackagesSection })));
const OffBeatPackagesSection = nextDynamic(() => import('@/components/packages/OffBeatPackagesSection').then((m) => ({ default: m.OffBeatPackagesSection })));
import { DestinationsSection } from "@/components/destinations/DestinationsSection";
import { BrandsSection } from "@/components/brands/BrandsSection";
import { FounderMessage } from "@/components/team/FounderMessage";
import { getAllPackages } from "@/lib/packages-service";
import { getAllDestinations } from "@/lib/destinations-service";
import { safeJsonLd } from "@/lib/utilities/safe-json-ld";
import { optimizeCloudinaryUrl } from "@/lib/utilities/cloudinary";

const HomeGallerySection = nextDynamic(
  () => import('@/components/gallery/HomeGallerySection').then((m) => ({ default: m.HomeGallerySection })),
  {
    loading: () => (
      <section
        id="gallery"
        aria-label="Kashmir Photo &amp; Video Gallery"
        className="w-full bg-[#FAF9F5] py-12 sm:py-16 lg:py-20 border-t border-black/8 min-h-[480px]"
      />
    ),
  }
);


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tourpackageskashmir.com';

import { getSiteSettings } from '@/lib/settings-service';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const heroImage = settings.heroImageUrl || 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png';

  return {
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
          url: heroImage,
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
      images: [heroImage],
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [heroConfig, allPackages, allDestinations, headersList, settings] = await Promise.all([
    getHeroConfig(),
    getAllPackages(false),
    getAllDestinations(false),
    headers(),
    getSiteSettings()
  ]);

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TravelAgency',
        '@id': `${siteUrl}/#organization`,
        name: 'The Indian Wings Company',
        url: siteUrl,
        logo: settings.logoUrl || `${siteUrl}https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png`,
        description: 'Premier travel agency specializing in handcrafted Kashmir holiday itineraries, verified houseboat stays, and private mountain transport.',
        telephone: settings.phone || '+919811808387',
        email: settings.email || 'info@theindianwingscompany.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address || 'Sheikh Palace, 2nd Floor, Kanyar Chowk',
          addressLocality: 'Srinagar',
          addressRegion: 'Jammu & Kashmir',
          postalCode: '190003',
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
  const nonce = headersList.get('x-nonce') ?? undefined;

  // 1. Featured Packages: Dynamically driven by admin isFeatured toggle (falls back to Classic packages if none selected)
  const explicitFeatured = allPackages.filter((p) => p.isFeatured && p.isActive);
  const featuredPackages = explicitFeatured.length > 0
    ? explicitFeatured
    : allPackages.filter((p) => p.categorySlug === 'featured' && p.isActive);
  const seasonalPackages = allPackages.filter((p) => p.categorySlug === 'seasonal' && p.isActive);
  const offBeatPackages = allPackages.filter((p) => p.categorySlug === 'offbeat' && p.isActive);

  // Derive active Slide 0 LCP image URLs for server-side responsive preload
  const firstSlide = heroConfig.slides?.[0];
  const rawDesktop = (firstSlide?.videoSrc && firstSlide.videoSrc.trim().length > 0)
    ? firstSlide.videoSrc.trim()
    : (firstSlide?.poster && firstSlide.poster.trim().length > 0)
    ? firstSlide.poster.trim()
    : (heroConfig.videoUrl || heroConfig.posterUrl || 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png');
  const rawMobile = (firstSlide?.mobilePoster && firstSlide.mobilePoster.trim().length > 0)
    ? firstSlide.mobilePoster.trim()
    : (firstSlide?.mobileVideoSrc && firstSlide.mobileVideoSrc.trim().length > 0)
    ? firstSlide.mobileVideoSrc.trim()
    : rawDesktop;

  const desktopLcpUrl = optimizeCloudinaryUrl(rawDesktop);
  const mobileLcpUrl = optimizeCloudinaryUrl(rawMobile);
  const isLcpImage = desktopLcpUrl.includes('/image/upload/') || /\.(jpeg|jpg|png|webp|avif)$/i.test(desktopLcpUrl);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: safeJsonLd(homeJsonLd) }}
      />

      {/* Preload active Hero LCP image with responsive media queries matching the <picture> srcset */}
      {isLcpImage && (
        <>
          <link
            rel="preload"
            as="image"
            media="(min-width: 768px)"
            href={desktopLcpUrl}
            fetchPriority="high"
          />
          <link
            rel="preload"
            as="image"
            media="(max-width: 767px)"
            href={mobileLcpUrl}
            fetchPriority="high"
          />
        </>
      )}

      <HeroSection heroConfig={heroConfig} />
      <LeadFormSection />
      <WhyTravelWithUsSection />
      
      {/* 1. Featured Packages */}
      <PackagesSection initialPackages={featuredPackages} />

      {/* 2. Seasonal Packages */}
      <SeasonalPackagesSection initialPackages={seasonalPackages} />

      {/* 3. Off Beat Packages */}
      <OffBeatPackagesSection initialPackages={offBeatPackages} />

      {/* 4. Featured Destinations */}
      <DestinationsSection initialDestinations={allDestinations} />

      {/* 5. Trusted Partners Marquee Bar (Compact, No Giant Heading) */}
      <BrandsSection />

      {/* 6. Curated Media Gallery (Images & Videos) */}
      <HomeGallerySection />

      {/* 7. Founder's Message — Mrs. Komal */}
      <FounderMessage />
    </main>
  );
}
