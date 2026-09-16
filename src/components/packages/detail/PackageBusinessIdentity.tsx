'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, Check, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import type { EnrichedPackage } from '@/data/package-defaults';

interface PackageBusinessIdentityProps {
  pkg: EnrichedPackage;
  className?: string;
}

export const PackageBusinessIdentity: React.FC<PackageBusinessIdentityProps> = ({ pkg, className = '' }) => {
  const [showValues, setShowValues] = useState(true);

  // Derive human-readable category name
  const getCategoryLabel = (slug: string) => {
    switch (slug.toLowerCase()) {
      case 'family':
        return 'Family & Heritage';
      case 'honeymoon':
        return 'Romantic Honeymoon';
      case 'winter':
        return 'Winter Snow & Skiing';
      case 'offbeat':
        return 'Off-Beat Expedition';
      case 'classic':
        return 'Classic Kashmir Odyssey';
      case 'featured':
      default:
        return 'Family & Classic Heritage';
    }
  };

  // Derive "Best For" audience
  const getBestForLabel = (pkg: EnrichedPackage) => {
    const cat = pkg.categorySlug.toLowerCase();
    if (cat.includes('honeymoon')) return 'Couples & Honeymooners';
    if (cat.includes('winter')) return 'Snow Lovers, Skiers & Adventure Seekers';
    if (cat.includes('offbeat')) return 'Trekkers, Explorers & Nature Enthusiasts';
    return 'Families, Couples & Small Groups';
  };

  // Derive primary route string
  const primaryRoute = pkg.destinations && pkg.destinations.length > 0
    ? `${pkg.destinations.join(' ➔ ')}${pkg.destinations.length > 1 && !pkg.destinations[pkg.destinations.length - 1].toLowerCase().includes('srinagar') ? ' ➔ Srinagar' : ''}`
    : 'Srinagar ➔ Gulmarg ➔ Pahalgam ➔ Srinagar';

  const categoryLabel = getCategoryLabel(pkg.categorySlug);
  const bestFor = getBestForLabel(pkg);
  const tourSlugUrl = `/packages/${pkg.slug}`;

  return (
    <div
      className={`rounded-2xl border border-blue-200/80 bg-gradient-to-b from-[#F0F6FF] via-[#F6F9FF] to-white shadow-md overflow-hidden transition-all duration-300 ${className}`}
      id="business-identity"
    >
      {/* ── Top Header Banner (Matching Reference Image) ── */}
      <div className="bg-[#0D57C6] text-white px-4 sm:px-5 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-md bg-white/15 backdrop-blur-xs flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span>1 Business Identity</span>
          </h2>
        </div>

        {/* View Switcher Toggle */}
        <button
          onClick={() => setShowValues(!showValues)}
          className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer flex items-center gap-1"
          title="Toggle between Checklist Specification and Applied Live Values"
        >
          <span>{showValues ? 'Spec View' : 'Live Data'}</span>
        </button>
      </div>

      {/* ── Checklist Body (9 Identity Fields) ── */}
      <div className="p-4 sm:p-5 space-y-2.5 text-xs text-slate-800 font-manrope divide-y divide-blue-100/60">
        
        {/* 1. Tour Name */}
        <div className="pt-2 first:pt-0 flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 rounded-[4px] border-[1.5px] border-[#0D57C6] flex items-center justify-center shrink-0 bg-white shadow-2xs">
            <Check className="h-3 w-3 text-[#0D57C6] stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <span className="font-bold text-slate-900">Tour Name</span>
              {showValues && (
                <span className="font-bold text-[#0B1F2A] sm:text-right text-[13px]">
                  {pkg.title}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Tour Slug (URL) */}
        <div className="pt-2.5 flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 rounded-[4px] border-[1.5px] border-[#0D57C6] flex items-center justify-center shrink-0 bg-white shadow-2xs">
            <Check className="h-3 w-3 text-[#0D57C6] stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span className="text-slate-800">
                <strong className="font-bold text-slate-900">Tour Slug</strong>{' '}
                <span className="text-slate-500 font-normal">(URL)</span>
              </span>
              {showValues && (
                <Link
                  href={tourSlugUrl}
                  className="font-mono text-[11px] text-[#0D57C6] hover:underline bg-blue-50/90 border border-blue-200/60 px-2 py-0.5 rounded truncate max-w-full sm:max-w-[240px] inline-flex items-center gap-1"
                >
                  <span className="truncate">{tourSlugUrl}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 3. Tour Category (e.g. Family, Honeymoon) */}
        <div className="pt-2.5 flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 rounded-[4px] border-[1.5px] border-[#0D57C6] flex items-center justify-center shrink-0 bg-white shadow-2xs">
            <Check className="h-3 w-3 text-[#0D57C6] stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <span className="text-slate-800">
                <strong className="font-bold text-slate-900">Tour Category</strong>{' '}
                <span className="text-slate-500 font-normal">(e.g. Family, Honeymoon)</span>
              </span>
              {showValues && (
                <span className="inline-flex items-center gap-1 font-semibold text-slate-900 bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  {categoryLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4. Tour Status (Draft / Published) */}
        <div className="pt-2.5 flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 rounded-[4px] border-[1.5px] border-[#0D57C6] flex items-center justify-center shrink-0 bg-white shadow-2xs">
            <Check className="h-3 w-3 text-[#0D57C6] stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span className="text-slate-800">
                <strong className="font-bold text-slate-900">Tour Status</strong>{' '}
                <span className="text-slate-500 font-normal">(Draft / Published)</span>
              </span>
              {showValues && (
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    pkg.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      pkg.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  {pkg.isActive ? 'Published & Active' : 'Draft Mode'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 5. Duration (Days / Nights) */}
        <div className="pt-2.5 flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 rounded-[4px] border-[1.5px] border-[#0D57C6] flex items-center justify-center shrink-0 bg-white shadow-2xs">
            <Check className="h-3 w-3 text-[#0D57C6] stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <span className="text-slate-800">
                <strong className="font-bold text-slate-900">Duration</strong>{' '}
                <span className="text-slate-500 font-normal">(Days / Nights)</span>
              </span>
              {showValues && (
                <span className="font-bold text-[#0B1F2A] bg-blue-50/80 px-2.5 py-0.5 rounded border border-blue-100">
                  {pkg.duration}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 6. Destinations Covered */}
        <div className="pt-2.5 flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 rounded-[4px] border-[1.5px] border-[#0D57C6] flex items-center justify-center shrink-0 bg-white shadow-2xs">
            <Check className="h-3 w-3 text-[#0D57C6] stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <span className="font-bold text-slate-900">Destinations Covered</span>
              {showValues && (
                <div className="flex flex-wrap gap-1 sm:justify-end">
                  {pkg.destinations.map((dest, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-[11px]"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 7. Primary Route */}
        <div className="pt-2.5 flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 rounded-[4px] border-[1.5px] border-[#0D57C6] flex items-center justify-center shrink-0 bg-white shadow-2xs">
            <Check className="h-3 w-3 text-[#0D57C6] stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Primary Route</span>
              </div>
              {showValues && (
                <div className="mt-0.5 px-2.5 py-1.5 rounded-lg bg-blue-50/60 border border-blue-100 text-slate-800 font-medium text-[11px]">
                  {primaryRoute}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 8. Tour Type (Group / Private / Custom) */}
        <div className="pt-2.5 flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 rounded-[4px] border-[1.5px] border-[#0D57C6] flex items-center justify-center shrink-0 bg-white shadow-2xs">
            <Check className="h-3 w-3 text-[#0D57C6] stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <span className="text-slate-800">
                <strong className="font-bold text-slate-900">Tour Type</strong>{' '}
                <span className="text-slate-500 font-normal">(Group / Private / Custom)</span>
              </span>
              {showValues && (
                <span className="inline-flex items-center gap-1 font-semibold text-slate-900 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  Private / Custom
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 9. Best For (Family, Couple, etc.) */}
        <div className="pt-2.5 flex items-start gap-3">
          <div className="mt-0.5 h-4 w-4 rounded-[4px] border-[1.5px] border-[#0D57C6] flex items-center justify-center shrink-0 bg-white shadow-2xs">
            <Check className="h-3 w-3 text-[#0D57C6] stroke-[3]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <span className="text-slate-800">
                <strong className="font-bold text-slate-900">Best For</strong>{' '}
                <span className="text-slate-500 font-normal">(Family, Couple, etc.)</span>
              </span>
              {showValues && (
                <span className="font-semibold text-slate-800 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100 text-[11px]">
                  {bestFor}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
