'use client';

import React, { useState, useEffect } from 'react';
import { DestinationItem } from '@/data/destinations';
import { DestinationCard } from './DestinationCard';

type CategoryFilter = 'All' | 'Iconic' | 'Alpine' | 'Off-Beat';

const CATEGORIES: CategoryFilter[] = ['All', 'Iconic', 'Alpine', 'Off-Beat'];

interface DestinationsPageGridProps {
  initialDestinations?: DestinationItem[];
}

export const DestinationsPageGrid: React.FC<DestinationsPageGridProps> = ({ initialDestinations = [] }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [destinationsList, setDestinationsList] = useState<DestinationItem[]>(initialDestinations);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch('/api/destinations');
        const json = await res.json();
        if (json.success && Array.isArray(json.destinations) && isMounted) {
          setDestinationsList(json.destinations);
        }
      } catch {
        // network error
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDestinations = activeCategory === 'All'
    ? destinationsList
    : destinationsList.filter((dest: DestinationItem) => dest.category === activeCategory);

  return (
    <section id="destinations-grid" className="w-full bg-background py-12 sm:py-16 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-black/10">
          <div>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-charcoal">
              All Kashmir Destinations
            </h2>
            <p className="font-manrope text-xs sm:text-sm text-slate-blue mt-0.5">
              Showing {filteredDestinations.length} curated destinations across Jammu &amp; Kashmir
            </p>
          </div>

          {/* Category Filter Pills */}
          <div 
            className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-nowrap py-1"
            role="tablist"
            aria-label="Filter destinations by category"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full font-manrope text-xs sm:text-[13px] font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-saffron text-midnight font-bold shadow-xs scale-[1.02]'
                      : 'bg-white/80 hover:bg-white text-charcoal border border-black/10'
                  }`}
                >
                  {cat === 'All' ? 'All Valleys' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Destinations Cards Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredDestinations.map((destination: DestinationItem, idx: number) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 sm:py-16 text-center rounded-2xl border border-dashed border-black/15 bg-black/[0.02]">
            <p className="font-manrope font-bold text-base text-midnight mb-1">
              No destinations in this category
            </p>
            <p className="font-manrope text-xs text-slate-500">
              Try selecting another category or view all valleys.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default DestinationsPageGrid;
