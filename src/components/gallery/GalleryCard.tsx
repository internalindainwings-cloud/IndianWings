'use client';

import React from 'react';
import Image from 'next/image';
import { Star, MapPin, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { GalleryReviewItem } from '@/data/gallery-reviews';

interface GalleryCardProps {
  item: GalleryReviewItem;
  onClick: () => void;
  index: number;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ item, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-black/8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer select-none text-left w-full p-0"
    >
      {/* 1. Unobstructed Travel Photo (Consistent Aspect Ratio) */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Minimal Gradient only at top corners for badge contrast */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>

        {/* Top Badges: Location & View Indicator */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-midnight/80 backdrop-blur-md text-warm-white text-[11px] font-manrope font-semibold border border-white/10 shadow-xs">
            <MapPin size={11} className="text-saffron shrink-0" />
            <span className="truncate max-w-[170px]">{item.location}</span>
          </span>

          <span className="w-7 h-7 rounded-full bg-white/20 group-hover:bg-saffron backdrop-blur-md text-white group-hover:text-midnight flex items-center justify-center transition-all duration-200 border border-white/20 shadow-xs">
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>

      {/* 2. Structured, Consistent Review Content (Under the photo) */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3 bg-white">
        <div className="space-y-2">
          {/* Star Rating & Verified Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(item.rating)].map((_, i) => (
                <Star key={i} size={13} className="text-saffron fill-saffron" />
              ))}
              <span className="text-[#0B1F2A] text-xs font-mono font-bold ml-1">5.0</span>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-manrope font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
              <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
              Verified
            </span>
          </div>

          {/* Short, Real Human Highlight */}
          <p className="font-manrope text-[13.5px] sm:text-[14px] text-[#0B1F2A] font-bold leading-snug line-clamp-2">
            &ldquo;{item.highlightQuote}&rdquo;
          </p>
        </div>

        {/* Guest Metadata & Action */}
        <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs font-manrope">
          <div className="truncate pr-2">
            <span className="font-semibold text-[#0B1F2A] truncate block">{item.guestName}</span>
            <span className="text-[#64748B] text-[11px]">{item.guestLocation} • {item.travelDate}</span>
          </div>

          <span className="shrink-0 text-saffron font-bold text-xs group-hover:underline flex items-center gap-0.5">
            Photos &rarr;
          </span>
        </div>
      </div>
    </button>
  );
};
