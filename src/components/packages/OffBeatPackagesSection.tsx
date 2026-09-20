'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { PackageItem } from '@/data/packages';
import { PackageCard } from './PackageCard';

const ITEMS_PER_PAGE = 3;

interface OffBeatPackagesSectionProps {
  initialPackages?: PackageItem[];
}

export const OffBeatPackagesSection: React.FC<OffBeatPackagesSectionProps> = ({ initialPackages = [] }) => {
  const [packagesList, setPackagesList] = useState<PackageItem[]>(initialPackages);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(initialPackages.length > 0);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch('/api/packages?category=offbeat');
        const json = await res.json();
        if (json.success && Array.isArray(json.packages) && isMounted) {
          setPackagesList(json.packages);
        }
      } catch {
        // network error
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = Math.ceil(packagesList.length / ITEMS_PER_PAGE) || 1;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPackages = packagesList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <section id="off-beat" className="w-full bg-white pt-4 sm:pt-6 pb-6 sm:pb-7 relative overflow-hidden border-t border-black/6 scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Compact Split Row Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4 mb-3 sm:mb-4 pb-2.5 border-b border-black/[0.08]">
          {/* Left: Title + Micro Badge + Subtitle */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-manrope text-lg sm:text-xl md:text-2xl text-[#0B1F2A] font-bold tracking-tight">
                Off-Beat <span className="text-saffron">Kashmir</span> Packages
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 font-manrope font-bold text-[10.5px] tracking-wide">
                <Compass size={10} />
                <span>Permits Handled</span>
              </span>
            </div>
          </div>

          {/* Right: Explore All Link */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-end">
            <Link
              href="/packages#off-beat"
              className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-manrope font-bold text-midnight hover:text-saffron bg-black/[0.04] hover:bg-black/[0.07] px-3.5 py-1.5 rounded-full border border-black/10 transition-all duration-200"
            >
              <span>Explore All Off-Beat Packages</span>
              <span className="text-saffron font-extrabold ml-0.5">→</span>
            </Link>
          </div>
        </div>

        {/* Cards Grid (Consistent 3-Column Layout) */}
        {packagesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {currentPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="py-10 sm:py-14 text-center rounded-2xl border border-dashed border-black/15 bg-black/[0.02]">
            <p className="font-manrope font-bold text-sm sm:text-base text-midnight mb-1">
              No off-beat packages available yet
            </p>
            <p className="font-manrope text-xs text-slate-500">
              Exclusive untouched valley itineraries are being prepared.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {packagesList.length > ITEMS_PER_PAGE && (
          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-black/8">
            <p className="text-xs sm:text-sm font-manrope text-[#64748B]">
              Showing <span className="font-bold text-[#0B1F2A]">{startIndex + 1}–{startIndex + currentPackages.length}</span> of <span className="font-bold text-[#0B1F2A]">{packagesList.length}</span> off-beat packages
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

export default OffBeatPackagesSection;
