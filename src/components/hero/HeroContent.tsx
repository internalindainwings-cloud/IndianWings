'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

export interface HeroContentProps {
  headline?: string;
  badgeText?: string;
  subheadline?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  headline = 'RIWAAYAT-E-KASHMIR',
  badgeText,
  subheadline = 'Heritage & Cultural Journeys Begins',
  primaryCtaText = 'Get Free Quote',
  secondaryCtaText = 'Explore Packages',
  secondaryCtaLink = '/packages',
}) => {
  const { openModal } = useEnquiryModal();

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-center">
      <div className="w-full lg:w-1/2 max-w-xl flex flex-col items-start text-left select-none">
        {/* Optional Badge Pill */}
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#C5A45E]/15 border border-[#C5A45E]/40 text-[#C5A45E] mb-2 sm:mb-2.5 backdrop-blur-md">
            <Sparkles size={12} className="text-[#C5A45E]" />
            <span>{badgeText}</span>
          </div>
        )}

        {/* Main Heading — Single Line in Luxury Sand Gold #C5A45E */}
        <h1 className="font-display text-[20px] min-[360px]:text-[22px] min-[400px]:text-[24px] sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[46px] text-[#C5A45E] leading-tight tracking-tight whitespace-nowrap drop-shadow-[0_3px_16px_rgba(0,0,0,0.85)] mb-3 sm:mb-4">
          {headline}
        </h1>

        {subheadline && (
          <p 
            className="text-[#C5A45E] text-xs sm:text-sm max-w-lg mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] line-clamp-2"
            style={{ fontFamily: "'Canva Sans', var(--font-manrope), 'Manrope', sans-serif" }}
          >
            {subheadline}
          </p>
        )}

        {/* Action Buttons: Small size directly here */}
        <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => openModal({ source: 'hero_primary_cta' })}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#C5A45E] hover:bg-[#b5944e] text-midnight font-manrope font-bold text-xs shadow-md hover:shadow-[#C5A45E]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>{primaryCtaText}</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
          <Link
            href={secondaryCtaLink || '/packages'}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-warm-white border border-white/20 backdrop-blur-md font-manrope font-semibold text-xs transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>{secondaryCtaText}</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
