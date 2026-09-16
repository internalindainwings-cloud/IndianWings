'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { featuredPackagesData, PackageItem } from '@/data/packages';
import { PackageCard } from './PackageCard';

const ITEMS_PER_PAGE = 3;

export const PackagesSection = () => {
  const [packagesList, setPackagesList] = useState<PackageItem[]>(featuredPackagesData);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch('/api/packages?category=featured');
        const json = await res.json();
        if (json.success && Array.isArray(json.packages) && json.packages.length > 0 && isMounted) {
          setPackagesList(json.packages);
        }
      } catch {
        // preserve fallback
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
    <section id="packages" className="w-full bg-white pt-5 sm:pt-7 lg:pt-8 pb-12 sm:pb-16 relative overflow-hidden scroll-mt-20">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        
        {/* Split Row Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-6 mb-5 sm:mb-6 pb-3 border-b border-black/[0.08]">
          {/* Left: Title + Micro Badge + Subtitle */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-manrope text-lg sm:text-xl md:text-2xl text-[#0B1F2A] font-bold tracking-tight">
                Featured <span className="text-saffron">Kashmir</span> Packages
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-saffron/10 border border-saffron/25 text-saffron font-manrope font-bold text-[10.5px] tracking-wide">
                <span>100% Customizable</span>
              </span>
            </div>
          </div>

          {/* Right: Explore All Link */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-end">
            <Link
              href="/packages"
              className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-manrope font-bold text-midnight hover:text-saffron bg-black/[0.04] hover:bg-black/[0.07] px-3.5 py-1.5 rounded-full border border-black/10 transition-all duration-200"
            >
              <span>Explore All Packages</span>
              <span className="text-saffron font-extrabold ml-0.5">→</span>
            </Link>
          </div>
        </div>

        {/* 3. Cards Grid (Consistent 3-Column Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {currentPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* 4. Pagination Controls */}
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 border-t border-black/8">
          <p className="text-xs sm:text-sm font-manrope text-[#64748B]">
            Showing <span className="font-bold text-[#0B1F2A]">{startIndex + 1}–{startIndex + currentPackages.length}</span> of <span className="font-bold text-[#0B1F2A]">{packagesList.length}</span> featured packages
          </p>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                currentPage === 1
                  ? 'border-black/5 text-black/30 cursor-not-allowed bg-transparent'
                  : 'border-black/15 text-[#0B1F2A] hover:bg-saffron hover:border-saffron hover:text-midnight bg-white shadow-2xs'
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-full text-xs font-manrope font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-saffron text-midnight shadow-xs scale-105'
                      : 'bg-white hover:bg-black/5 text-[#0B1F2A] border border-black/10'
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
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
                currentPage === totalPages
                  ? 'border-black/5 text-black/30 cursor-not-allowed bg-transparent'
                  : 'border-black/15 text-[#0B1F2A] hover:bg-saffron hover:border-saffron hover:text-midnight bg-white shadow-2xs'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
