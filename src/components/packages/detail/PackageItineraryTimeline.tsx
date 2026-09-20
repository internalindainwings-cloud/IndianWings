'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, MapPin, Coffee, Moon, CheckCircle2, Download } from 'lucide-react';
import type { ItineraryDay, EnrichedPackage } from '@/data/package-defaults';
import { DownloadItineraryModal } from './DownloadItineraryModal';

interface PackageItineraryTimelineProps {
  itinerary: ItineraryDay[];
  packageTitle: string;
  pkg?: EnrichedPackage;
}

export const PackageItineraryTimeline: React.FC<PackageItineraryTimelineProps> = ({
  itinerary,
  packageTitle,
  pkg,
}) => {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  // By default, expand first 2 days
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({
    1: true,
    2: true,
  });

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    itinerary.forEach((d) => (all[d.day] = true));
    setExpandedDays(all);
  };

  const collapseAll = () => {
    setExpandedDays({});
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-black/10 pb-4">
        <div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#0B1F2A]">
            Day-by-Day Detailed Itinerary
          </h2>
          <p className="text-xs text-[#64748B] mt-1 font-manrope">
            {itinerary.length} Days Handcrafted by Local Kashmir Specialists
          </p>
        </div>

        <div className="flex items-center gap-3">
          {pkg && (
            <button
              type="button"
              onClick={() => setDownloadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1F2A] hover:bg-[#163040] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="Download Itinerary PDF"
            >
              <Download className="h-3.5 w-3.5 text-[#d98f5b]" />
              <span>Download PDF</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="text-xs font-semibold text-[#d98f5b] hover:underline cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-[#64748B]/40">•</span>
            <button
              onClick={collapseAll}
              className="text-xs font-semibold text-[#64748B] hover:text-[#0B1F2A] cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Itinerary Timeline Tree (MakeMyTrip Style) */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#d98f5b]/30">
        {itinerary.map((day) => {
          const isExpanded = expandedDays[day.day] ?? false;

          return (
            <div key={day.day} className="relative group">
              {/* Timeline Day Dot */}
              <div className="absolute -left-6 sm:-left-8 top-3 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#d98f5b] text-white text-[11px] font-bold shadow-md shadow-[#d98f5b]/30">
                {day.day}
              </div>

              {/* Day Card */}
              <div className="rounded-2xl border border-black/10 bg-white shadow-xs overflow-hidden transition-all hover:shadow-md">
                {/* Day Header Bar */}
                <button
                  onClick={() => toggleDay(day.day)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1 pr-4">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#d98f5b] font-manrope">
                      Day {day.day}
                    </span>
                    <h3 className="font-playfair text-base sm:text-lg font-bold text-[#0B1F2A]">
                      {day.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-[#64748B] shrink-0">
                    <span className="text-xs font-medium hidden sm:inline">
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </span>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {/* Day Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-black/5 bg-slate-50/50 p-4 sm:p-5 space-y-4 text-xs font-manrope leading-relaxed text-[#475569]">
                    <div className={`flex flex-col ${(day.imageUrl || day.image) ? 'md:flex-row gap-4 sm:gap-6 items-start' : ''}`}>
                      <div className="flex-1 space-y-3 min-w-0">
                        <p className="text-sm text-[#334155] leading-relaxed">
                          {day.description}
                        </p>

                        {/* Activity Pills */}
                        {day.activities && day.activities.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                              Key Highlights for Today:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {day.activities.map((act, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 rounded-lg bg-white border border-black/5 px-2.5 py-1 text-xs text-[#0B1F2A] font-medium shadow-2xs"
                                >
                                  <CheckCircle2 className="h-3 w-3 text-[#d98f5b]" />
                                  {act}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Optional Day Image — Shown only if provided by Admin; otherwise completely hidden */}
                      {(day.imageUrl || day.image) && (
                        <div className="w-full md:w-56 lg:w-64 shrink-0 rounded-xl overflow-hidden border border-black/10 shadow-xs relative h-48 md:h-36 bg-slate-100">
                          <Image
                            src={day.imageUrl || day.image || ''}
                            alt={`Day ${day.day} — ${day.title}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 256px"
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Stay and Meals Pill Bar */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-black/5">
                      {day.meals && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 text-[11px] font-semibold">
                          <Coffee className="h-3 w-3 text-emerald-600" />
                          {day.meals}
                        </span>
                      )}

                      {day.stay && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 text-[11px] font-semibold">
                          <Moon className="h-3 w-3 text-blue-600" />
                          Overnight: {day.stay}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {pkg && (
        <DownloadItineraryModal
          isOpen={downloadModalOpen}
          onClose={() => setDownloadModalOpen(false)}
          pkg={pkg}
        />
      )}
    </div>
  );
};
