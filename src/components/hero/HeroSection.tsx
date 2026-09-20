'use client';

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
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
  const [config, setConfig] = useState<HeroHomepageConfig>(initialConfig || defaultHeroConfig);
  const [currentSlide, setCurrentSlide] = useState(0);

  // If initialConfig changes from server revalidation
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  // Always sync with latest API config on client mount
  useEffect(() => {
    fetch('/api/hero')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.hero) {
          setConfig(data.hero);
        }
      })
      .catch((err) => console.warn('Could not load hero config:', err));
  }, []);

  const slides = config.slides && config.slides.length > 0 ? config.slides : defaultHeroConfig.slides;
  const slide = slides[currentSlide % slides.length] || slides[0];
  const slideLocation = (slide.location && slide.location.trim().length > 0)
    ? slide.location.trim()
    : (slide.title && slide.title.trim().length > 0)
    ? slide.title.trim()
    : '';

  // Auto-advance carousel slides based on configured duration
  useEffect(() => {
    if (slides.length <= 1) return;
    const duration = config.transitionDuration || 5500;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearInterval(interval);
  }, [slides.length, config.transitionDuration]);

  return (
    <section className="relative w-full max-w-full h-[calc(100dvh-115px)] sm:h-[calc(100dvh-110px)] min-h-[435px] max-h-[545px] min-[1140px]:h-[calc(100dvh-150px)] min-[1140px]:min-h-[465px] min-[1140px]:max-h-[575px] flex flex-col justify-between overflow-hidden">
      {/* Background stays absolutely positioned with smooth multi-slide transitions */}
      <HeroVideoBackground 
        slides={slides}
        currentSlide={currentSlide}
        transitionType={config.transitionType || 'fade'}
        src={slide.videoSrc || slide.poster || config.videoUrl || config.posterUrl} 
        poster={slide.poster || config.posterUrl}
        mobileSrc={slide.mobileVideoSrc || slide.mobilePoster || config.mobileVideoUrl || config.mobilePosterUrl}
        mobilePoster={slide.mobilePoster || config.mobilePosterUrl}
      />
      
      {/* Main hero content fills available space — pulled up further towards nav on mobile */}
      <div className="flex-1 flex flex-col relative z-10 w-full justify-center min-h-0 pt-0 sm:pt-1 md:pt-1.5 pb-6 sm:pb-8 -translate-y-20 sm:-translate-y-7 md:-translate-y-9">
        <HeroContent 
          headline={config.headline}
          badgeText={config.badgeText}
          subheadline={config.subheadline}
          primaryCtaText={config.primaryCtaText}
          secondaryCtaText={config.secondaryCtaText}
          secondaryCtaLink={config.secondaryCtaLink}
        />
        
        {/* Mobile Slide Indicator Dots */}
        {slides.length > 1 && (
          <div className="lg:hidden flex items-center justify-start gap-1.5 mt-3 px-4 sm:px-8 z-20">
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

      {/* Active Slide Location Tag (Bold with Location Pin Icon at Bottom Right) */}
      {slideLocation && (
        <div 
          key={slide.id || currentSlide}
          className="absolute right-3.5 sm:right-6 md:right-10 lg:right-12 bottom-12 sm:bottom-14 md:bottom-16 z-30 pointer-events-auto select-none transition-all duration-500 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#0B1E24]/85 hover:bg-[#0B1E24] backdrop-blur-md border border-[#C5A45E]/50 shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-transform hover:scale-105">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#C5A45E] fill-[#C5A45E]/20 shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
            <span className="font-manrope font-extrabold text-[11.5px] sm:text-xs md:text-sm text-white tracking-wide max-w-[55vw] sm:max-w-xs md:max-w-md truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {slideLocation}
            </span>
          </div>
        </div>
      )}

      {/* Action Bar docked right at the bottom edge of hero — hero ends strictly here */}
      <div className="relative z-20 w-full shrink-0">
        <HeroActionBar trustPills={config.trustPills} />
      </div>
    </section>
  );
};
