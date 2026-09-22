'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  Play,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Compass,
  Video,
  Image as ImageIcon,
  ArrowRight,
} from 'lucide-react';
import type { GalleryItem, GalleryCategory } from '@/lib/gallery-categories-constants';
import { DEFAULT_GALLERY_CATEGORIES } from '@/lib/gallery-categories-constants';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import { optimizeCloudinaryUrl } from '@/lib/utilities/cloudinary';

const emptySubscribe = () => () => {};

export const HomeGallerySection: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>(DEFAULT_GALLERY_CATEGORIES);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const { openModal } = useEnquiryModal();

  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(4);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(8); // Reduced from 12 to make it less cluttered on desktop
      }
    };
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // 1. Fetch Dynamic Categories
  useEffect(() => {
    let isMounted = true;
    fetch('/api/gallery/categories')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.warn('Could not fetch categories:', err));
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch Gallery Items
  useEffect(() => {
    let isMounted = true;
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.items)) {
          setItems(data.items);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch gallery items:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Filtering
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items;
    if (activeFilter === 'video') return items.filter((i) => i.type === 'video');
    if (activeFilter === 'image') return items.filter((i) => i.type === 'image');
    return items.filter((i) => i.category === activeFilter);
  }, [items, activeFilter]);

  // 4. Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, safeCurrentPage, itemsPerPage]);

  const activeItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, filteredItems.length]);

  const isRemoteUnconfigured = (url: string) => {
    if (!url || url.startsWith('/')) return false;
    return !url.includes('cloudinary.com') && !url.includes('unsplash.com');
  };

  return (
    <section
      id="gallery"
      aria-label="Kashmir Photo & Video Gallery"
      className="w-full bg-[#FAF9F5] py-12 sm:py-16 lg:py-20 border-t border-black/8 scroll-mt-20 relative overflow-hidden font-manrope"
    >
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-saffron/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-midnight/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight/5 border border-midnight/10 text-midnight text-xs font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-saffron" />
              <span>PHOTO &amp; VIDEO ARCHIVE</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0B1F2A] font-semibold leading-tight">
              Kashmir Gallery
            </h2>
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Showing {filteredItems.length} curated moments
          </div>
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none flex-nowrap">
          {categories.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveFilter(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-midnight text-white shadow-md scale-102 ring-2 ring-saffron/40'
                    : 'bg-white hover:bg-black/5 text-gray-700 border border-black/8 hover:border-black/15'
                }`}
              >
                {cat.icon && <span>{cat.icon}</span>}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dedicated Framed Gallery Container with Left/Right Spacing */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-black/8 p-4 sm:p-6 lg:p-8 shadow-xs">
          {/* Media Grid */}
          {paginatedItems.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-[#FAF9F5] border border-black/5 text-gray-500">
              <p className="text-sm font-medium">No items currently available in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {paginatedItems.map((item) => {
                const globalIndex = filteredItems.indexOf(item);
                const optimizedImg = optimizeCloudinaryUrl(item.posterUrl || item.url);

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedIndex(globalIndex)}
                    className="group relative rounded-2xl p-2.5 sm:p-3 bg-white hover:bg-slate-50/80 border border-black/8 hover:border-black/20 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer select-none"
                  >
                    {/* Media Thumbnail Container */}
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-900">
                      <Image
                        src={optimizedImg}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out pointer-events-none"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        unoptimized={isRemoteUnconfigured(optimizedImg)}
                      />

                      {/* Gentle Ambient Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 pointer-events-none" />

                      {/* Top Corner Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[10.5px] font-medium border border-white/10 shadow-xs">
                          <MapPin size={10.5} className="text-saffron shrink-0" />
                          <span className="truncate max-w-[110px] sm:max-w-[130px]">{item.location}</span>
                        </span>

                        {item.type === 'video' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-saffron text-midnight text-[10px] font-bold shadow-xs">
                            <Video size={10.5} />
                            <span>{item.duration || 'Reel'}</span>
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-black/40 group-hover:bg-saffron backdrop-blur-md text-white group-hover:text-midnight flex items-center justify-center transition-colors border border-white/20 shadow-xs">
                            <Maximize2 size={11} />
                          </span>
                        )}
                      </div>

                      {/* Centered Play Trigger for Videos */}
                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-saffron text-midnight flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                            <Play size={18} fill="currentColor" className="ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Clean, Uncluttered Card Info Below Thumbnail */}
                    <div className="pt-3 pb-1 px-1 flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold text-saffron uppercase tracking-wider truncate">
                          {item.categoryLabel || item.category}
                        </span>
                        <span className="text-[10px] text-gray-600 font-medium shrink-0">
                          {item.type === 'video' ? 'Video Reel' : 'Photo'}
                        </span>
                      </div>

                      <h3 className="font-serif text-sm sm:text-[15px] font-semibold text-[#0B1F2A] leading-snug truncate group-hover:text-saffron transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-[11.5px] text-gray-500 line-clamp-1 mt-1 font-normal">
                        {item.caption || `Captivating moment captured in ${item.location}.`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/8 pt-6">
              <div className="text-xs text-gray-500 font-medium">
                Showing <span className="text-midnight font-bold">{(safeCurrentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="text-midnight font-bold">
                  {Math.min(safeCurrentPage * itemsPerPage, filteredItems.length)}
                </span>{' '}
                of <span className="text-midnight font-bold">{filteredItems.length}</span> gallery items
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    const el = document.getElementById('gallery');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={safeCurrentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-black/10 bg-white text-xs font-semibold text-gray-700 hover:bg-black/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  &larr; Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= safeCurrentPage - 1 && pageNum <= safeCurrentPage + 1)
                  ) {
                    const isCurrent = pageNum === safeCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          const el = document.getElementById('gallery');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-midnight text-white shadow-xs'
                            : 'bg-white border border-black/10 text-gray-700 hover:bg-black/5'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === safeCurrentPage - 2 ||
                    pageNum === safeCurrentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="text-gray-400 text-xs px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    const el = document.getElementById('gallery');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={safeCurrentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-black/10 bg-white text-xs font-semibold text-gray-700 hover:bg-black/5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Banner with Trust Assurance */}
        <div className="mt-10 sm:mt-12 p-4 sm:p-5 rounded-2xl bg-white border border-black/8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-saffron/20 flex items-center justify-center text-midnight shrink-0 font-bold">
              <Compass className="w-5 h-5 text-midnight" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-midnight">
                Want to capture your own unforgettable Kashmir moments?
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Handcrafted itineraries, personal chauffeurs, and local mountain guides ready to assist.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openModal()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-saffron hover:bg-saffron/90 text-midnight font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Customize Kashmir Package &rarr;
          </button>
        </div>
      </div>

      {/* ── Interactive Lightbox Modal ── */}
      {isClient && activeItem && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 md:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer border border-white/20"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Left Navigation Arrow */}
          {filteredItems.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer border border-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Right Navigation Arrow */}
          {filteredItems.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer border border-white/20"
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Modal Content Card */}
          <div
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col rounded-2xl overflow-hidden bg-[#0A1620] border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Info Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-midnight/80">
              <div className="flex items-center gap-2">
                <span className="text-saffron text-xs font-bold uppercase tracking-wider">
                  {activeItem.categoryLabel || activeItem.category}
                </span>
                <span className="text-white/30">•</span>
                <span className="text-white/70 text-xs flex items-center gap-1">
                  <MapPin size={11} className="text-saffron" />
                  <span>{activeItem.location}</span>
                </span>
              </div>

              <span className="text-white/50 text-xs font-mono">
                {selectedIndex !== null ? selectedIndex + 1 : 1} / {filteredItems.length}
              </span>
            </div>

            {/* Media Display Area */}
            <div className="relative flex-1 min-h-[300px] sm:min-h-[460px] max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
              {activeItem.type === 'video' ? (
                <video
                  src={optimizeCloudinaryUrl(activeItem.url)}
                  poster={optimizeCloudinaryUrl(activeItem.posterUrl)}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full max-h-[65vh] object-contain"
                />
              ) : (
                <div className="relative w-full h-full min-h-[300px] sm:min-h-[460px]">
                  <Image
                    src={optimizeCloudinaryUrl(activeItem.url)}
                    alt={activeItem.title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                    unoptimized={isRemoteUnconfigured(activeItem.url)}
                  />
                </div>
              )}
            </div>

            {/* Bottom Caption & Action Bar */}
            <div className="p-4 sm:p-5 bg-midnight/90 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                  {activeItem.title}
                </h3>
                {activeItem.caption && (
                  <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-2xl leading-relaxed">
                    {activeItem.caption}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedIndex(null);
                  openModal();
                }}
                className="px-5 py-2.5 rounded-xl bg-saffron hover:bg-saffron/90 text-midnight font-bold text-xs shadow-md transition-all active:scale-95 shrink-0 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Plan a Similar Kashmir Trip</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default HomeGallerySection;
