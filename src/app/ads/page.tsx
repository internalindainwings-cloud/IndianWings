import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { LandingHeroSection } from '@/components/landing/LandingHeroSection';
import { LandingPackagesSection } from '@/components/landing/LandingPackagesSection';
import { cleanPackageTitle, DEFAULT_PACKAGE_OPTIONS } from '@/lib/utilities/package-title';
import { LandingTrustStrip } from '@/components/landing/LandingTrustStrip';
import { LandingFinalCta } from '@/components/landing/LandingFinalCta';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingWhatsAppButton } from '@/components/landing/LandingWhatsAppButton';
import { getAllPackages } from '@/lib/packages-service';

// Non-critical interactive modal: code-split out of the initial critical JavaScript bundle
const LandingExitIntentModal = dynamic(
  () => import('@/components/landing/LandingExitIntentModal').then((mod) => mod.LandingExitIntentModal)
);

export const metadata: Metadata = {
  title: 'A Kashmir Trip That Feels Like Yours | The Indian Wings Company',
  description: 'Handcrafted Kashmir holiday packages, verified luxury stays, and private transfers with The Indian Wings Company.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://adds.tourpackageskashmir.com/',
  },
};

export default async function AdsLandingPage() {
  let packages: any[] = [];
  try {
    packages = await getAllPackages(false);
  } catch (err) {
    console.error('Failed to fetch packages for ads page:', err);
  }

  // Extract clean package titles matching the packages displayed on the page
  const packageTitles: string[] = [];
  if (packages && Array.isArray(packages) && packages.length > 0) {
    packages.forEach((pkg) => {
      const clean = cleanPackageTitle(pkg.title);
      if (clean && !packageTitles.includes(clean)) {
        packageTitles.push(clean);
      }
    });
  }
  if (packageTitles.length === 0) {
    packageTitles.push(...DEFAULT_PACKAGE_OPTIONS);
  } else if (!packageTitles.includes('Customized Itinerary')) {
    packageTitles.push('Customized Itinerary');
  }

  return (
    <>
      {/* High-priority responsive image preloads hoisted to document head for instant LCP discovery */}
      <link
        rel="preload"
        as="image"
        href="https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto:eco,w_750/v1791799153/bg.jpg"
        media="(max-width: 768px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto:good,w_1600/v1791799153/bg.jpg"
        media="(min-width: 769px)"
        fetchPriority="high"
      />

      <LandingHeroSection packageOptions={packageTitles} />
      <LandingPackagesSection packages={packages} />
      <LandingTrustStrip />
      <LandingFinalCta />
      <LandingFooter />
      <LandingWhatsAppButton />
      <LandingExitIntentModal packageOptions={packageTitles} />
    </>
  );
}

