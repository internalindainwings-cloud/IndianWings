'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { TRANSPORT_FAQS } from '@/data/transport-data';

export const TransportFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full bg-background py-14 sm:py-20 lg:py-24 border-b border-black/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/15 border border-saffron/30 text-saffron font-manrope font-bold text-[11px] uppercase tracking-widest">
            <HelpCircle size={13} />
            <span>CAB &amp; HIGHWAY QUESTIONS</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0B1F2A] font-semibold leading-tight">
            Frequently Asked Transport Questions
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Everything you need to know about Jammu-Srinagar transfers, tolls, vehicle luggage capacity, and road safety.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          {TRANSPORT_FAQS.map((faq, idx) => {
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
                  <span className="font-serif text-sm sm:text-base lg:text-lg font-semibold text-[#0B1F2A] leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full bg-black/5 flex items-center justify-center shrink-0 text-[#0B1F2A] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-saffron text-midnight font-bold' : ''
                    }`}
                  >
                    <ChevronDown size={16} />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#475569] font-sans leading-relaxed border-t border-black/[0.05]">
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

export default TransportFaq;
