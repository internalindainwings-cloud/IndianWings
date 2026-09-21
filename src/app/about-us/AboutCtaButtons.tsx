'use client';

import React from 'react';
import { MessageCircle, Compass } from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

export function AboutCtaButtons({ cleanWhatsapp }: { cleanWhatsapp: string }) {
  const { openModal } = useEnquiryModal();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3.5">
      <button
        type="button"
        onClick={() => openModal()}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-saffron hover:bg-saffron/90 text-midnight font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
      >
        <Compass size={16} />
        <span>Plan My Custom Itinerary</span>
      </button>

      <a
        href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
          'Hello The Indian Wings Company team, I would like to inquire about customized Kashmir tour packages.'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/20 active:scale-95 cursor-pointer"
      >
        <MessageCircle size={16} className="text-emerald-400" />
        <span>Chat on WhatsApp</span>
      </a>
    </div>
  );
}
