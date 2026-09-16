'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { ACTIVITY_FAQS } from '@/data/activities-data';

export const ActivitiesFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full bg-background py-12 sm:py-16 border-b border-black/[0.08]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/15 border border-saffron/30 text-saffron font-manrope font-bold text-[11px] uppercase tracking-widest">
            <HelpCircle size={12} />
            <span>ADVENTURE FAQS</span>
          </div>
          <h2 className="font-manrope text-2xl sm:text-3xl font-bold text-[#0B1F2A]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          {ACTIVITY_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-xl bg-white border border-black/[0.08] shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full px-4 py-3.5 sm:py-4 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-black/[0.02] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
                  aria-expanded={isOpen}
                >
                  <span className="font-manrope text-sm sm:text-base font-bold text-[#0B1F2A] leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`w-6 h-6 rounded-full bg-black/5 flex items-center justify-center shrink-0 text-[#0B1F2A] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-saffron text-midnight font-bold' : ''
                    }`}
                  >
                    <ChevronDown size={14} />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#475569] font-sans leading-relaxed border-t border-black/[0.05]">
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

export default ActivitiesFaq;
