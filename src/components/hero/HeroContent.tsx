'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin } from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

export interface HeroContentProps {
  headline?: string;
  badgeText?: string;
  subheadline?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  layoutMode?: 'original' | 'dynamic';
}

export const HeroContent: React.FC<HeroContentProps> = ({
  headline = 'RIWAAYAT-E-KASHMIR',
  badgeText,
  subheadline = 'Heritage & Cultural Journeys Begins',
  primaryCtaText = 'Get Free Quote',
  secondaryCtaText = 'Explore Packages',
  secondaryCtaLink = '/packages',
  layoutMode = 'dynamic',
}) => {
  const { openModal } = useEnquiryModal();
  const isOriginal = layoutMode === 'original';

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-center">
      <div className="w-full lg:w-1/2 max-w-xl flex flex-col items-start text-left select-none">
        {/* Optional Badge Pill */}
        {badgeText && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-manrope font-semibold bg-[#C5A45E]/15 border border-[#C5A45E]/40 text-[#C5A45E] mb-2 sm:mb-2.5 backdrop-blur-md">
            <Sparkles size={12} className="text-[#C5A45E]" />
            <span>{badgeText}</span>
          </div>
        )}

        {/* Main Heading — Luxury Sand Gold #C5A45E */}
        <h1 
          className={
            isOriginal
              ? 'font-manrope font-extrabold text-[22px] min-[360px]:text-[26px] min-[400px]:text-[28px] sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[46px] text-[#C5A45E] leading-tight tracking-tight whitespace-normal sm:whitespace-nowrap break-words drop-shadow-[0_3px_16px_rgba(0,0,0,0.85)] mb-2.5 sm:mb-4'
              : 'font-manrope font-extrabold text-[26px] min-[360px]:text-[30px] min-[400px]:text-[32px] sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] text-[#C5A45E] leading-[1.14] md:leading-[1.1] tracking-tight whitespace-normal sm:whitespace-nowrap break-words drop-shadow-[0_3px_16px_rgba(0,0,0,0.85)] mb-2 md:mb-2.5'
          }
        >
          {headline}
        </h1>

        {subheadline && (
          <p 
            className={
              isOriginal
                ? 'font-manrope text-[#C5A45E] text-sm sm:text-base font-medium max-w-lg mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] line-clamp-2'
                : 'font-manrope text-white/90 text-sm sm:text-base md:text-lg font-medium max-w-lg mb-4 sm:mb-5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-relaxed line-clamp-2'
            }
          >
            {subheadline}
          </p>
        )}

        {/* Action Buttons: Responsive row */}
        {isOriginal ? (
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
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
        ) : (
          <div className="flex flex-row items-center gap-2.5 sm:gap-3 w-auto flex-wrap">
            <button
              type="button"
              onClick={() => openModal({ source: 'hero_primary_cta' })}
              className="px-4.5 sm:px-5 py-2.5 rounded-full bg-[#C5A45E] hover:bg-[#b5944e] text-midnight font-manrope font-bold text-xs sm:text-[13px] shadow-md hover:shadow-[#C5A45E]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>{primaryCtaText}</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
            <Link
              href={secondaryCtaLink || '/packages'}
              className="px-4.5 sm:px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-warm-white border border-white/25 backdrop-blur-md font-manrope font-semibold text-xs sm:text-[13px] transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>{secondaryCtaText}</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}

        {/* Location Pin */}
        <div className="mt-4 sm:mt-5 flex items-center gap-1.5 text-white/95 font-manrope text-sm sm:text-base font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          <MapPin size={16} className="text-[#C5A45E]" strokeWidth={2.5} />
          <span>Srinagar, Kashmir</span>
        </div>

      </div>
    </div>
  );
};
