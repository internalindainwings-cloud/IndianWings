'use client';

import React, { useState } from 'react';
import { DestinationItem } from '@/data/destinations';
import { DestinationDetailContent, DestinationAttraction } from '@/data/destination-content';
import { DestinationAttractionCard } from './DestinationAttractionCard';

interface ThingsToSeeDoSectionProps {
  destination: DestinationItem;
  content: DestinationDetailContent;
}

const CATEGORIES = [
  'Most Loved Places',
  'Hills & Mountains',
  'Resorts & Stays',
  'Foodie Hotspots',
  'Adventure',
  'Memorable Experience',
] as const;

type CategoryType = typeof CATEGORIES[number];

export const ThingsToSeeDoSection: React.FC<ThingsToSeeDoSectionProps> = ({ destination, content }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('Most Loved Places');

  // Filter attractions by category, fallback to all if specific category has none
  const filteredAttractions: DestinationAttraction[] = content.attractions.filter(
    (item) => item.category === activeCategory
  );

  const displayAttractions = filteredAttractions.length > 0 ? filteredAttractions : content.attractions;

  return (
    <section 
      id="things-to-do" 
      className="w-full bg-white py-6 sm:py-8 lg:py-10 relative overflow-hidden border-t border-black/[0.08] scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* 1. Dynamic Section Header */}
        <div className="text-left mb-4 sm:mb-5 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-saffron rounded-full"></span>
            <span className="text-saffron font-manrope font-bold text-xs uppercase tracking-widest">
              ATTRACTIONS &amp; EXPERIENCES
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0B1F2A] font-semibold leading-tight">
            Things To See &amp; Do in {destination.name}
          </h2>
        </div>

        {/* 2. Category Tabs (Horizontal Scrollable on Mobile) */}
        <div className="mb-5 sm:mb-6 pb-2 border-b border-black/[0.08]">
          <div 
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none flex-nowrap py-1"
            role="tablist"
            aria-label="Attraction categories"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`min-h-[40px] px-4 sm:px-5 py-2 rounded-full font-manrope text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                    isActive
                      ? 'bg-saffron text-midnight shadow-xs font-bold scale-[1.02]'
                      : 'bg-white/70 hover:bg-white text-[#475569] border border-black/10'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Responsive Attraction Cards Grid */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-7">
          {displayAttractions.map((attraction) => (
            <DestinationAttractionCard key={attraction.id} attraction={attraction} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThingsToSeeDoSection;
