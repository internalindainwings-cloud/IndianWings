'use client';

import React from 'react';
import { MessageCircle, Car } from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

export const TransportCta: React.FC = () => {
  const { openModal } = useEnquiryModal();

  return (
    <section className="w-full bg-background py-16 sm:py-24 relative overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-white/85 border border-black/[0.08] shadow-sm text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron/15 border border-saffron/30 text-saffron font-manrope font-bold text-xs uppercase tracking-widest">
            <Car size={14} />
            <span>INSTANT CHAUFFEUR BOOKING</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0B1F2A] max-w-xl mx-auto leading-tight">
            Need a Custom Cab Route or Multi-Day Driver?
          </h2>

          <p className="font-sans text-xs sm:text-sm text-[#64748B] max-w-lg mx-auto leading-relaxed">
            Tell us your pickup city, travel dates, and group size. We&apos;ll provide an instant all-inclusive quote with zero hidden charges.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={openModal}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-saffron text-midnight font-manrope font-bold text-xs sm:text-sm shadow-xl hover:shadow-saffron/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Car size={16} />
              <span>Get Custom Transport Quote</span>
            </button>

            <a
              href="https://wa.me/917006837096?text=Hi%20The%20Indian%20Wings%20Company,%20I%20want%20to%20book%20a%20cab%20transfer%20across%20Jammu,%20Katra,%20Srinagar%20or%20Udhampur."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-manrope font-bold text-xs sm:text-sm shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Cab Desk</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransportCta;
