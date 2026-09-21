'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PackageItem } from '@/data/packages';
import { PackageCard } from './PackageCard';

const ITEMS_PER_PAGE = 3;

type SeasonFilter = 'all' | 'winter' | 'spring' | 'summer' | 'autumn';

interface SeasonalPackagesSectionProps {
  initialPackages?: PackageItem[];
}

function applySeasonFallback(packages: PackageItem[]): PackageItem[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return packages.map((p: any) => ({
    ...p,
    season: p.season || (p.tag?.toLowerCase().includes('winter') ? 'winter' : p.tag?.toLowerCase().includes('spring') ? 'spring' : p.tag?.toLowerCase().includes('autumn') ? 'autumn' : 'all'),
  }));
}


export const SeasonalPackagesSection: React.FC<SeasonalPackagesSectionProps> = ({ initialPackages = [] }) => {
  const [activeFilter, setActiveFilter] = useState<SeasonFilter>('all');
  const [packagesList] = useState<PackageItem[]>(() => applySeasonFallback(initialPackages));
  const [currentPage, setCurrentPage] = useState<number>(1);



  // Filter packages by season
  const filteredPackages = activeFilter === 'all'
    ? packagesList
    : packagesList.filter((p) => p.season === activeFilter);

  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPackages = filteredPackages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = (filter: SeasonFilter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const filters: { id: SeasonFilter; label: string; sub: string; activeColor: string }[] = [
    {
      id: 'all',
      label: 'All Seasons',
      sub: 'Year-Round',
      activeColor: 'bg-midnight text-white border-midnight shadow-xs',
    },
    {
      id: 'winter',
      label: 'Winter Snow',
      sub: '(Dec–Feb)',
      activeColor: 'bg-sky-600 text-white border-sky-600 shadow-xs',
    },
    {
      id: 'spring',
      label: 'Spring Blossoms',
      sub: '(Mar–Apr)',
      activeColor: 'bg-rose-600 text-white border-rose-600 shadow-xs',
    },
    {
      id: 'summer',
      label: 'Summer Meadows',
      sub: '(May–Aug)',
      activeColor: 'bg-amber-600 text-white border-amber-600 shadow-xs',
    },
    {
      id: 'autumn',
      label: 'Golden Autumn',
      sub: '(Sep–Nov)',
      activeColor: 'bg-amber-700 text-white border-amber-700 shadow-xs',
    },
  ];

  return (
    <section id="seasonal" className="w-full bg-white pt-4 sm:pt-6 pb-6 sm:pb-7 relative overflow-hidden border-t border-black/6 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Compact Split Row Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 mb-3 sm:mb-4 pb-2.5 border-b border-black/[0.08]">
          {/* Left: Title + Micro Badge + Subtitle */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-manrope text-lg sm:text-xl md:text-2xl text-[#0B1F2A] font-bold tracking-tight">
                Seasonal <span className="text-saffron">Special</span> Packages
              </h2>
            </div>
          </div>

          {/* Right: Explore All Link */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-end">
            <Link
              href="/packages#seasonal"
              className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-manrope font-bold text-midnight hover:text-saffron bg-black/[0.04] hover:bg-black/[0.07] px-3.5 py-1.5 rounded-full border border-black/10 transition-all duration-200"
            >
              <span>Explore All Seasonal Packages</span>
              <span className="text-saffron font-extrabold ml-0.5">→</span>
            </Link>
          </div>
        </div>

        {/* Interactive Season Filter Tabs (Requested by User) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
          {filters.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleFilterChange(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-manrope font-bold text-xs transition-all duration-200 cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? tab.activeColor
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-medium ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {tab.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid (Consistent 3-Column Layout) */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {currentPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="py-10 sm:py-14 text-center rounded-2xl border border-dashed border-black/15 bg-black/[0.02]">
            <p className="font-manrope font-bold text-sm sm:text-base text-midnight mb-1">
              No packages in this season yet
            </p>
            <p className="font-manrope text-xs text-slate-500">
              New handcrafted seasonal packages are being curated.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredPackages.length > ITEMS_PER_PAGE && (
          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-black/8">
            <p className="text-xs sm:text-sm font-manrope text-[#64748B]">
              Showing <span className="font-bold text-[#0B1F2A]">{startIndex + 1}–{startIndex + currentPackages.length}</span> of <span className="font-bold text-[#0B1F2A]">{filteredPackages.length}</span> packages
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                  currentPage === 1
                    ? 'border-black/5 text-black/30 cursor-not-allowed bg-transparent'
                    : 'border-black/15 text-[#0B1F2A] hover:bg-saffron hover:border-saffron hover:text-midnight bg-white shadow-2xs'
                }`}
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Page ${page}`}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-manrope font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-saffron text-midnight shadow-xs font-extrabold border border-saffron'
                        : 'border border-black/10 text-midnight hover:border-saffron/40 hover:bg-saffron/10'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                  currentPage === totalPages
                    ? 'border-black/5 text-black/30 cursor-not-allowed bg-transparent'
                    : 'border-black/15 text-[#0B1F2A] hover:bg-saffron hover:border-saffron hover:text-midnight bg-white shadow-2xs'
                }`}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default SeasonalPackagesSection;
