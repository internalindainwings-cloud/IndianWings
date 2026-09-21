'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import { HeroActionBar } from '../trust/HeroActionBar';
import type { PageHeroConfig } from '@/lib/page-heroes-constants';
import { DEFAULT_PAGE_HEROES } from '@/lib/page-heroes-constants';

interface DestinationsPageHeroProps {
  initialHero?: PageHeroConfig;
}

export const DestinationsPageHero: React.FC<DestinationsPageHeroProps> = ({ initialHero }) => {
  const { openModal } = useEnquiryModal();
  const [hero, setHero] = useState<PageHeroConfig>(initialHero || DEFAULT_PAGE_HEROES.destinations);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/page-heroes/destinations')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.hero) {
          setHero(data.hero);
        }
      })
      .catch((err) => console.warn('Could not load destinations hero config:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  const desktopImg = hero.desktopImageUrl || 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789975327/dest_hero.jpg';
  const mobileImg = hero.mobileImageUrl || desktopImg;

  const isUnoptimized = (url: string) => {
    if (!url || url.startsWith('/')) return false;
    return !url.includes('cloudinary.com') && !url.includes('unsplash.com');
  };

  return (
    <section className="relative w-screen max-w-full h-[calc(100dvh-115px)] sm:h-[calc(100dvh-110px)] min-h-[435px] max-h-[545px] min-[1140px]:h-[calc(100dvh-150px)] min-[1140px]:min-h-[465px] min-[1140px]:max-h-[575px] flex flex-col justify-between overflow-hidden bg-midnight">
      {/* 1. Background Image (Separate Desktop & Mobile handling for perfect display on all screens) */}
      <div className="absolute inset-0 z-0">
        {/* Desktop Image View */}
        <div className="hidden md:block absolute inset-0 w-full h-full">
          <Image
            src={desktopImg}
            alt="Kashmir Valley Destinations"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
            sizes="100vw"
            unoptimized={isUnoptimized(desktopImg)}
          />
        </div>

        {/* Mobile Image View */}
        <div className="block md:hidden absolute inset-0 w-full h-full">
          <Image
            src={mobileImg}
            alt="Kashmir Valley Destinations"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            unoptimized={isUnoptimized(mobileImg)}
          />
        </div>

        {/* Very light, natural horizontal scrim keeping photo vibrant and clear */}
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-midnight/40 via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />
      </div>

      {/* 2. Hero Content Container - Left 50% of Viewport — shifted slightly above */}
      <div className="flex-1 flex flex-col relative z-10 w-full justify-center min-h-0 pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 -translate-y-2 sm:-translate-y-3">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 w-full flex flex-col items-start text-left">
          <div className="w-full lg:w-1/2 max-w-xl flex flex-col items-start text-left">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-2.5 sm:mb-3">
              <ol className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-manrope text-warm-white/70">
                <li>
                  <Link href="/" className="hover:text-warm-white transition-colors">
                    Home
                  </Link>
                </li>
                <ChevronRight size={12} className="text-warm-white/40 shrink-0" />
                <li>
                  <span className="text-saffron font-semibold">Destinations</span>
                </li>
              </ol>
            </nav>

            {/* Major Heading */}
            <h1 className="font-display text-[19px] min-[360px]:text-[21px] min-[400px]:text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[44px] text-saffron leading-tight tracking-tight whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-3 sm:mb-4">
              {hero.heading || 'Explore Iconic Kashmir'}
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={openModal}
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-saffron text-midnight font-manrope font-bold text-xs shadow-md hover:shadow-saffron/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Plan Custom Itinerary</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
              <a
                href="#destinations-grid"
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-warm-white border border-white/20 backdrop-blur-md font-manrope font-semibold text-xs transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Browse All Valleys</span>
                <span aria-hidden="true">&darr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hero Bottom Action Bar - Docked right at bottom edge */}
      <div className="relative z-20 w-full shrink-0">
        <HeroActionBar />
      </div>
    </section>
  );
};

export default DestinationsPageHero;
