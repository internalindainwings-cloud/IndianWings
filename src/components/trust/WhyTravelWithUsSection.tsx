import React from 'react';
import ClientStories from './ClientStories';

export default function WhyTravelWithUsSection() {
  return (
    <section className="bg-white w-full overflow-hidden pt-5 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 relative border-b border-black/[0.08]">
      {/* Main Content Container */}
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Client Stories Toggle + Video/Written Carousel */}
        <ClientStories />

        {/* Brand Tagline Item (No image, tight spacing) */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center justify-center text-center">
          <div className="font-manrope text-xs sm:text-sm font-bold tracking-[0.25em] text-midnight/80 uppercase flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            <span>HAPPY TRAVELLERS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
            <span>BEAUTIFUL STORIES</span>
            <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
            <span>A STRONGER KASHMIR</span>
          </div>

          {/* Centered Golden Accent Line */}
          <div className="w-16 sm:w-20 h-[2px] bg-saffron rounded-full mt-2 shadow-xs"></div>
        </div>
      </div>
    </section>
  );
}
