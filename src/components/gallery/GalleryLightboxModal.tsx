'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Star, MapPin, CheckCircle2, Calendar, Compass } from 'lucide-react';
import { GalleryReviewItem } from '@/data/gallery-reviews';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

interface GalleryLightboxModalProps {
  item: GalleryReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const emptySubscribe = () => () => {};

export const GalleryLightboxModal: React.FC<GalleryLightboxModalProps> = ({
  item,
  isOpen,
  onClose,
  onPrev,
  onNext,
}) => {
  const { openModal } = useEnquiryModal();
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  const handleBookSimilar = () => {
    onClose();
    openModal();
  };

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && item && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label={`Guest review photo by ${item.guestName}`}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/90 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl bg-[#0B1F2A] rounded-2xl sm:rounded-3xl overflow-hidden border border-warm-white/15 shadow-2xl flex flex-col lg:flex-row my-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-40 w-10 h-10 rounded-full bg-black/60 hover:bg-saffron text-white hover:text-midnight backdrop-blur-md flex items-center justify-center transition-all duration-300 border border-white/20 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Left / Top: High-Res Image with Prev/Next Navigation */}
            <div className="relative w-full lg:w-3/5 bg-black/70 min-h-[260px] sm:min-h-[380px] lg:min-h-[540px] flex items-center justify-center overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover lg:object-contain select-none pointer-events-none"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />

              {/* Navigation Overlay Arrows */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-3 pointer-events-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                  }}
                  aria-label="Previous image"
                  className="w-10 h-10 rounded-full bg-black/60 hover:bg-saffron text-white hover:text-midnight backdrop-blur-md flex items-center justify-center transition-all pointer-events-auto border border-white/20 cursor-pointer"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  aria-label="Next image"
                  className="w-10 h-10 rounded-full bg-black/60 hover:bg-saffron text-white hover:text-midnight backdrop-blur-md flex items-center justify-center transition-all pointer-events-auto border border-white/20 cursor-pointer"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Mobile Category Pill Overlay */}
              <div className="absolute bottom-3 left-3 lg:hidden bg-black/75 backdrop-blur-md text-saffron text-xs font-manrope font-semibold px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                <MapPin size={12} />
                <span>{item.location}</span>
              </div>
            </div>

            {/* Right / Bottom: Editorial Review & Guest Details */}
            <div className="w-full lg:w-2/5 p-5 sm:p-7 lg:p-8 flex flex-col justify-between overflow-y-auto bg-[#0B1F2A] text-warm-white">
              <div className="space-y-4 sm:space-y-5">
                {/* Category & Location Badge */}
                <div className="hidden lg:flex items-center gap-2 text-saffron text-xs font-manrope font-semibold tracking-wider uppercase">
                  <MapPin size={14} />
                  <span>{item.location}</span>
                </div>

                {/* Title & Star Rating */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={15} className="text-saffron fill-saffron" />
                    ))}
                    <span className="text-warm-white/70 text-xs font-mono ml-1 font-semibold">5.0</span>
                  </div>
                  <h3 className="font-playfair text-xl sm:text-2xl lg:text-[26px] font-medium leading-snug text-warm-white">
                    &ldquo;{item.title}&rdquo;
                  </h3>
                </div>

                {/* Review Text */}
                <p className="font-manrope text-sm sm:text-[14.5px] leading-relaxed text-warm-white/85 font-normal">
                  {item.reviewText}
                </p>

                {/* Package & Trip Meta */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs font-manrope">
                  <div className="flex items-center gap-2 text-warm-white/90">
                    <Compass size={13} className="text-saffron shrink-0" />
                    <span className="text-warm-white/60">Itinerary:</span>
                    <span className="font-semibold text-warm-white truncate">{item.packageBooked}</span>
                  </div>
                  <div className="flex items-center gap-2 text-warm-white/90">
                    <Calendar size={13} className="text-saffron shrink-0" />
                    <span className="text-warm-white/60">Travel Date:</span>
                    <span className="font-medium text-warm-white">{item.travelDate}</span>
                  </div>
                </div>

                {/* Guest Profile Strip */}
                <div className="flex items-center gap-3 pt-1">
                  {item.avatarUrl && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-saffron/40">
                      <Image
                        src={item.avatarUrl}
                        alt={item.guestName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-manrope font-bold text-sm text-warm-white truncate">
                        {item.guestName}
                      </h4>
                      {item.verified && (
                        <CheckCircle2 size={14} className="text-saffron shrink-0" />
                      )}
                    </div>
                    <p className="font-manrope text-xs text-warm-white/60 truncate">
                      {item.guestLocation} • Verified Guest
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-white/10 mt-5">
                <button
                  type="button"
                  onClick={handleBookSimilar}
                  className="w-full py-3 px-5 rounded-full bg-saffron hover:bg-saffron/90 text-midnight font-manrope font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <span>Plan A Similar Kashmir Trip</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
