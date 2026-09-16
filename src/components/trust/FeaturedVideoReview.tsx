'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { VideoReview } from '@/types/review-types';

export default function FeaturedVideoReview({ review }: { review: VideoReview }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative w-full rounded-[32px] overflow-hidden group aspect-[4/5] sm:aspect-[3/4] md:aspect-auto md:h-full bg-slate-900">
      <Image
        src={review.posterUrl}
        alt={review.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
        className={`object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'group-hover:scale-105'}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F2A]/90 via-[#0B1F2A]/20 to-transparent"></div>
      
      {!isPlaying && (
        <button 
          onClick={() => setIsPlaying(true)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        >
          <Play size={32} className="text-white ml-2" fill="currentColor" />
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
        <div className="space-y-4">
          <p className="font-manrope font-bold text-2xl md:text-3xl text-white mb-2">
            &quot;{review.quote}&quot;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-6 h-[1px] bg-saffron"></div>
            <span className="font-manrope font-medium text-white text-sm md:text-base">
              {review.name}, {review.city}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
