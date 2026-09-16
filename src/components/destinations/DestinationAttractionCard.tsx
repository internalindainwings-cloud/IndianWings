'use client';

import React from 'react';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { DestinationAttraction } from '@/data/destination-content';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

interface DestinationAttractionCardProps {
  attraction: DestinationAttraction;
}

export const DestinationAttractionCard: React.FC<DestinationAttractionCardProps> = ({ attraction }) => {
  const { openModal } = useEnquiryModal();

  return (
    <div 
      className="group bg-white rounded-xl overflow-hidden border border-black/[0.08] shadow-sm hover:shadow-md hover:border-black/15 transition-all duration-300 flex flex-col justify-between text-left"
    >
      {/* 1. Image Container */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-black/5">
        <Image
          src={attraction.imageUrl}
          alt={attraction.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        
        {/* Category Subtitle Pill */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-midnight/80 backdrop-blur-md text-[10px] sm:text-[11px] font-manrope font-semibold text-warm-white/90 border border-white/15 shadow-xs">
            {attraction.subtitle}
          </span>
        </div>

        {/* Duration badge if exists */}
        {attraction.duration && (
          <div className="absolute bottom-2 left-2.5 z-10">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-manrope font-medium text-warm-white/90">
              <Clock size={11} className="text-saffron shrink-0" />
              <span>{attraction.duration}</span>
            </span>
          </div>
        )}
      </div>

      {/* 2. Content Body */}
      <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
        <div className="space-y-1 sm:space-y-1.5">
          <h3 className="font-serif text-sm sm:text-base lg:text-lg font-semibold text-[#0B1F2A] leading-snug group-hover:text-saffron transition-colors line-clamp-1">
            {attraction.name}
          </h3>
          <p className="font-sans text-[11px] sm:text-xs lg:text-[13px] text-[#64748B] leading-relaxed line-clamp-2 sm:line-clamp-3">
            {attraction.description}
          </p>
        </div>

        {/* 3. Action */}
        <div className="pt-2 border-t border-black/[0.08] flex items-center justify-between">
          <button
            type="button"
            onClick={openModal}
            className="text-[11px] sm:text-xs font-manrope font-bold text-saffron hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Details</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationAttractionCard;
