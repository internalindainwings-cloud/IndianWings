'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FounderPortraitSliderProps {
  images?: string[];
  alt?: string;
  className?: string;
  autoPlayInterval?: number;
  sizes?: string;
}

export const DEFAULT_FOUNDER_IMAGES = [
  'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789917437/founder_new.jpg',
  'https://res.cloudinary.com/dcmoseix9/image/upload/v1790695910/WhatsApp_Image_2026-09-11_at_1.53.30_PM_swwjyc.jpg',
];

export const FounderPortraitSlider: React.FC<FounderPortraitSliderProps> = ({
  images = DEFAULT_FOUNDER_IMAGES,
  alt = 'Mrs. Komal Rai — Founder & Managing Director',
  className = '',
  autoPlayInterval = 5000,
  sizes = '(max-width: 640px) 176px, 256px',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (isPaused || images.length <= 1) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, images.length, autoPlayInterval]);

  return (
    <div
      className={`relative group rounded-xl sm:rounded-2xl overflow-hidden border border-black/10 shadow-md bg-slate-100 select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Images Layer with Crossfade */}
      {images.map((src, idx) => (
        <div
          key={src + idx}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={src}
            alt={`${alt} (Photo ${idx + 1})`}
            fill
            className="object-cover object-top"
            sizes={sizes}
            priority={idx === 0}
          />
        </div>
      ))}

      {/* Subtle Bottom Gradient for Controls Visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 z-20 pointer-events-none" />

      {/* Counter Badge */}
      {images.length > 1 && (
        <div className="absolute top-2.5 right-2.5 z-30">
          <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-manrope font-semibold text-white/90 border border-white/15">
            {currentIndex + 1}/{images.length}
          </span>
        </div>
      )}

      {/* Navigation Chevrons (Visible on Hover / Mobile tap) */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous photo"
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer focus:opacity-100"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next photo"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer focus:opacity-100"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`Go to photo ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-4 h-1.5 bg-saffron'
                    : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FounderPortraitSlider;
