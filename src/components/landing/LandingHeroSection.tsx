'use client';

import React from 'react';
import { LandingHeader } from './LandingHeader';
import { LandingEnquiryForm } from './LandingEnquiryForm';

/**
 * LandingHeroSection (Unified Responsive Performance Edition)
 * 
 * - Single React component tree across mobile, tablet, and desktop
 * - Server-preloaded Playfair Display font (eliminates client font render delay)
 * - Responsive <picture> delivering 78KB WebP on mobile vs 250KB on desktop
 * - fetchPriority="high" for instant LCP discovery
 * - Eliminates duplicate headers, forms, timers, and DOM nodes
 */
const BG_DESKTOP = 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto:good,w_1600/v1791799153/bg.jpg';
const BG_MOBILE = 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto:eco,w_750/v1791799153/bg.jpg';

export const LandingHeroSection: React.FC = () => {
  return (
    <div className="relative w-full landing-hero-container flex flex-col overflow-hidden text-white bg-transparent">
      {/* Full-bleed responsive background image (Optimized Cloudinary delivery) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <picture>
          <source media="(max-width: 768px)" srcSet={BG_MOBILE} />
          <img
            src={BG_DESKTOP}
            alt="Kashmir Valley Luxury Travel"
            className="landing-hero-bg-img"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1600}
            height={900}
          />
        </picture>
        {/* Subtle mobile darkening overlay for contrast without blue tint */}
        <div className="lg:hidden absolute inset-0 bg-black/25 pointer-events-none" />
      </div>

      {/* Top Header & Offer Banner */}
      <LandingHeader />

      {/* Main Hero Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1 sm:py-2 lg:py-4 flex flex-col justify-between lg:justify-center overflow-hidden">
        <div className="flex flex-col justify-between h-full lg:h-auto lg:grid lg:grid-cols-12 lg:gap-10 lg:items-center my-auto w-full">
          {/* Headline Column */}
          <div className="w-full pt-1.5 min-[370px]:pt-2 sm:pt-4 lg:pt-0 lg:col-span-7 flex flex-col justify-center text-center lg:text-left px-2 lg:px-0">
            <h1
              className="font-playfair text-[21px] min-[360px]:text-[23px] sm:text-[26px] lg:text-5xl font-black lg:font-bold text-white leading-snug lg:leading-tight tracking-tight drop-shadow-[0_3px_14px_rgba(0,0,0,0.98)] lg:drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)]"
            >
              A Kashmir trip that <br />
              feels like{' '}
              <span className="text-[#E6B84A] underline decoration-[#E6B84A]/50 lg:decoration-[#E6B84A]/40 underline-offset-4 lg:underline-offset-6 font-black lg:font-bold">
                yours.
              </span>
            </h1>
          </div>

          {/* Lead Form Column */}
          <div className="w-full lg:col-span-5 flex justify-end sm:justify-center lg:justify-end items-end shrink-0 pr-1 sm:pr-0 pb-1 sm:pb-2 lg:pb-0">
            <LandingEnquiryForm source="ads_tourpackageskashmir" />
          </div>
        </div>
      </main>
    </div>
  );
};
