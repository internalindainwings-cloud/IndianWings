'use client';

import React from 'react';
import { MessageCircle, CalendarCheck, ShieldCheck } from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

export const TravelInfoCta: React.FC = () => {
  const { openModal } = useEnquiryModal();

  return (
    <section className="w-full bg-background py-16 sm:py-24 relative overflow-hidden">
      {/* Subtle Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-white border border-black/[0.08] shadow-xl text-center space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron/15 border border-saffron/30 text-saffron font-manrope font-bold text-xs uppercase tracking-widest">
            <ShieldCheck size={14} />
            <span>EXPERT KASHMIR TRIP CURATION</span>
          </div>

          <h2 className="font-manrope text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-midnight max-w-2xl mx-auto leading-tight">
            Still Have Questions About Your Kashmir Itinerary?
          </h2>

          <p className="font-manrope text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Don’t leave anything to chance. Our local Srinagar-based destination specialists will handle your private union cabs, Gondola slots, luxury stays, and airport transfers end-to-end.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={openModal}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-saffron text-midnight font-manrope font-bold text-xs sm:text-sm shadow-xl hover:shadow-saffron/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarCheck size={16} />
              <span>Request Custom Itinerary Plan</span>
            </button>

            <a
              href="https://wa.me/917827743041?text=Hi%20The%20Indian%20Wings%20Company,%20I%20need%20travel%20information%20and%20custom%20trip%20planning%20for%20Kashmir."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-manrope font-bold text-xs sm:text-sm shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelInfoCta;
