'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface DestinationHeroGalleryProps {
  images: string[];
  destinationName: string;
}

const AUTOPLAY_INTERVAL_MS = 5000;

export const DestinationHeroGallery: React.FC<DestinationHeroGalleryProps> = ({
  images,
  destinationName,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalImages = images.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    // User interaction: momentarily reset timer
    if (timerRef.current) clearInterval(timerRef.current);
    startTimer();
  };

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL_MS);
  }, [nextSlide]);

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, startTimer]);

  const handleNextClick = () => {
    nextSlide();
    startTimer();
  };

  const handlePrevClick = () => {
    prevSlide();
    startTimer();
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-midnight/40 border border-white/15 shadow-2xl backdrop-blur-xs flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label={`${destinationName} photo gallery`}
    >
      {/* 1. Large Main Slide Display */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] overflow-hidden bg-midnight">
        {images.map((imgSrc, idx) => (
          <div
            key={imgSrc}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={imgSrc}
              alt={`${destinationName} view ${idx + 1}`}
              fill
              priority={idx === 0}
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 55vw"
            />
          </div>
        ))}

        {/* Subtle Bottom Scrim for overlay controls */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-midnight/90 via-midnight/40 to-transparent z-20 pointer-events-none" />

        {/* Floating Manual Navigation Arrows */}
        <div className="absolute inset-y-0 inset-x-3 sm:inset-x-4 flex items-center justify-between z-30 pointer-events-none">
          <button
            type="button"
            onClick={handlePrevClick}
            aria-label={`Previous ${destinationName} photo`}
            className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-midnight/80 hover:bg-saffron text-warm-white hover:text-midnight border border-white/20 hover:border-transparent flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={handleNextClick}
            aria-label={`Next ${destinationName} photo`}
            className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-midnight/80 hover:bg-saffron text-warm-white hover:text-midnight border border-white/20 hover:border-transparent flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron active:scale-95 cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Slide Counter Badge */}
        <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 pointer-events-none">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-midnight/85 backdrop-blur-md text-[11px] font-mono font-medium text-warm-white/95 border border-white/15 shadow-xs">
            {activeIndex + 1} / {totalImages}
          </span>
        </div>
      </div>

      {/* 2. Compact Multi-Image Thumbnail Track */}
      <div className="p-3 sm:p-4 bg-midnight/90 border-t border-white/10 z-20">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none">
          {images.map((imgSrc, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={imgSrc}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Show ${destinationName} image ${idx + 1}`}
                className={`relative w-16 h-12 sm:w-20 sm:h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                  isActive
                    ? 'border-saffron shadow-md scale-105 opacity-100'
                    : 'border-white/20 opacity-60 hover:opacity-90 hover:border-white/40'
                }`}
              >
                <Image
                  src={imgSrc}
                  alt={`${destinationName} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
