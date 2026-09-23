import React from 'react';

interface HeroSlideIndicatorProps {
  totalSlides: number;
  currentSlide: number;
  onChangeSlide: (index: number) => void;
}

export const HeroSlideIndicator: React.FC<HeroSlideIndicatorProps> = ({ 
  totalSlides, 
  currentSlide, 
  onChangeSlide 
}) => {
  return (
    <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-5 items-end">
      {Array.from({ length: totalSlides }).map((_, idx) => {
        const isActive = currentSlide === idx;
        const numberStr = (idx + 1).toString().padStart(2, '0');
        
        return (
          <button
            key={idx}
            onClick={() => onChangeSlide(idx)}
            className="flex items-center gap-3 group"
            aria-label={`Go to slide ${idx + 1}`}
          >

            <span 
              className={`block transition-all duration-300 ${
                isActive ? 'w-8 h-[2px] bg-[#C5A45E]' : 'w-4 h-px bg-warm-white/30 group-hover:bg-warm-white/60 group-hover:w-6'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
