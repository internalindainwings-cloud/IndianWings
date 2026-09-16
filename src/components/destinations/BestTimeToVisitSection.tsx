'use client';

import React, { useState } from 'react';
import { Check, Calendar } from 'lucide-react';
import { DestinationItem } from '@/data/destinations';
import { DestinationDetailContent, DestinationSeason } from '@/data/destination-content';

interface BestTimeToVisitSectionProps {
  destination: DestinationItem;
  content: DestinationDetailContent;
}

export const BestTimeToVisitSection: React.FC<BestTimeToVisitSectionProps> = ({ destination, content }) => {
  const seasons = content.seasons;
  const [activeSeasonId, setActiveSeasonId] = useState<string>(seasons[0]?.id || '');

  const activeSeason: DestinationSeason | undefined = seasons.find((s) => s.id === activeSeasonId) || seasons[0];

  return (
    <section 
      id="best-time" 
      className="w-full bg-white py-6 sm:py-8 lg:py-10 relative overflow-hidden border-t border-black/[0.08] scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* 1. Dynamic Section Header & Tagline */}
        <div className="text-left mb-4 sm:mb-5 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-saffron rounded-full"></span>
            <span className="text-saffron font-manrope font-bold text-xs uppercase tracking-widest">
              SEASONAL GUIDE
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0B1F2A] font-semibold leading-tight">
            Best Time To Visit {destination.name}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#64748B]">
            {content.tagline || 'All year round destination'}
          </p>
        </div>

        {/* 2. Season Selector Tabs (Peak, Moderate, Off-season) */}
        <div className="mb-5 sm:mb-6">
          <div 
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none flex-nowrap py-1"
            role="tablist"
            aria-label="Season selection"
          >
            {seasons.map((season) => {
              const isActive = season.id === (activeSeason?.id || '');
              return (
                <button
                  key={season.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActiveSeasonId(season.id)}
                  className={`min-h-[44px] px-4 sm:px-5 py-2 rounded-xl font-manrope text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
                    isActive
                      ? 'bg-saffron text-midnight shadow-xs font-bold scale-[1.02]'
                      : 'bg-white/70 hover:bg-white text-[#475569] border border-black/10'
                  }`}
                >
                  <Calendar size={14} className={isActive ? 'text-midnight' : 'text-saffron'} />
                  <span>{season.period}</span>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${
                    isActive 
                      ? 'bg-midnight/20 text-midnight' 
                      : 'bg-black/5 text-[#64748B]'
                  }`}>
                    {season.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Unified Season Content & Festivals Showcase */}
        {activeSeason && (
          <div className="bg-white rounded-2xl border border-black/[0.08] shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-black/[0.08]">
              
              {/* Left Column: What to Expect & Highlights */}
              <div className="lg:col-span-7 xl:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-left">
                {/* What To Expect */}
                <div className="space-y-2">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#0B1F2A]">
                    What To Expect
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {activeSeason.whatToExpect}
                  </p>
                </div>

                {/* Things You'll Love */}
                <div className="space-y-3 pt-3 border-t border-black/[0.06]">
                  <h4 className="font-serif text-base sm:text-lg font-semibold text-[#0B1F2A]">
                    Things You&apos;ll Love
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeSeason.thingsYoullLove.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 font-sans text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                        <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check size={10} strokeWidth={2.5} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Festivals & Cultural Events */}
              <div className="lg:col-span-5 xl:col-span-5 p-6 sm:p-8 bg-slate-50/60 flex flex-col justify-start space-y-4 text-left">
                <div className="border-b border-black/[0.08] pb-2.5">
                  <span className="text-[10px] font-manrope font-bold uppercase tracking-widest text-saffron block mb-0.5">
                    CELEBRATIONS &amp; CULTURE
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#0B1F2A]">
                    Festivals &amp; Events
                  </h3>
                </div>

                {content.festivals && content.festivals.length > 0 ? (
                  <div className="space-y-3">
                    {content.festivals.map((fest, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-2xs space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-serif font-semibold text-sm sm:text-base text-[#0B1F2A]">
                            {fest.name}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[11px] font-manrope font-semibold text-saffron shrink-0 bg-saffron/10 px-2 py-0.5 rounded-md">
                            <Calendar size={11} />
                            <span>{fest.month}</span>
                          </span>
                        </div>
                        <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                          {fest.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-manrope text-xs text-[#64748B]">
                    No major scheduled festivals during this period. Scenic natural sightseeing and seasonal activities remain at their finest.
                  </p>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestTimeToVisitSection;
