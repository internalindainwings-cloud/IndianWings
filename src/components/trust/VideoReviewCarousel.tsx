'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { VideoReview } from '@/types/review-types';

interface VideoReviewCarouselProps {
  reviews: VideoReview[];
}

export default function VideoReviewCarousel({ reviews }: VideoReviewCarouselProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  return (
    <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
      <div className="flex flex-nowrap lg:grid lg:grid-cols-1 gap-4 md:gap-6 min-w-max lg:min-w-0 h-full">
        {reviews.map((review) => (
          <SmallVideoCard 
            key={review.id} 
            review={review} 
            isPlaying={playingId === review.id}
            onPlay={() => setPlayingId(review.id)}
          />
        ))}
      </div>
    </div>
  );
}

function SmallVideoCard({ review, isPlaying, onPlay }: { review: VideoReview, isPlaying: boolean, onPlay: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      className="relative w-[280px] sm:w-[320px] lg:w-full aspect-video rounded-[16px] overflow-hidden group cursor-pointer flex-shrink-0 bg-[#0B1F2A]"
      onClick={onPlay}
    >
      {!isPlaying || !review.videoUrl ? (
        review.posterUrl && !imgError ? (
          <Image
            src={review.posterUrl}
            alt={`Review by ${review.name}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 320px, 33vw"
            onError={() => setImgError(true)}
          />
        ) : null
      ) : (
        <video 
          src={review.videoUrl} 
          controls 
          autoPlay
          preload="none"
          className="w-full h-full object-cover"
        />
      )}

      {(!isPlaying || !review.videoUrl) && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F2A]/90 via-[#0B1F2A]/20 to-transparent"></div>
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 transition-transform duration-300 group-hover:scale-110"
              aria-label={`Play review from ${review.name}`}
            >
              <Play className="text-white ml-1" size={18} fill="currentColor" />
            </button>
          </div>
          
          {/* Content */}
          <div className="absolute bottom-4 left-4 pr-12">
            <p className="font-manrope font-semibold text-[15px] sm:text-base text-white mb-2 leading-tight line-clamp-2">
              {review.quote}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-4 h-[1px] bg-[#222222]"></div>
              <span className="font-manrope text-xs sm:text-sm text-[#222222]">
                {review.name}, {review.city}
              </span>
            </div>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
            <span className="font-manrope text-[10px] sm:text-xs text-white">
              {review.duration}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
