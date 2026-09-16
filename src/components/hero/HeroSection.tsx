'use client';

import React, { useState, useEffect } from 'react';
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

  // Client refresh if loaded initially without props
  useEffect(() => {
    if (!initialConfig) {
      fetch('/api/hero')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.hero) {
            setConfig(data.hero);
          }
        })
        .catch((err) => console.warn('Could not load hero config:', err));
    }
  }, [initialConfig]);

  const slides = config.slides && config.slides.length > 0 ? config.slides : defaultHeroConfig.slides;
  const slide = slides[currentSlide % slides.length] || slides[0];

  return (
    <section className="relative w-screen max-w-full h-[calc(100dvh-115px)] sm:h-[calc(100dvh-110px)] min-h-[435px] max-h-[545px] min-[1140px]:h-[calc(100dvh-150px)] min-[1140px]:min-h-[465px] min-[1140px]:max-h-[575px] flex flex-col justify-between overflow-hidden">
      {/* Background stays absolutely positioned to cover the whole section */}
      <HeroVideoBackground 
        key={slide.id || currentSlide} 
        src={slide.videoSrc || config.videoUrl} 
        poster={slide.poster || config.posterUrl} 
      />
      
      {/* Main hero content fills available space — reduced top padding */}
      <div className="flex-1 flex flex-col relative z-10 w-full justify-center min-h-0 pt-0 sm:pt-1 md:pt-1.5 pb-6 sm:pb-8 -translate-y-5 sm:-translate-y-7 md:-translate-y-9">
        <HeroContent 
          headline={config.headline}
          badgeText={config.badgeText}
          subheadline={config.subheadline}
          primaryCtaText={config.primaryCtaText}
          secondaryCtaText={config.secondaryCtaText}
          secondaryCtaLink={config.secondaryCtaLink}
        />
        
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

      {/* Action Bar docked right at the bottom edge of hero — hero ends strictly here */}
      <div className="relative z-20 w-full shrink-0">
        <HeroActionBar trustPills={config.trustPills} />
      </div>
    </section>
  );
};
