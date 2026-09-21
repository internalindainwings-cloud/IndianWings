'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DestinationItem } from '@/data/destinations';
import { DestinationCard } from './DestinationCard';

interface DestinationsSectionProps {
  initialDestinations?: DestinationItem[];
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({ initialDestinations = [] }) => {
  const [destinationsList] = useState<DestinationItem[]>(initialDestinations);

  // Show the first 3 destinations
  const iconicDestinations = destinationsList.slice(0, 3);

  return (
    <section id="destinations" className="w-full bg-white pt-4 sm:pt-6 pb-6 sm:pb-8 relative overflow-hidden border-t border-black/6 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Compact Split Row Header (Matching All Other Sections) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 mb-4 sm:mb-5 pb-2.5 border-b border-black/[0.08]">
          {/* Left: Title */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-manrope text-lg sm:text-xl md:text-2xl text-[#0B1F2A] font-bold tracking-tight">
                Featured <span className="text-saffron">Kashmir</span> Destinations
              </h2>
            </div>
          </div>

          {/* Right: Explore All Link */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-end">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-manrope font-bold text-midnight hover:text-saffron bg-black/[0.04] hover:bg-black/[0.07] px-3.5 py-1.5 rounded-full border border-black/10 transition-all duration-200"
            >
              <span>Explore All Destinations</span>
              <span className="text-saffron font-extrabold ml-0.5">→</span>
            </Link>
          </div>
        </div>

        {/* Cards Grid (Srinagar, Gulmarg, Pahalgam) */}
        {iconicDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {iconicDestinations.map((destination, idx) => (
              <DestinationCard key={destination.id} destination={destination} index={idx} />
            ))}
          </div>
        ) : (
          <div className="py-10 sm:py-14 text-center rounded-2xl border border-dashed border-black/15 bg-black/[0.02]">
            <p className="font-manrope font-bold text-sm sm:text-base text-midnight mb-1">
              No destinations found
            </p>
            <p className="font-manrope text-xs text-slate-500">
              Check back soon for curated valley destinations.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default DestinationsSection;
