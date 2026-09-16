'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mountain, Calendar, ArrowRight, Check } from 'lucide-react';
import { DestinationItem } from '@/data/destinations';

interface DestinationCardProps {
  destination: DestinationItem;
  index: number;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  return (
    <div 
      id={destination.id}
      className="group bg-white rounded-2xl overflow-hidden border border-black/8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left scroll-mt-28"
    >
      {/* 1. Destination Image with Link to Detail Page */}
      <Link 
        href={`/destinations/${destination.slug}`}
        className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 block"
        aria-label={`View ${destination.name} destination details`}
      >
        <Image
          src={destination.imageUrl}
          alt={destination.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex items-center justify-end pointer-events-none z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-midnight/85 backdrop-blur-md text-warm-white text-[11px] font-manrope font-semibold border border-white/15 shadow-xs">
            <Mountain size={11} className="text-saffron" />
            <span>{destination.elevation.split(' ')[0]}</span>
          </span>
        </div>

        {/* Distance Gradient Strip */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-6 flex items-end justify-between text-white pointer-events-none">
          <span className="inline-flex items-center gap-1 text-[11px] font-manrope font-medium text-warm-white/90">
            <MapPin size={12} className="text-saffron shrink-0" />
            <span>{destination.distanceFromSrinagar}</span>
          </span>

          <span className="text-[11px] font-manrope font-medium text-warm-white/75 flex items-center gap-1">
            <Calendar size={11} className="text-saffron" />
            <span>{destination.bestSeason.split('/')[0].trim()}</span>
          </span>
        </div>
      </Link>

      {/* 2. Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3.5 bg-white">
        <div className="space-y-2">
          {/* Destination Name & Tagline */}
          <div>
            <Link 
              href={`/destinations/${destination.slug}`}
              className="focus:outline-none focus-visible:ring-1 focus-visible:ring-saffron rounded-sm"
            >
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#0B1F2A] leading-snug group-hover:text-saffron transition-colors">
                {destination.name}
              </h3>
            </Link>
            <p className="font-manrope text-xs text-saffron font-semibold mt-0.5">
              {destination.tagline}
            </p>
          </div>

          {/* Description */}
          <p className="font-manrope text-[13px] text-[#64748B] leading-relaxed line-clamp-2">
            {destination.description}
          </p>

          {/* Highlights */}
          <div className="pt-2 border-t border-black/5 space-y-1">
            {destination.highlights.slice(0, 2).map((hl, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs font-manrope text-[#475569]">
                <Check size={12} className="text-emerald-600 shrink-0" />
                <span className="truncate">{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Action / Route Link to Destination Detail */}
        <div className="pt-3 border-t border-black/5 flex items-center justify-between">
          <span className="text-xs font-manrope font-semibold text-[#0B1F2A]">
            {destination.packageCount} Tailored Itineraries
          </span>

          <Link
            href={`/destinations/${destination.slug}`}
            className="px-3.5 py-2 rounded-full bg-midnight hover:bg-[#163647] text-warm-white font-manrope font-bold text-xs tracking-wide transition-all duration-200 shadow-xs flex items-center gap-1.5 active:scale-98 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
            aria-label={`Explore ${destination.name} travel details`}
          >
            <span>Explore</span>
            <ArrowRight size={12} className="text-saffron" />
          </Link>
        </div>
      </div>
    </div>
  );
};
