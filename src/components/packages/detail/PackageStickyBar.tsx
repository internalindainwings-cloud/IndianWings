'use client';

import React, { useState } from 'react';
import { MessageSquare, ArrowRight, Phone, Download } from 'lucide-react';
import type { EnrichedPackage } from '@/data/package-defaults';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import { DownloadItineraryModal } from './DownloadItineraryModal';

interface PackageStickyBarProps {
  pkg: EnrichedPackage;
}

export const PackageStickyBar: React.FC<PackageStickyBarProps> = ({ pkg }) => {
  const { openModal } = useEnquiryModal();
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello The Indian Wings Company! I am interested in booking the "${pkg.title}" (${pkg.duration}). Please share a customized itinerary and quote.`
    );
    window.open(`https://wa.me/917827743041?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1F2A]/95 backdrop-blur-xl border-t border-white/15 px-4 py-3 shadow-2xl transition-all sm:py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Price summary */}
        <div className="flex flex-col">
          <span className="text-[10px] font-manrope font-bold uppercase tracking-wider text-white/50">
            Starting Price
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-2xl font-extrabold font-manrope text-white">
              ₹{pkg.startingPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-manrope text-white/60">/ person</span>
          </div>
          <span className="text-[10px] text-[#d98f5b] font-medium hidden sm:inline">
            {pkg.duration} · Verified Stays & Cab Included
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* WhatsApp Direct */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex h-10 w-10 sm:h-11 sm:w-auto sm:px-4 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 font-manrope font-bold text-xs hover:bg-emerald-500/25 transition-all active:scale-95"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Download PDF button */}
          <button
            type="button"
            onClick={() => setDownloadModalOpen(true)}
            className="flex h-10 px-3 sm:h-11 sm:px-3.5 items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 text-white font-manrope font-bold text-xs hover:bg-white/20 transition-all active:scale-95 cursor-pointer"
            title="Download PDF Itinerary"
          >
            <Download className="h-4 w-4 text-[#d98f5b] shrink-0" />
            <span className="hidden md:inline">Download PDF</span>
          </button>

          {/* Primary Enquiry CTA */}
          <button
            type="button"
            onClick={() =>
              openModal({
                packageTitle: `${pkg.title} (${pkg.duration})`,
                defaultTripType: pkg.title,
                source: `package_sticky_bar_${pkg.slug}`,
              })
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d98f5b] to-[#c47a46] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#d98f5b]/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span>Customise & Book</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* Download Itinerary Modal */}
      <DownloadItineraryModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        pkg={pkg}
      />
    </div>
  );
};
