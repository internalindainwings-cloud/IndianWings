'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroVideoBackground } from './HeroVideoBackground';
import { HeroContent } from './HeroContent';
import { HeroSlideIndicator } from './HeroSlideIndicator';
import { HeroActionBar } from '../trust/HeroActionBar';
import type { HeroHomepageConfig } from '@/data/hero-defaults';
import { defaultHeroConfig } from '@/data/hero-defaults';

interface HeroSectionProps {
  heroConfig?: HeroHomepageConfig;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ heroConfig: initialConfig }) => {
  const config = initialConfig || defaultHeroConfig;
  const [currentSlide, setCurrentSlide] = useState(0);



  const slides = config.slides && config.slides.length > 0 ? config.slides : defaultHeroConfig.slides;
  const slide = slides[currentSlide % slides.length] || slides[0];


  const nextSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const isDynamicDesktop = config.desktopLayoutMode !== 'original';

  return (
    <div className="w-full">
      <section 
        className={`relative w-full max-w-full flex flex-col justify-between overflow-hidden transition-all duration-500 ${
          isDynamicDesktop
            ? 'h-[calc(100dvh-75px)] min-h-[560px] md:h-[calc(100dvh-80px)] min-[1140px]:h-[calc(100dvh-85px)] md:min-h-[620px]'
            : 'h-[calc(100dvh-115px)] sm:h-[calc(100dvh-110px)] min-h-[435px] max-h-[545px] min-[1140px]:h-[calc(100dvh-150px)] min-[1140px]:min-h-[465px] min-[1140px]:max-h-[575px]'
        }`}
      >
        {/* Background stays absolutely positioned with smooth multi-slide transitions */}
        <HeroVideoBackground 
          slides={slides}
          currentSlide={currentSlide}

          src={slide.videoSrc || slide.poster || config.videoUrl || config.posterUrl} 
          poster={slide.poster || config.posterUrl}
          mobileSrc={slide.mobileVideoSrc || slide.mobilePoster || config.mobileVideoUrl || config.mobilePosterUrl}
          mobilePoster={slide.mobilePoster || config.mobilePosterUrl}
        />
        
        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/20 hover:bg-black/50 text-white/70 hover:text-white backdrop-blur-sm transition-all border border-white/10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 rounded-full bg-black/20 hover:bg-black/50 text-white/70 hover:text-white backdrop-blur-sm transition-all border border-white/10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Main hero content fills available space */}
        <div 
          className={`flex-1 flex flex-col relative z-10 w-full justify-center min-h-0 ${
            isDynamicDesktop
              ? 'pt-4 sm:pt-4 md:pt-1.5 pb-6 sm:pb-8 translate-y-0 md:-translate-y-14 lg:-translate-y-20 xl:-translate-y-24'
              : 'pt-0 sm:pt-1 md:pt-1.5 pb-6 sm:pb-8 -translate-y-20 sm:-translate-y-7 md:-translate-y-9'
          }`}
        >
          <HeroContent 
            headline={config.headline}
            badgeText={config.badgeText}
            subheadline={config.subheadline}
            primaryCtaText={config.primaryCtaText}
            secondaryCtaText={config.secondaryCtaText}
            secondaryCtaLink={config.secondaryCtaLink}
            layoutMode={isDynamicDesktop ? 'dynamic' : 'original'}

          />
          
          {/* Mobile Slide Indicator Dots */}
          {slides.length > 1 && (
            <div className={`lg:hidden flex items-center justify-start gap-1.5 px-4 sm:px-8 z-20 ${
              isDynamicDesktop ? 'mt-4' : 'mt-3'
            }`}>
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'w-6 bg-[#C5A45E]' : 'w-2 bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Desktop Slide Indicator Numbers */}
          {slides.length > 1 && (
            <div className="hidden lg:block">
              <HeroSlideIndicator 
                totalSlides={slides.length} 
                currentSlide={currentSlide} 
                onChangeSlide={setCurrentSlide} 
              />
            </div>
          )}
        </div>

        {/* In Original Mode: Action Bar docked right at bottom edge inside hero */}
        {!isDynamicDesktop && (
          <div className="relative z-20 w-full shrink-0">
            <HeroActionBar trustPills={config.trustPills} />
          </div>
        )}
      </section>

      {/* In Dynamic Mode: Action Bar sits cleanly right BELOW the full viewport */}
      {isDynamicDesktop && (
        <div className="relative z-20 w-full shrink-0">
          <HeroActionBar trustPills={config.trustPills} />
        </div>
      )}
    </div>
  );
};
