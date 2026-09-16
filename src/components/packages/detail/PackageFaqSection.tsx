'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { defaultPackageFaqs, PackageFaqItem } from '@/data/package-faqs';
export type { PackageFaqItem };

interface PackageFaqSectionProps {
  faqs?: PackageFaqItem[];
  packageTitle: string;
  hideHeader?: boolean;
}

export const PackageFaqSection: React.FC<PackageFaqSectionProps> = ({
  faqs = defaultPackageFaqs,
  packageTitle,
  hideHeader = false,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-[#d98f5b]" />
          <div>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#0B1F2A]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5 font-manrope">
              Important travel tips and booking policies for {packageTitle}.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-black/10 bg-white overflow-hidden transition-all shadow-2xs hover:border-[#d98f5b]/30"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-semibold text-[#0B1F2A] hover:bg-slate-50 transition-colors"
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-[#d98f5b] shrink-0 ml-3" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#64748B] shrink-0 ml-3" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-black/5 bg-slate-50/50 p-4 sm:p-5 text-xs font-manrope text-[#475569] leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
