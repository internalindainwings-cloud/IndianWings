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

  const [desktopAspectRatio, setDesktopAspectRatio] = useState<number>(1916 / 821);

  // Dynamic aspect ratio calculation on desktop based on active slide image
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rawMediaUrl = (slide.videoSrc && slide.videoSrc.trim().length > 0)
      ? slide.videoSrc.trim()
      : (slide.poster && slide.poster.trim().length > 0)
      ? slide.poster.trim()
      : (config.videoUrl || config.posterUrl);

    if (!rawMediaUrl) return;

    const img = new window.Image();
    img.src = rawMediaUrl;
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight && img.naturalHeight > 0) {
        setDesktopAspectRatio(img.naturalWidth / img.naturalHeight);
      }
    };
  }, [slide, config]);

  // Auto-advance carousel slides based on configured duration
  useEffect(() => {
    if (slides.length <= 1) return;
    const duration = config.transitionDuration || 5500;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearInterval(interval);
  }, [slides.length, config.transitionDuration]);

  const isDynamicDesktop = config.desktopLayoutMode !== 'original';

  return (
    <div className="w-full">
      <section 
        className={`relative w-full max-w-full h-[calc(100dvh-115px)] sm:h-[calc(100dvh-110px)] min-h-[435px] max-h-[545px] flex flex-col justify-between overflow-hidden transition-all duration-500 ${
          isDynamicDesktop
            ? 'md:h-[calc(100dvh-80px)] min-[1140px]:h-[calc(100dvh-85px)] md:min-h-[620px] md:max-h-none'
            : 'md:h-[calc(100dvh-150px)] md:min-h-[465px] md:max-h-[575px]'
        }`}
      >
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

        {/* Active Slide Location Tag (Centered in Viewport) */}
        {slideLocation && (
          <div 
            key={slide.id || currentSlide}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none select-none transition-all duration-500 animate-in fade-in zoom-in-95 flex items-center justify-center w-full max-w-fit px-4 text-center"
          >
            <div className="pointer-events-auto inline-flex items-center justify-center gap-2.5 sm:gap-3 transition-transform duration-300 hover:scale-105">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-[#C5A45E] fill-[#C5A45E]/25 shrink-0 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]" />
              <span className="font-manrope font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl text-white tracking-wide max-w-[90vw] sm:max-w-2xl truncate drop-shadow-[0_3px_16px_rgba(0,0,0,0.95)]">
                {slideLocation}
              </span>
            </div>
          </div>
        )}

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
