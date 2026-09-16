'use client';
import React from 'react';
import { WrittenReview } from '@/types/review-types';
import ReviewCard from './ReviewCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WrittenReviewCarouselProps {
  reviews: WrittenReview[];
}

export default function WrittenReviewCarousel({ reviews }: WrittenReviewCarouselProps) {
  // Simple scroll-based carousel for scalability.
  // For 300+ reviews, we would implement a virtualized swiper here.
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      
      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 md:gap-6 pb-6 pt-2 hide-scrollbar snap-x snap-mandatory"
      >
        {reviews.map((review) => (
          <div key={review.id} className="snap-start">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>

      {/* Desktop Controls (Optional, as native scroll works too) */}
      <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -left-12 -right-12 justify-between pointer-events-none">
        <button 
          onClick={() => scroll('left')}
          className="w-10 h-10 rounded-full bg-white border border-[#0B1F2A]/10 flex items-center justify-center text-[#0B1F2A] hover:bg-slate-50 hover:shadow-sm transition-all pointer-events-auto opacity-0 group-hover:opacity-100"
          aria-label="Previous review"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={() => scroll('right')}
          className="w-10 h-10 rounded-full bg-white border border-[#0B1F2A]/10 flex items-center justify-center text-[#0B1F2A] hover:bg-slate-50 hover:shadow-sm transition-all pointer-events-auto opacity-0 group-hover:opacity-100"
          aria-label="Next review"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
    </div>
  );
}
