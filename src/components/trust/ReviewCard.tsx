'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { WrittenReview } from '@/types/review-types';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  review: WrittenReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-[20px] p-6 sm:p-8 flex flex-col h-full border border-black/5 shadow-sm hover:shadow-md transition-shadow duration-300 w-[280px] sm:w-[320px] md:w-full flex-shrink-0">
      
      {/* Header: Avatar & Stars */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-200">
          {review.avatarUrl && !imgError && (
            <Image 
              src={review.avatarUrl}
              alt={review.name}
              fill
              sizes="48px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} size={14} className="text-[#0B1F2A]" fill="currentColor" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Review Text */}
      <div className="flex-grow">
        <p className="font-manrope text-[15px] leading-relaxed text-[#0B1F2A]/80 font-normal">
          {review.review}
        </p>
      </div>

      {/* Author */}
      <div className="mt-6 pt-4 border-t border-black/5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-[1px] bg-[#222222]"></div>
          <span className="font-manrope font-semibold text-sm text-[#0B1F2A]">
            {review.name}
          </span>
        </div>
        <span className="font-manrope text-xs text-[#64748B] block mt-1 ml-6">
          {review.city}
        </span>
      </div>
    </div>
  );
}
