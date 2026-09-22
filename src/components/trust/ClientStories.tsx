'use client';

import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Play, FileText, ArrowRight, ChevronLeft, ChevronRight, X, Star } from 'lucide-react';
import { videoReviews as fallbackVideoReviews } from '@/data/video-reviews';
import { writtenReviews as fallbackWrittenReviews } from '@/data/written-reviews';

const REVIEWS_PER_MOBILE_PAGE = 2;
const emptySubscribe = () => () => {};

export function ClientStories() {
  const [activeTab, setActiveTab] = useState<'video' | 'written'>('video');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileReviewPage, setMobileReviewPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [videoReviews, setVideoReviews] = useState(fallbackVideoReviews);
  const [writtenReviews, setWrittenReviews] = useState(fallbackWrittenReviews);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.reviews) {
          const fetchedVideos = data.reviews
            .filter((r: any) => r.type === 'video')
            .map((r: any) => ({
              id: r.id,
              quote: r.videoQuote || r.review,
              name: r.name,
              city: r.city,
              duration: r.videoDuration || '00:00',
              posterUrl: (r.videoUrl && r.videoUrl.trim() !== '') ? r.videoUrl.replace(/\.(mp4|webm|mov)$/i, '.jpg') : (r.imageUrl || ''),
              videoUrl: r.videoUrl || '',
              featured: r.featured
            }));
            
          const fetchedWritten = data.reviews
            .filter((r: any) => r.type === 'written')
            .map((r: any) => ({
              id: r.id,
              name: r.name,
              city: r.city,
              review: r.review,
              rating: r.rating || 5,
              avatarUrl: r.avatarUrl
            }));
            
          if (fetchedVideos.length > 0) setVideoReviews(fetchedVideos);
          if (fetchedWritten.length > 0) setWrittenReviews(fetchedWritten);
        }
      })
      .catch(err => console.error('Failed to fetch dynamic reviews:', err));
  }, []);

  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const selectedVideo = selectedVideoIndex !== null ? videoReviews[selectedVideoIndex] : null;

  const handleSelectVideo = (index: number) => {
    setSelectedVideoIndex(index);
    setIsPlaying(true);
  };

  const handlePrevVideo = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedVideoIndex((prev) => (prev !== null ? (prev - 1 + videoReviews.length) % videoReviews.length : null));
    setIsPlaying(true);
  };

  const handleNextVideo = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedVideoIndex((prev) => (prev !== null ? (prev + 1) % videoReviews.length : null));
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedVideoIndex === null) return;
      if (e.key === 'ArrowRight') {
        setSelectedVideoIndex((prev) => (prev !== null ? (prev + 1) % videoReviews.length : null));
        setIsPlaying(true);
      }
      if (e.key === 'ArrowLeft') {
        setSelectedVideoIndex((prev) => (prev !== null ? (prev - 1 + videoReviews.length) % videoReviews.length : null));
        setIsPlaying(true);
      }
      if (e.key === 'Escape') {
        setSelectedVideoIndex(null);
        setIsPlaying(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideoIndex]);

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-7 w-full">
      {/* Top Header: Ultra-Compact Single Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 pb-1">
        {/* Left: Single-Line Title */}
        <div className="flex items-center gap-3">
          <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl text-[#0B1F2A] font-bold tracking-tight">
            Traveller Stories &amp; Reviews
          </h2>
        </div>

        {/* Right: Segmented Toggle Tabs & View All */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Pill Tabs */}
          <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-full border border-black/[0.06]">
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full font-manrope text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-[#0B1F2A] text-white shadow-sm'
                  : 'text-[#0B1F2A]/70 hover:text-[#0B1F2A]'
              }`}
            >
              <Play size={12} fill="currentColor" />
              <span>Videos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('written');
                document.getElementById('traveller-reviews')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full font-manrope text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === 'written'
                  ? 'bg-[#0B1F2A] text-white shadow-sm'
                  : 'text-[#0B1F2A]/70 hover:text-[#0B1F2A]'
              }`}
            >
              <FileText size={12} />
              <span>Written</span>
            </button>
          </div>

          {/* View All Link */}
          <a
            href="#reviews"
            className="font-manrope font-semibold text-xs sm:text-[13px] text-[#0B1F2A] hover:text-saffron transition-colors flex items-center gap-1 group whitespace-nowrap"
          >
            <span>View All</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* Row 2: 3 Compact Video Story Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {videoReviews.map((review, idx) => (
          <button
            type="button"
            key={review.id}
            onClick={() => handleSelectVideo(idx)}
            className="relative rounded-xl overflow-hidden group cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 bg-slate-900 h-[190px] sm:h-[210px] md:h-[225px] select-none text-left w-full block border-0 p-0"
          >
            {/* Poster Image */}
            <Image
              src={review.posterUrl}
              alt={`Travel review by ${review.name}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              sizes="(max-width: 768px) 100vw, 33vw"
            />

            {/* Gradient Overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-opacity duration-300 group-hover:via-black/40 pointer-events-none" />

            {/* Compact Play Button in Center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/45 border border-white/70 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-saffron group-hover:border-transparent shadow-md pointer-events-none">
                <Play size={18} className="ml-0.5 text-white group-hover:text-[#0B1F2A]" fill="currentColor" />
              </div>
            </div>

            {/* Bottom Author & Location */}
            <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 flex items-end justify-between gap-2.5 pointer-events-none">
              <div className="space-y-0.5 max-w-[82%]">
                <p className="font-manrope font-bold text-white text-xs sm:text-[13.5px] leading-tight drop-shadow-sm truncate">
                  {review.name}
                </p>
                <p className="font-manrope text-white/85 text-[10.5px] sm:text-[11px] font-medium truncate">
                  {review.city}
                </p>
              </div>

              {/* Duration Badge */}
              <span className="shrink-0 bg-black/70 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/10">
                {review.duration}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Row 3: Traveller Reviews (Written Reviews Marquee Carousel - Same Transition as Brands) */}
      <div id="traveller-reviews" className="space-y-2.5 pt-2 sm:pt-3">
        {/* Traveller Reviews Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
            <h3 className="font-manrope font-bold uppercase tracking-[0.14em] text-xs sm:text-[13px] text-[#0B1F2A]/80">
              Verified Guest Reviews
            </h3>
          </div>
          <span className="text-[11px] font-manrope text-midnight/50 hidden sm:inline-block">
            Hover to pause
          </span>
        </div>

        {/* Continuous Marquee Carousel (Exact same animation as Brands) */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
          }}
        >
          <div
            className="flex gap-3 sm:gap-4 w-max animate-marquee-ltr hover:[animation-play-state:paused] py-1.5"
            aria-hidden="true"
          >
            {[...writtenReviews, ...writtenReviews, ...writtenReviews, ...writtenReviews].map((review, idx) => (
              <div
                key={`${review.id}-${idx}`}
                className="w-[270px] sm:w-[290px] md:w-[310px] shrink-0 bg-white rounded-xl p-3.5 sm:p-4 shadow-xs border border-black/[0.08] flex flex-col justify-between hover:shadow-md hover:border-black/20 hover:-translate-y-1 transition-all duration-300 select-none cursor-pointer"
              >
                <div>
                  {/* Top: Avatar + Name + Stars */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-black/10">
                        {review.avatarUrl ? (
                          <Image
                            src={review.avatarUrl}
                            alt={review.name}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#0B1F2A] flex items-center justify-center text-white font-manrope font-bold text-xs">
                            {review.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-manrope font-bold text-xs sm:text-[13px] text-[#0B1F2A] truncate">
                          {review.name}
                        </p>
                        <p className="font-manrope text-[10.5px] text-[#64748B] truncate">
                          {review.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={11} className="text-saffron fill-saffron" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="font-manrope text-xs sm:text-[12.5px] leading-relaxed text-[#334155] line-clamp-3">
                    &ldquo;{review.review.replace(/^[“"']|[”"']$/g, '')}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Player (Mounts via createPortal at document.body level with z-[99999]) */}
      {isClient && selectedVideo && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => {
            setSelectedVideoIndex(null);
            setIsPlaying(false);
          }}
        >
          {/* Floating High-Contrast Close Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedVideoIndex(null);
              setIsPlaying(false);
            }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[100000] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-saffron hover:text-[#0B1F2A] border border-white/40 text-white flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-md cursor-pointer"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>

          <div
            className="relative w-full max-w-xl sm:max-w-2xl bg-[#0B1F2A] rounded-2xl overflow-hidden shadow-2xl border border-white/10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-white/10 gap-3">
              <div className="min-w-0 flex-1">
                <h4 className="font-playfair font-medium text-white text-base sm:text-xl truncate">
                  {selectedVideo.name}&apos;s Kashmir Story
                </h4>
                <p className="font-manrope text-[11px] sm:text-xs text-white/60 mt-0.5">
                  {selectedVideo.city} • {selectedVideo.duration} • <span className="text-saffron font-medium">Story {(selectedVideoIndex ?? 0) + 1} of {videoReviews.length}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Prev/Next buttons in header */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevVideo}
                    className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-manrope text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    aria-label="Previous story"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextVideo}
                    className="px-2.5 sm:px-3 py-1.5 rounded-full bg-saffron hover:brightness-95 text-[#0B1F2A] font-manrope text-xs font-bold flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                    aria-label="Next story"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Close Button in header */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVideoIndex(null);
                    setIsPlaying(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Video / Player Area */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {/* Floating Left Arrow on Video */}
              <button
                type="button"
                onClick={handlePrevVideo}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-saffron hover:text-[#0B1F2A] border border-white/30 text-white flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-sm group cursor-pointer"
                aria-label="Previous story"
              >
                <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-0.5" />
              </button>

              {/* Floating Right Arrow on Video */}
              <button
                type="button"
                onClick={handleNextVideo}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-saffron hover:text-[#0B1F2A] border border-white/30 text-white flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-sm group cursor-pointer"
                aria-label="Next story"
              >
                <ChevronRight size={20} className="transition-transform group-hover:translate-x-0.5" />
              </button>

              {isPlaying && selectedVideo.videoUrl ? (
                <video
                  key={selectedVideo.id}
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  poster={selectedVideo.posterUrl}
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedVideo.posterUrl}
                    alt={selectedVideo.name}
                    fill
                    sizes="(max-width: 1200px) 100vw, 800px"
                    className="object-cover opacity-75 pointer-events-none"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-black/45">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(true)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-saffron hover:brightness-105 active:scale-95 text-[#0B1F2A] flex items-center justify-center mb-3 shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer border-2 border-white/40 group"
                      aria-label={`Play video review for ${selectedVideo.name}`}
                    >
                      <Play size={28} className="ml-1 sm:size-[32px] transition-transform group-hover:scale-110" fill="currentColor" />
                    </button>
                    <p className="font-manrope text-xs sm:text-sm text-white font-bold uppercase tracking-wider mb-2 drop-shadow">
                      Click to Watch Story
                    </p>
                    <p className="font-manrope font-semibold text-white text-base sm:text-xl max-w-md mb-1 sm:mb-2 px-8 drop-shadow">
                      {selectedVideo.quote}
                    </p>
                    <p className="hidden sm:block font-manrope text-xs text-white/75 max-w-sm">
                      {selectedVideo.name} ({selectedVideo.city}) • {selectedVideo.duration}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default ClientStories;
