import type { Metadata } from 'next';
import { LandingHeroSection } from '@/components/landing/LandingHeroSection';
import { LandingPackagesSection } from '@/components/landing/LandingPackagesSection';
import { LandingTrustStrip } from '@/components/landing/LandingTrustStrip';
import { LandingFinalCta } from '@/components/landing/LandingFinalCta';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingWhatsAppButton } from '@/components/landing/LandingWhatsAppButton';
import { LandingExitIntentModal } from '@/components/landing/LandingExitIntentModal';
import { getAllPackages } from '@/lib/packages-service';

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
  const packages = await getAllPackages(false);

  return (
    <>
      <LandingHeroSection />
      <LandingPackagesSection packages={packages} />
      <LandingTrustStrip />
      <LandingFinalCta />
      <LandingFooter />
      <LandingWhatsAppButton />
      <LandingExitIntentModal />
    </>
  );
}

