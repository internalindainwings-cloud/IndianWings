'use client';

import React, { useState } from 'react';
import {
  Headphones,
  Building2,
  Car,
  BadgeCheck,
  Compass,
  Award,
  Zap,
  Lock,
  Play,
  X,
  Maximize2,
} from 'lucide-react';
import { videoReviews } from '@/data/video-reviews';

const GOOGLE_MAPS_URL = 'https://maps.google.com/?q=Khanyar+Chowk+Srinagar+Jammu+and+Kashmir+190003';

// 9 Concise Trust / Benefit Items for the 3x3 Mobile Dashboard Grid
const TRUST_ITEMS = [
  {
    id: 'google-review',
    icon: 'google',
    title: '4.9★ Rated',
    subtitle: 'Google Verified',
  },
  {
    id: 'ground-support',
    icon: 'headphones',
    title: '24/7 Support',
    subtitle: 'Local Team',
  },
  {
    id: 'verified-stays',
    icon: 'building',
    title: 'Verified Stays',
    subtitle: '4★ & Luxury',
  },
  {
    id: 'private-cabs',
    icon: 'car',
    title: 'Private Cabs',
    subtitle: 'Dedicated Driver',
  },
  {
    id: 'no-hidden-costs',
    icon: 'badge-check',
    title: 'No Hidden Fee',
    subtitle: '100% Transparent',
  },
  {
    id: 'custom-plans',
    icon: 'compass',
    title: 'Custom Plans',
    subtitle: 'Flexible Dates',
  },
  {
    id: 'valley-roots',
    icon: 'award',
    title: '15+ Yrs Roots',
    subtitle: 'Kashmir Locals',
  },
  {
    id: 'instant-quote',
    icon: 'zap',
    title: 'Instant Quote',
    subtitle: 'Free Itinerary',
  },
  {
    id: 'secure-booking',
    icon: 'lock',
    title: 'Safe Booking',
    subtitle: 'Direct Assistance',
  },
];

export const LandingTrustStrip: React.FC = () => {
  const [activeMedia, setActiveMedia] = useState<{
    type: 'video' | 'image';
    url: string;
    title: string;
    subtitle?: string;
  } | null>(null);

  const renderTrustIcon = (iconType: string) => {
    switch (iconType) {
      case 'google':
        return (
          <div className="w-5 h-5 bg-white rounded-full p-0.5 flex items-center justify-center shadow-2xs">
            <svg className="w-full h-full" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
          </div>
        );
      case 'headphones':
        return <Headphones size={18} className="text-white" />;
      case 'building':
        return <Building2 size={18} className="text-white" />;
      case 'car':
        return <Car size={18} className="text-white" />;
      case 'badge-check':
        return <BadgeCheck size={18} className="text-white" />;
      case 'compass':
        return <Compass size={18} className="text-white" />;
      case 'award':
        return <Award size={18} className="text-white" />;
      case 'zap':
        return <Zap size={18} className="text-white" />;
      case 'lock':
      default:
        return <Lock size={18} className="text-white" />;
    }
  };

  const featuredVideo = videoReviews[0];
  const video2 = videoReviews[1];
  const video3 = videoReviews[2];

  return (
    <section id="why-us" className="w-full bg-white text-slate-900 border-t border-slate-100 relative z-20 py-6 sm:py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── 1. SECTION HEADER (DESKTOP & MOBILE) ── */}
        <div className="text-center mb-6 sm:mb-8">
          {/* Google Reviews Badge Pill */}
          <div className="inline-flex items-center gap-2 mb-3">
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 transition-all shadow-xs group hover:scale-[1.02]"
              aria-label="View verified Google Reviews for The Indian Wings Company"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>Rated <strong>4.9/5</strong> on Google Reviews</span>
              <span className="text-[#FBBC05] ml-0.5">★★★★★</span>
              <span className="text-[#B48827] ml-0.5">→</span>
            </a>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#122986] tracking-tight">
            Why Travel With Us
          </h2>
          <div className="w-16 h-[2.5px] bg-[#E6B84A] mx-auto mt-2 rounded-full" />
        </div>

        {/* ── 2. 9 TRUST TABS (VISIBLE ON DESKTOP & MOBILE IN ETRIPTO ROYAL BLUE #122986) ── */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4 max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.id}
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#122986]/[0.05] hover:bg-[#122986]/[0.10] border border-[#122986]/20 hover:border-[#122986]/45 flex flex-col items-center justify-center text-center gap-2 sm:gap-2.5 transition-all shadow-xs group"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#122986] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform">
                {renderTrustIcon(item.icon)}
              </div>
              <span className="text-[11px] min-[360px]:text-[12px] sm:text-[13px] md:text-sm font-bold text-[#122986] tracking-tight truncate max-w-full leading-tight">
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* ── 3. EXACT WANDERKASHMIR BENTO GALLERY FOR VIDEO STORIES & GUEST MOMENTS ── */}
        <div className="mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-slate-100">
          <div className="text-center mb-4 sm:mb-5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#B48827]">
              Real Travellers, Real Experiences
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#071936] mt-0.5 tracking-tight">
              Guest Video Stories & Moments
            </h3>
            <div className="w-12 h-[2px] bg-[#E6B84A] mx-auto mt-1.5 rounded-full" />
          </div>

          {/* Exact WanderKashmir Bento Container: 1 col on mobile, 12 cols on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2.5 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xs max-w-5xl mx-auto">
            
            {/* Tile 1: Big Featured Video Card (Left: md:col-span-7 lg:col-span-8) */}
            <div
              onClick={() =>
                featuredVideo?.videoUrl &&
                setActiveMedia({
                  type: 'video',
                  url: featuredVideo.videoUrl,
                  title: `${featuredVideo.name}, ${featuredVideo.city}`,
                  subtitle: featuredVideo.quote,
                })
              }
              className="relative md:col-span-7 lg:col-span-8 h-[260px] sm:h-[340px] md:h-[400px] cursor-pointer group overflow-hidden bg-slate-900"
            >
              <img
                src={featuredVideo?.posterUrl || ''}
                alt={`Kashmir holiday video story by ${featuredVideo?.name}`}
                className="object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out absolute inset-0 w-full h-full"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

              {/* Big Royal Blue Play Button in Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#122986] text-white flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#0d1e63] border border-white/20">
                  <Play size={22} fill="currentColor" className="ml-1" />
                </div>
              </div>

              {/* Top-Right Duration Badge */}
              <div className="absolute top-3 right-3 font-mono text-[11px] font-semibold bg-black/70 backdrop-blur-xs text-white px-2 py-0.5 rounded-md shadow-xs">
                {featuredVideo?.duration || '00:16'}
              </div>

              {/* Bottom Info Bar styled matching WanderKashmir's view badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2.5">
                <div className="text-left drop-shadow-md">
                  <p className="text-xs sm:text-sm md:text-base font-bold text-white line-clamp-1">
                    {featuredVideo?.quote}
                  </p>
                  <span className="text-[11px] sm:text-xs text-white/90 font-medium">
                    {featuredVideo?.name}, {featuredVideo?.city}
                  </span>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1.5 opacity-90 group-hover:opacity-100 shrink-0 border border-white/10"
                >
                  <Play size={11} fill="currentColor" />
                  <span>Watch Story</span>
                </button>
              </div>
            </div>

            {/* Right: 4 smaller grid cards (2x2 grid: md:col-span-5 lg:col-span-4) */}
            <div className="md:col-span-5 lg:col-span-4 grid grid-cols-2 gap-2 sm:gap-2.5 h-[260px] sm:h-[340px] md:h-[400px]">
              
              {/* Tile 2: Video 2 (Top Left) */}
              <div
                onClick={() =>
                  video2?.videoUrl &&
                  setActiveMedia({
                    type: 'video',
                    url: video2.videoUrl,
                    title: `${video2.name}, ${video2.city}`,
                    subtitle: video2.quote,
                  })
                }
                className="relative cursor-pointer group overflow-hidden bg-slate-900"
              >
                <img
                  src={video2?.posterUrl || ''}
                  alt={`Kashmir holiday story by ${video2?.name}`}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out absolute inset-0 w-full h-full"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Small Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#122986] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform border border-white/20">
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-2 right-2 font-mono text-[9px] sm:text-[10px] font-semibold bg-black/70 px-1.5 py-0.5 rounded text-white">
                  {video2?.duration || '00:22'}
                </div>

                <div className="absolute bottom-1.5 sm:bottom-2 left-2 right-2 text-left">
                  <span className="text-[11px] font-bold text-white block line-clamp-1 drop-shadow">
                    {video2?.name}
                  </span>
                  <span className="text-[10px] text-white/80 block line-clamp-1">
                    {video2?.city}
                  </span>
                </div>
              </div>

              {/* Tile 3: Video 3 (Top Right) */}
              <div
                onClick={() =>
                  video3?.videoUrl &&
                  setActiveMedia({
                    type: 'video',
                    url: video3.videoUrl,
                    title: `${video3.name}, ${video3.city}`,
                    subtitle: video3.quote,
                  })
                }
                className="relative cursor-pointer group overflow-hidden bg-slate-900"
              >
                <img
                  src={video3?.posterUrl || ''}
                  alt={`Kashmir holiday story by ${video3?.name}`}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out absolute inset-0 w-full h-full"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Small Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#122986] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform border border-white/20">
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>

                <div className="absolute top-2 right-2 font-mono text-[9px] sm:text-[10px] font-semibold bg-black/70 px-1.5 py-0.5 rounded text-white">
                  {video3?.duration || '01:57'}
                </div>

                <div className="absolute bottom-1.5 sm:bottom-2 left-2 right-2 text-left">
                  <span className="text-[11px] font-bold text-white block line-clamp-1 drop-shadow">
                    {video3?.name}
                  </span>
                  <span className="text-[10px] text-white/80 block line-clamp-1">
                    {video3?.city}
                  </span>
                </div>
              </div>

              {/* Tile 4: Real Guest Shikara & Dal Lake Moment (Bottom Left) */}
              <div
                onClick={() =>
                  setActiveMedia({
                    type: 'image',
                    url: '/images/gallery/shikara-dal-lake.jpg',
                    title: 'Dal Lake & Shikara Sunrise',
                    subtitle: 'Verified Guest Moment • Sameer & Tanvi, Bengaluru',
                  })
                }
                className="relative cursor-pointer group overflow-hidden bg-slate-900"
              >
                <img
                  src="/images/gallery/shikara-dal-lake.jpg"
                  alt="Dal Lake Shikara Guest Moment"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out absolute inset-0 w-full h-full"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                    <Maximize2 size={12} />
                  </div>
                </div>

                <div className="absolute bottom-1.5 sm:bottom-2 left-2 right-2 text-left">
                  <span className="text-[11px] font-bold text-white block line-clamp-1 drop-shadow">
                    Dal Lake Shikara
                  </span>
                  <span className="text-[10px] text-white/80 block line-clamp-1">
                    Sameer & Tanvi
                  </span>
                </div>
              </div>

              {/* Tile 5: Gulmarg Snow Moment with EXACT WanderKashmir '+12 More Stories' Overlay (Bottom Right) */}
              <div
                onClick={() =>
                  featuredVideo?.videoUrl &&
                  setActiveMedia({
                    type: 'video',
                    url: featuredVideo.videoUrl,
                    title: 'Guest Kashmir Stories & Moments',
                    subtitle: 'Watch real experiences from our travellers across the valley',
                  })
                }
                className="relative cursor-pointer group overflow-hidden bg-slate-900"
              >
                <img
                  src="/images/gallery/gulmarg-snow.jpg"
                  alt="Gulmarg Snow Guest Moment"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out absolute inset-0 w-full h-full"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                
                {/* Exact WanderKashmir Bento Overlay */}
                <div className="absolute inset-0 bg-black/65 backdrop-blur-2xs flex flex-col items-center justify-center text-white text-center p-2 group-hover:bg-black/75 transition-colors">
                  <span className="text-base sm:text-lg font-extrabold tracking-tight">
                    +12
                  </span>
                  <span className="text-[11px] font-semibold text-white/90">
                    More Stories
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Media Modal Player (Supports Video & Photo lightbox) */}
      {activeMedia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar with Title and Close Button */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/80 border-b border-white/10 z-10">
              <div className="min-w-0 pr-3">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {activeMedia.title}
                </h4>
                {activeMedia.subtitle && (
                  <p className="text-[11px] text-white/70 truncate">
                    {activeMedia.subtitle}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveMedia(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close preview"
              >
                <X size={16} />
              </button>
            </div>

            {/* Media Body */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              {activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

