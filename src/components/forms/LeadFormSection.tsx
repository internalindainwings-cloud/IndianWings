'use client';

import React, { useState, useRef } from 'react';
import { Play } from 'lucide-react';
import { EnquiryForm } from './EnquiryForm';

interface LeadFormSectionProps {
  videoUrl?: string;
  posterUrl?: string;
}

export const LeadFormSection: React.FC<LeadFormSectionProps> = ({
  videoUrl = 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.mp4',
  posterUrl = 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePauseVideo = () => {
    setIsPlaying(false);
  };

  return (
    <section 
      id="quote" 
      className="w-full bg-white pt-4 sm:pt-5 lg:pt-3 pb-8 sm:pb-12 px-3 sm:px-6 md:px-8 border-b border-black/[0.08] scroll-mt-20"
    >
      <div className="max-w-[1160px] mx-auto w-full relative group/card">
        
        {/* Contained tight blur halo — strictly hugs card border, 0 section-wide spread, visibly glows on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-saffron/25 via-sky-500/15 to-midnight/20 rounded-3xl blur-md opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Unified Luxury Master Card — Frosted Glass & Backdrop Blur on Hover */}
        <div className="relative z-10 bg-white hover:bg-white/90 backdrop-blur-none hover:backdrop-blur-xl rounded-2xl border border-black/[0.08] hover:border-black/15 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(11,31,42,0.1)] transition-all duration-500 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* 1. Left Column: Lead Enquiry Form Panel (5 Cols) — Shifted left */}
          <div className="lg:col-span-5 p-3.5 sm:p-5 md:p-6 flex flex-col justify-between">
            <div className="mb-2.5 pb-2 border-b border-midnight/10">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-manrope font-bold uppercase tracking-[0.14em] text-midnight/70 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron" />
                <span>Get Custom Quote</span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-playfair text-lg sm:text-xl md:text-2xl font-bold text-midnight leading-tight">
                  Tell Us About Your Trip
                </h3>
              </div>
            </div>

            <EnquiryForm isCompact={true} touchBottom={true} />
          </div>

          {/* 2. Right Column: Widescreen Video Showcase Panel (7 Cols) — Expanded wide to the right */}
          <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[220px] sm:min-h-[280px] lg:min-h-0 lg:h-full bg-midnight overflow-hidden flex items-center justify-center mt-3 sm:mt-4 lg:mt-0 mx-3 mb-3 sm:mx-4.5 sm:mb-4.5 lg:m-0 rounded-xl lg:rounded-none border border-black/10 lg:border-t-0 lg:border-l lg:border-midnight/10 group/panel">
            
            {/* Background / Video Player — Smoothly blurs on hover when paused */}
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ${!isPlaying ? 'group-hover/panel:blur-[3px] group-hover/panel:scale-105' : ''}`}
              controls={isPlaying}
              playsInline
              onPause={handlePauseVideo}
              onEnded={handlePauseVideo}
            />

            {/* Ambient cinematic gradient overlay with backdrop-blur on hover (when paused) */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/25 to-midnight/40 transition-all duration-300 pointer-events-none" />
            )}

            {/* Top Floating Glass Badge */}
            <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-midnight/80 backdrop-blur-md border border-white/20 text-warm-white text-[10px] sm:text-[10.5px] font-manrope font-semibold shadow-md pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
              <span>Itinerary Walkthrough</span>
            </div>

            {/* Play Button & Interactive Overlay (When paused) */}
            {!isPlaying && (
              <button
                type="button"
                onClick={handlePlayVideo}
                aria-label="Play itinerary walkthrough video"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer p-4 group"
              >
                {/* Glowing Play Circle */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-saffron text-midnight flex items-center justify-center shadow-[0_6px_24px_rgba(245,166,35,0.4)] group-hover:scale-105 group-active:scale-95 transition-all duration-300">
                  <Play size={20} className="fill-midnight ml-0.5 sm:size-[22px]" />
                </div>
                <span className="mt-2 sm:mt-2.5 text-[11px] sm:text-xs font-manrope font-bold text-warm-white tracking-wide bg-midnight/85 backdrop-blur-md px-3 sm:px-3.5 py-1 rounded-full border border-white/20 shadow-md group-hover:border-saffron/60 transition-colors">
                  Watch Video &amp; Plan Itinerary
                </span>
              </button>
            )}

            {/* Bottom Duration Badge (When paused) */}
            {!isPlaying && (
              <div className="absolute bottom-2.5 sm:bottom-3 right-3 sm:right-3.5 z-20 flex items-center justify-end text-[10px] sm:text-[10.5px] font-manrope font-medium text-warm-white/85 pointer-events-none">
                <span className="bg-black/45 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 shrink-0">
                  1:00 MIN
                </span>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
