'use client';

import React from 'react';
import { MessageCircle, Compass } from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

export const PackagesCta: React.FC = () => {
  const { openModal } = useEnquiryModal();

  return (
    <section className="w-full bg-background py-14 sm:py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="p-7 sm:p-10 lg:p-12 rounded-2xl bg-white/85 border border-black/[0.08] shadow-sm text-center space-y-5">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-saffron/15 border border-saffron/30 text-saffron font-manrope font-bold text-xs uppercase tracking-widest">
            <span>TAILOR-MADE KASHMIR TRIPS</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0B1F2A] max-w-lg mx-auto leading-tight">
            Want to Modify or Combine Multiple Packages?
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
            Every traveler is unique. Tell us your travel dates, preferred hotel category, and must-see places—we&apos;ll craft your customized dream itinerary within 20 mins.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() =>
                openModal({
                  defaultTripType: 'Custom Tailor-made Package',
                  source: 'packages_bottom_cta_banner',
                })
              }
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-saffron text-midnight font-manrope font-bold text-xs sm:text-sm shadow-md hover:shadow-saffron/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass size={15} />
              <span>Customize My Package</span>
            </button>

            <a
              href="https://wa.me/917006837096?text=Hi%20The%20Indian%20Wings%20Company,%20I%20want%20to%20customize%20a%20Kashmir%20tour%20package."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-manrope font-bold text-xs sm:text-sm shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={15} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesCta;
