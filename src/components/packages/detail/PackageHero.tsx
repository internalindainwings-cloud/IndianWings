'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Clock,
  Play,
  ArrowRight,
  X,
  Sparkles,
  Calendar,
  Download,
  ShieldCheck,
  Users,
  ChevronRight,
  ChevronLeft,
  Gift,
} from 'lucide-react';
import type { EnrichedPackage } from '@/data/package-defaults';
import { getCategoryLabel, getBestForLabel } from '@/lib/utilities/slug';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import { DownloadItineraryModal } from './DownloadItineraryModal';

interface PackageHeroProps {
  pkg: EnrichedPackage;
}

export const PackageHero: React.FC<PackageHeroProps> = ({ pkg }) => {
  const { openModal } = useEnquiryModal();
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const allMediaImages = [pkg.imageUrl, ...(pkg.galleryUrls || [])].filter(Boolean);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);
  const [mediaMode, setMediaMode] = useState<'video' | 'image'>(pkg.videoUrl ? 'video' : 'image');

  // YouTube embed helper
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=1&playsinline=1&rel=0`;
    }
    return null;
  };

  const ytEmbedUrl = pkg.videoUrl ? getYouTubeEmbedUrl(pkg.videoUrl) : null;

  const discountPercent =
    pkg.originalPrice && pkg.originalPrice > pkg.startingPrice
      ? Math.round(((pkg.originalPrice - pkg.startingPrice) / pkg.originalPrice) * 100)
      : null;

  // Format Duration matching sketch format (e.g. 6N / 7D)
  const formatDurationBadge = (durationStr: string) => {
    const dMatch = durationStr.match(/(\d+)\s*D(?:ays?)?/i);
    const nMatch = durationStr.match(/(\d+)\s*N(?:ights?)?/i);
    const days = dMatch ? parseInt(dMatch[1], 10) : 6;
    const nights = nMatch ? parseInt(nMatch[1], 10) : Math.max(1, days - 1);
    return {
      compact: `${nights}N / ${days}D`,
      full: `${days} Days / ${nights} Nights`,
    };
  };

  const durationInfo = formatDurationBadge(pkg.duration);
  const categoryLabel = getCategoryLabel(pkg.categorySlug || pkg.tag);
  const bestForLabel = getBestForLabel(pkg.categorySlug || pkg.tag);

  // Derive Primary Route
  const primaryRoute =
    pkg.destinations && pkg.destinations.length > 0
      ? `${pkg.destinations.join(' ➔ ')}${
          pkg.destinations.length > 1 &&
          !pkg.destinations[pkg.destinations.length - 1].toLowerCase().includes('srinagar')
            ? ' ➔ Srinagar'
            : ''
        }`
      : 'Srinagar ➔ Gulmarg ➔ Pahalgam ➔ Srinagar';

  return (
    <section className="relative text-[#0B1F2A] pt-[76px] sm:pt-[99px] pb-4 sm:pb-6">
      {/* Container: Natural breathing room on mobile, exact fixed landing height on desktop */}
      <div className="container-custom flex flex-col h-auto sm:h-[calc(100dvh-135px)] sm:max-h-[540px] sm:min-h-[440px]">
        
        {/* ── HERO CONTAINER (Desktop: fixed contained height, Mobile: natural card) ── */}
        <div className="w-full rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-lg overflow-hidden flex flex-col sm:flex-1 sm:min-h-0 transition-all duration-300">
          
          {/* ── TOP HALF: Media Player / Photo Showcase & H1 (Fixed generous 260px height on mobile) ── */}
          <div className="relative w-full h-[260px] sm:h-auto sm:flex-1 sm:min-h-0 bg-slate-950 overflow-hidden group">
            {/* Active Media: Video vs Image */}
            {mediaMode === 'video' && pkg.videoUrl ? (
              <div className="absolute inset-0 w-full h-full bg-black">
                {ytEmbedUrl ? (
                  <iframe
                    src={ytEmbedUrl}
                    title={`${pkg.title} Walkthrough Video`}
                    className="w-full h-full object-cover border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={pkg.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : (
              <Image
                src={allMediaImages[selectedImageIdx] || pkg.imageUrl}
                alt={pkg.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            )}

            {/* Gradient Overlay for high-contrast typography (pointer-events-none so video controls remain clickable) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 pointer-events-none" />

            {/* Top Floating Badges */}
            <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
              <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
                <span className="px-2.5 py-1 rounded-full bg-saffron text-midnight text-xs font-extrabold shadow-md flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {categoryLabel}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-md">
                  {durationInfo.compact}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold border border-emerald-400/30 shadow-md">
                  <ShieldCheck className="h-3 w-3 text-emerald-200" />
                  Private / Custom
                </span>
              </div>

              {/* Trust Rating */}
              <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md pointer-events-auto shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                <span className="text-xs font-bold text-midnight">{pkg.rating}</span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  ({pkg.reviewCount})
                </span>
              </div>
            </div>

            {/* ── Floating Navigation: '>' Right Sign to switch from video to photo or next photo ── */}
            {allMediaImages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (mediaMode === 'video') {
                    setMediaMode('image');
                    setSelectedImageIdx(0);
                  } else {
                    setSelectedImageIdx((prev) => (prev + 1) % allMediaImages.length);
                  }
                }}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md shadow-xl border border-white/30 transition-all hover:scale-110 cursor-pointer active:scale-95 group"
                aria-label="View photos / next photo"
                title={mediaMode === 'video' ? 'View Photos >' : 'Next Photo >'}
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}

            {/* ── Floating Navigation: '<' Left Sign to return to video or previous photo ── */}
            {((mediaMode === 'image' && pkg.videoUrl) || (mediaMode === 'image' && selectedImageIdx > 0)) && (
              <button
                type="button"
                onClick={() => {
                  if (selectedImageIdx === 0 && pkg.videoUrl) {
                    setMediaMode('video');
                  } else {
                    setSelectedImageIdx((prev) => (prev - 1 + allMediaImages.length) % allMediaImages.length);
                  }
                }}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md shadow-xl border border-white/30 transition-all hover:scale-110 cursor-pointer active:scale-95 group"
                aria-label="Back to video / previous photo"
                title={selectedImageIdx === 0 && pkg.videoUrl ? '< Back to Video Tour' : '< Previous Photo'}
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:-translate-x-0.5" />
              </button>
            )}

            {/* Thumbnail & Media Switcher Strip (bottom right corner of media container) */}
            <div className="absolute bottom-16 sm:bottom-14 right-3 sm:right-4 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-lg border border-white/20">
              {/* Video button tab if package has a video walkthrough */}
              {pkg.videoUrl && (
                <button
                  type="button"
                  onClick={() => setMediaMode('video')}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] sm:text-xs font-bold border transition-all cursor-pointer ${
                    mediaMode === 'video'
                      ? 'bg-saffron text-midnight border-saffron shadow-sm scale-105'
                      : 'bg-black/40 text-white/80 border-white/20 hover:text-white'
                  }`}
                  title="Watch Video Walkthrough"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Video</span>
                </button>
              )}

              {/* Photo Thumbnails */}
              {allMediaImages.slice(0, 3).map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMediaMode('image');
                    setSelectedImageIdx(idx);
                  }}
                  className={`relative w-8 h-6 sm:w-10 sm:h-7 rounded overflow-hidden border transition-all cursor-pointer ${
                    mediaMode === 'image' && selectedImageIdx === idx
                      ? 'border-saffron ring-1 ring-saffron scale-105'
                      : 'border-white/30 opacity-70 hover:opacity-100'
                  }`}
                  title={`View Photo ${idx + 1}`}
                >
                  <Image src={url} alt={`${pkg.title} scene ${idx + 1}`} fill sizes="40px" className="object-cover" />
                </button>
              ))}
            </div>

            {/* Bottom of Top Half: H1 (Package Name) */}
            <div className="absolute bottom-2.5 left-3 right-3 sm:bottom-3.5 sm:left-4 sm:right-4 z-10 pointer-events-none">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-md leading-tight">
                {pkg.title}
              </h1>
            </div>
          </div>

          {/* ── BOTTOM HALF: Details (Spacious, Clean, Uncluttered) ── */}
          <div className="shrink-0 p-3 sm:p-5 bg-white space-y-2.5 sm:space-y-3">
            
            {/* Row 1: Duration, Type & Best For */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#d98f5b] shrink-0" />
                <span className="font-semibold text-slate-900">Duration:</span>
                <span className="font-bold text-[#0B1F2A] bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                  {durationInfo.full}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-900">Type:</span>
                <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 text-xs">
                  Private Cab & Stays
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span className="font-semibold text-slate-900">Best For:</span>
                <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                  {bestForLabel}
                </span>
              </div>
            </div>

            {/* Row 2: Primary Route */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 min-w-0">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5 shrink-0">
                <MapPin className="h-3.5 w-3.5 text-saffron shrink-0" />
                Route:
              </span>
              <span className="font-medium text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-xs truncate max-w-full">
                {primaryRoute}
              </span>
            </div>

            {/* Row 3: Key Highlights */}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <div className="flex items-start sm:items-center gap-2 text-xs sm:text-sm min-w-0">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5 shrink-0 mt-0.5 sm:mt-0">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  Highlights:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {pkg.highlights.map((hl, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200/90 text-xs font-medium text-slate-800 whitespace-nowrap shrink-0"
                    >
                      <span>{hl}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Row 4: Starting Price & Action Buttons */}
            <div className="pt-2.5 sm:pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Starting Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-slate-500">Starting from</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0B1F2A]">
                  ₹{pkg.startingPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-medium capitalize">/ {pkg.priceUnit || 'per person'}</span>
                {pkg.originalPrice && (
                  <span className="text-xs font-mono text-slate-400 line-through ml-1">
                    ₹{pkg.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 ml-1">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openModal({
                      packageTitle: `${pkg.title} (${durationInfo.compact})`,
                      defaultTripType: pkg.title,
                      source: `package_detail_hero_${pkg.slug}`,
                    })
                  }
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-saffron hover:bg-amber-500 px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-midnight shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  <span>Book / Enquire</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('itinerary');
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.pageYOffset - 140;
                      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2.5 sm:py-3 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                  title="Scroll to Day-by-Day Itinerary"
                >
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>Itinerary</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDownloadModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2.5 sm:py-3 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                  title="Download PDF Itinerary"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Video Modal Dialog ── */}
      {videoModalOpen && pkg.videoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-black border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-video w-full">
              {pkg.videoUrl.includes('youtube.com') || pkg.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={pkg.videoUrl.replace('watch?v=', 'embed/')}
                  title={pkg.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={pkg.videoUrl} controls autoPlay className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Download Itinerary Modal ── */}
      <DownloadItineraryModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        pkg={pkg}
      />
    </section>
  );
};
