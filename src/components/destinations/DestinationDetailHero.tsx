'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { DestinationItem } from '@/data/destinations';
import { DestinationBreadcrumb } from './DestinationBreadcrumb';
import { HeroActionBar } from '../trust/HeroActionBar';

interface DestinationDetailHeroProps {
  destination: DestinationItem;
}

const AUTOPLAY_INTERVAL_MS = 5000;

export const DestinationDetailHero: React.FC<DestinationDetailHeroProps> = ({ destination }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const images = destination.gallery && destination.gallery.length > 0 
    ? destination.gallery 
    : [destination.imageUrl];

  const totalImages = images.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL_MS);
  }, [nextSlide]);

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, startTimer]);

  return (
    <section 
      className="relative w-screen max-w-full h-[calc(100dvh-115px)] sm:h-[calc(100dvh-110px)] min-h-[435px] max-h-[545px] min-[1140px]:h-[calc(100dvh-150px)] min-[1140px]:min-h-[465px] min-[1140px]:max-h-[575px] bg-midnight text-warm-white overflow-hidden pt-12 sm:pt-14 md:pt-16 flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label={`${destination.name} hero showcase`}
    >
      {/* 1. Full-Bleed Cinematic Background Slideshow with Smooth Crossfade Animation */}
      <div className="absolute inset-0 z-0">
        {images.map((imgSrc, idx) => (
          <div
            key={imgSrc}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={imgSrc}
              alt={`${destination.name} view ${idx + 1}`}
              fill
              priority={idx === 0}
              className="object-cover scale-100"
              sizes="100vw"
            />
          </div>
        ))}

        {/* Very light, natural scrim keeping photo vibrant and clear */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
      </div>

      {/* 2. Main Content Container - Left 50% — shifted slightly above */}
      <div className="flex-1 flex flex-col relative z-20 w-full justify-center min-h-0 pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 -translate-y-2 sm:-translate-y-3">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 w-full flex flex-col items-start text-left">
          <div className="w-full lg:w-1/2 max-w-xl flex flex-col items-start text-left">
            {/* Breadcrumb Trail */}
            <div className="mb-2.5 sm:mb-3">
              <DestinationBreadcrumb destinationName={destination.name} region={destination.region} />
            </div>

            {/* Main Destination Heading - Exactly One Line */}
            <h1 className="font-display text-[19px] min-[360px]:text-[21px] min-[400px]:text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[44px] text-saffron leading-tight tracking-tight whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-3 sm:mb-4">
              Explore {destination.name}
            </h1>

            {/* Action Buttons: Small size directly here */}
            <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <a
                href="#attractions"
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-saffron text-midnight font-manrope font-bold text-xs shadow-md hover:shadow-saffron/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Explore Highlights</span>
                <span aria-hidden="true">&darr;</span>
              </a>
              <a
                href="#packages"
                className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-warm-white border border-white/20 backdrop-blur-md font-manrope font-semibold text-xs transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>View Packages</span>
                <span aria-hidden="true">&rarr;</span>
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

export default DestinationDetailHero;
