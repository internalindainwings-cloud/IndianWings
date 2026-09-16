'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { TRAVEL_FAQS, TravelFaq } from '@/data/travel-information';

export const TravelInfoFaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="w-full bg-background py-14 sm:py-20 lg:py-24 border-b border-black/[0.08] scroll-mt-28">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/15 border border-saffron/30 text-saffron font-manrope font-bold text-[11px] uppercase tracking-widest">
            <HelpCircle size={13} />
            <span>GOT QUESTIONS?</span>
          </div>
          <h2 className="font-manrope text-2xl sm:text-3xl lg:text-4xl text-midnight font-extrabold leading-tight">
            Frequently Asked Kashmir Travel Questions
          </h2>
          <p className="font-manrope text-xs sm:text-sm text-slate-600 leading-relaxed">
            Clear, honest answers to the most common queries asked by tourists, honeymoon couples, and families planning their holiday.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          {TRAVEL_FAQS.map((faq: TravelFaq, idx: number) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-xl bg-white border border-black/[0.08] shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full px-5 py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-black/[0.02] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                  aria-expanded={isOpen}
                >
                  <span className="font-manrope text-sm sm:text-base lg:text-lg font-bold text-midnight leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-midnight transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-saffron text-midnight font-bold' : ''
                    }`}
                  >
                    <ChevronDown size={16} />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-manrope leading-relaxed border-t border-black/[0.04] animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TravelInfoFaqAccordion;
