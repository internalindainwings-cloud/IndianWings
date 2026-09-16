'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface PackageInclusionsExclusionsProps {
  inclusions: string[];
  exclusions: string[];
}

export const PackageInclusionsExclusions: React.FC<PackageInclusionsExclusionsProps> = ({
  inclusions,
  exclusions,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#0B1F2A]">
          What’s Included & Excluded
        </h2>
        <p className="text-xs text-[#64748B] mt-1 font-manrope">
          Transparent trip deliverables with zero hidden costs at destination.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Inclusions Card */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 border-b border-emerald-200/60 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
              <Check className="h-4 w-4" />
            </div>
            <h3 className="font-playfair text-base font-bold">Package Inclusions</h3>
          </div>

          <ul className="space-y-3 font-manrope text-xs text-[#1E293B]">
            {inclusions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                  <Check className="h-3 w-3" />
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exclusions Card */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-800 border-b border-rose-200/60 pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white shadow-xs">
              <X className="h-4 w-4" />
            </div>
            <h3 className="font-playfair text-base font-bold">Package Exclusions</h3>
          </div>

          <ul className="space-y-3 font-manrope text-xs text-[#1E293B]">
            {exclusions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700 mt-0.5">
                  <X className="h-3 w-3" />
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
