'use client';

import React from 'react';
import { Playfair_Display } from 'next/font/google';
import { LandingHeader } from './LandingHeader';
import { LandingEnquiryForm } from './LandingEnquiryForm';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

/**
 * LandingHeroSection
 * 
 * - Top Offer Banner with the Windows light beam progress animation
 * - Desktop navbar: Home, Tour Packages, About
 * - Background Image with dark luxury indigo overlay (no moving light bars on main hero)
 * - Exact headline: "A Kashmir trip that feels like yours." ("yours." in #E6B84A warm gold)
 * - Compact ("chota") lead enquiry form card
 */
const BG_IMAGE_URL = 'https://res.cloudinary.com/wmwdypan/image/upload/v1791799153/bg.jpg';

export const LandingHeroSection: React.FC = () => {
  return (
    <>
      {/* ── DESKTOP VIEWPORT (lg:): Keep Exact Original Layout with Stable Viewport ── */}
      <div className="hidden lg:flex relative w-full landing-hero-container flex-col bg-transparent overflow-hidden">
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={BG_IMAGE_URL}
            alt="Kashmir Valley Luxury Travel"
            className="landing-hero-bg-img"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Top Header */}
        <LandingHeader />

        {/* Main Content (2-Column Original Position) */}
        <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-4 flex flex-col justify-center overflow-hidden">
          <div className="grid grid-cols-12 gap-10 items-center my-auto w-full">
            {/* Left Column: Headline */}
            <div className="col-span-7 flex flex-col justify-center text-left py-2">
              <h1
                className={`${playfair.className} text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)]`}
              >
                A Kashmir trip that <br />
                feels like{' '}
                <span className="text-[#E6B84A] underline decoration-[#E6B84A]/40 underline-offset-6">
                  yours.
                </span>
              </h1>
            </div>

            {/* Right Column: Lead Form */}
            <div className="col-span-5 w-full flex justify-end">
              <LandingEnquiryForm source="ads_tourpackageskashmir" />
            </div>
          </div>
        </main>
      </div>

      {/* ── MOBILE / TABLET VIEWPORT (<lg): Full-Screen Photo with Stable Viewport & Bottom Form Overlay ── */}
      <div className="flex lg:hidden relative w-full landing-hero-container flex-col overflow-hidden text-white">
        {/* Full-bleed background image covering entire mobile screen (no blue cut-off, no blue gradient) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={BG_IMAGE_URL}
            alt="Kashmir Valley Luxury Travel"
            className="landing-hero-bg-img"
            loading="eager"
            decoding="async"
          />
          {/* Subtle neutral darkening for contrast so text pops without any blue tint */}
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        </div>

        {/* Top Header */}
        <LandingHeader />

        {/* Main Content Area (Fits completely within 100dvh without scrolling) */}
        <main className="relative z-10 flex-1 w-full px-3 py-1 sm:py-2 flex flex-col justify-between overflow-hidden">
          {/* Centered Headline at top center (as placed in screenshot "Write here in centre") */}
          <div className="w-full pt-1.5 min-[370px]:pt-2 sm:pt-4 flex flex-col justify-center items-center text-center px-2">
            <h1
              className={`${playfair.className} text-[21px] min-[360px]:text-[23px] sm:text-[26px] font-black text-white leading-snug tracking-tight drop-shadow-[0_3px_14px_rgba(0,0,0,0.98)] text-center`}
            >
              A Kashmir trip that <br />
              feels like{' '}
              <span className="text-[#E6B84A] underline decoration-[#E6B84A]/50 underline-offset-4 font-black">
                yours.
              </span>
            </h1>
          </div>

          {/* Lead Form: Shifted to the Right Hand Side below headline */}
          <div className="w-full flex justify-end sm:justify-center items-end pr-1 sm:pr-0 pb-1 sm:pb-2 shrink-0">
            <LandingEnquiryForm source="ads_tourpackageskashmir" />
          </div>
        </main>
      </div>
    </>
  );
};
