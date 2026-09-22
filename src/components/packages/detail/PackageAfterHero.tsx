'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Coffee,
  Calendar,
  Sparkles,
  ShieldCheck,
  Users,
  Compass,
  ArrowRight,
  Download,
  Car,
  Hotel,
  Clock,
  Layers,
  Check,
  Fuel,
  ShieldAlert,
  Flame,
  HelpCircle,
  MessageSquare,
  FileCheck2,
  RotateCcw,
} from 'lucide-react';
import type { EnrichedPackage, ItineraryDay } from '@/data/package-defaults';
import { defaultPackageStays, defaultPackageTransports, defaultCancellationPolicy } from '@/data/package-defaults';
import { getCategoryLabel, getBestForLabel } from '@/lib/utilities/slug';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import { PackageInclusionsExclusions } from './PackageInclusionsExclusions';
import { PackageFaqSection } from './PackageFaqSection';
import { DownloadItineraryModal } from './DownloadItineraryModal';

interface PackageAfterHeroProps {
  pkg: EnrichedPackage;
}

type NavTab = 'overview' | 'itinerary' | 'stay' | 'transport' | 'inclusions' | 'faqs' | 'cancellation' | 'viewAll';

/**
 * Day Image Resolver (Custom admin-provided day images only)
 */
function getDayImage(day?: ItineraryDay | null) {
  if (!day) return null;
  const imgUrl = day.imageUrl || day.image;
  if (!imgUrl || typeof imgUrl !== 'string' || !imgUrl.trim()) {
    return null;
  }

  return {
    url: imgUrl.trim(),
    caption: day.title,
    location: day.stay ? day.stay.split(',')[0].trim() : 'Kashmir',
  };
}

export const PackageAfterHero: React.FC<PackageAfterHeroProps> = ({ pkg }) => {
  const { openModal } = useEnquiryModal();
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [activeDayNumber, setActiveDayNumber] = useState<number>(pkg.itinerary[0]?.day || 1);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [selectedFleetCar, setSelectedFleetCar] = useState<string>('crysta');
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // Top Nav container ref to scroll to top of section when tab is switched
  const contentTopRef = useRef<HTMLDivElement>(null);

  const categoryLabel = getCategoryLabel(pkg.categorySlug || pkg.tag);
  const bestForLabel = getBestForLabel(pkg.categorySlug || pkg.tag);

  // Check if any day in the itinerary has an image uploaded by admin
  const hasAnyDayImages = pkg.itinerary.some(
    (d) => Boolean((d.imageUrl && d.imageUrl.trim()) || (d.image && d.image.trim()))
  );

  // Derive active day for the sticky image container
  const currentDay = pkg.itinerary.find((d) => d.day === activeDayNumber) || pkg.itinerary[0];

  const currentDayImage = getDayImage(currentDay);

  // Route string
  const primaryRoute =
    pkg.destinations && pkg.destinations.length > 0
      ? `${pkg.destinations.join(' ➔ ')}${
          pkg.destinations.length > 1 &&
          !pkg.destinations[pkg.destinations.length - 1].toLowerCase().includes('srinagar')
            ? ' ➔ Srinagar'
            : ''
        }`
      : 'Srinagar ➔ Gulmarg ➔ Pahalgam ➔ Srinagar';

  // Smooth scroll to in-page section on tab click with sticky header offset
  const handleTabChange = (tabKey: NavTab) => {
    setActiveTab(tabKey);
    if (tabKey === 'viewAll') {
      if (contentTopRef.current) {
        const y = contentTopRef.current.getBoundingClientRect().top + window.pageYOffset - 130;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
      return;
    }
    const elem = document.getElementById(tabKey);
    if (elem) {
      const y = elem.getBoundingClientRect().top + window.pageYOffset - 140;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  // ScrollSpy: Update active tab highlight as user scrolls through sections
  useEffect(() => {
    const sectionIds: NavTab[] = ['overview', 'itinerary', 'stay', 'transport', 'inclusions', 'faqs', 'cancellation'];
    let rafId: number | null = null;

    const checkScroll = () => {
      const scrollPosition = window.scrollY + 180;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveTab((prev) => (prev === id ? prev : id));
            return;
          }
        }
      }
      setActiveTab((prev) => (prev === 'overview' ? prev : 'overview'));
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        checkScroll();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    checkScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // IntersectionObserver: Update active day destination image on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const day = Number(entry.target.getAttribute('data-day'));
          if (day && !isNaN(day)) {
            setActiveDayNumber(day);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '-15% 0px -50% 0px',
      threshold: 0.1,
    });

    pkg.itinerary.forEach((d) => {
      const el = document.getElementById(`itinerary-day-${d.day}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pkg.itinerary]);

  const overviewParagraph =
    pkg.overviewParagraph ||
    pkg.metaDescription ||
    `Experience the spellbinding splendor of Kashmir on this handcrafted ${pkg.duration} holiday. Beginning with the tranquil waters of Dal Lake and traditional cedar-wood houseboats, your journey winds through snow-blanketed slopes in Gulmarg and turquoise mountain streams in Pahalgam. Handcrafted by local Srinagar specialists, every detail—from your dedicated private cab with a seasoned Kashmiri chauffeur to daily breakfast, lavish wazwan dinners, and verified centrally heated stays—is planned for maximum comfort and relaxation.`;

  // Workable Dynamic Data
  const fleetOptions = pkg.transports && pkg.transports.length > 0 ? pkg.transports : defaultPackageTransports;
  const staysOptions = pkg.stays && pkg.stays.length > 0 ? pkg.stays : defaultPackageStays;
  const cancellationTiers = pkg.cancellationPolicy && pkg.cancellationPolicy.length > 0 ? pkg.cancellationPolicy : defaultCancellationPolicy;

  return (
    <div ref={contentTopRef} className="container-custom py-6 sm:py-10 space-y-10 scroll-mt-20">
      {/* ── 1. SUB-NAVIGATION TAB BAR (Pinned while scrolling down) ── */}
      <div className="sticky top-[68px] sm:top-[74px] md:top-[80px] z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md p-1.5 sm:p-2 transition-all">
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Tab 1: Overview */}
            <button
              type="button"
              onClick={() => handleTabChange('overview')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#0B1F2A] text-white shadow-sm ring-1 ring-white/20'
                  : 'text-slate-600 hover:text-[#0B1F2A] hover:bg-slate-100'
              }`}
            >
              Overview
            </button>

            {/* Tab 2: Itinerary */}
            <button
              type="button"
              onClick={() => handleTabChange('itinerary')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'itinerary'
                  ? 'bg-[#0B1F2A] text-white shadow-sm ring-1 ring-white/20'
                  : 'text-slate-600 hover:text-[#0B1F2A] hover:bg-slate-100'
              }`}
            >
              Itinerary
            </button>

            {/* Tab 3: Stay */}
            <button
              type="button"
              onClick={() => handleTabChange('stay')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'stay'
                  ? 'bg-[#0B1F2A] text-white shadow-sm ring-1 ring-white/20'
                  : 'text-slate-600 hover:text-[#0B1F2A] hover:bg-slate-100'
              }`}
            >
              Stay
            </button>

            {/* Tab 4: Transport */}
            <button
              type="button"
              onClick={() => handleTabChange('transport')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'transport'
                  ? 'bg-[#0B1F2A] text-white shadow-sm ring-1 ring-white/20'
                  : 'text-slate-600 hover:text-[#0B1F2A] hover:bg-slate-100'
              }`}
            >
              <Car className="h-3.5 w-3.5" />
              <span>Transport</span>
            </button>

            {/* Tab 5: Inclusions */}
            <button
              type="button"
              onClick={() => handleTabChange('inclusions')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'inclusions'
                  ? 'bg-[#0B1F2A] text-white shadow-sm ring-1 ring-white/20'
                  : 'text-slate-600 hover:text-[#0B1F2A] hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Inclusions</span>
            </button>

            {/* Tab 6: FAQs */}
            <button
              type="button"
              onClick={() => handleTabChange('faqs')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'faqs'
                  ? 'bg-[#0B1F2A] text-white shadow-sm ring-1 ring-white/20'
                  : 'text-slate-600 hover:text-[#0B1F2A] hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>FAQs</span>
            </button>

            {/* Tab 7: Cancellation */}
            <button
              type="button"
              onClick={() => handleTabChange('cancellation')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'cancellation'
                  ? 'bg-[#0B1F2A] text-white shadow-sm ring-1 ring-white/20'
                  : 'text-slate-600 hover:text-[#0B1F2A] hover:bg-slate-100'
              }`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Cancellation</span>
            </button>

            {/* Tab 8: View All */}
            <button
              type="button"
              onClick={() => handleTabChange('viewAll')}
              className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'viewAll'
                  ? 'bg-gradient-to-r from-[#d98f5b] to-amber-600 text-white shadow-md'
                  : 'text-[#d98f5b] hover:bg-amber-50 border border-[#d98f5b]/30'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>View All</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. TOP ROW: OVERVIEW + "WHY THIS ROUTE." (Equal Height) ── */}
      <section id="overview" className="space-y-3 scroll-mt-36 animate-in fade-in duration-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Overview Card (lg:col-span-7) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F2A]">
                  Overview
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {pkg.duration} Handcrafted
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-manrope">
                {isOverviewExpanded ? overviewParagraph : `${overviewParagraph.slice(0, 260)}...`}
              </p>

              {/* Extended information when expanded */}
              {isOverviewExpanded && (
                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600 animate-in fade-in duration-200">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <strong className="text-[#0B1F2A] block mb-0.5">🌤️ Best Season to Travel:</strong>
                    <span>April to October for vibrant meadow blooms; December to March for thrilling snow & skiing.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <strong className="text-[#0B1F2A] block mb-0.5">🛡️ Local Srinagar Support:</strong>
                    <span>Direct 24/7 Srinagar emergency assistance with verified local drivers and zero booking change fees.</span>
                  </div>
                </div>
              )}
            </div>

            {/* [Read more] Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                className="text-xs font-bold text-[#d98f5b] hover:text-[#b87342] transition-colors cursor-pointer"
              >
                {isOverviewExpanded ? 'Read less ▴' : 'Read more ▾'}
              </button>
              <span className="text-[11px] text-slate-500 font-medium">
                Tour Category: <strong className="text-[#0B1F2A]">{categoryLabel}</strong>
              </span>
            </div>
          </div>

          {/* Right: Why This Route Card (lg:col-span-5) */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg sm:text-xl font-bold text-[#0B1F2A]">
                  Why this Route.
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Optimal Flow
                </span>
              </div>

              {/* Primary Route Pill */}
              <div className="px-2.5 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 text-[11px] font-semibold text-slate-800 truncate">
                📍 {primaryRoute}
              </div>

              {/* 4 Expert Rationale Points */}
              <ul className="space-y-2 text-[11px] text-slate-700 font-manrope">
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    <Check className="h-2 w-2 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-[#0B1F2A]">Altitude Acclimatization:</strong> Starting at Srinagar (5,200 ft) prepares you before alpine Gulmarg (8,690 ft).
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    <Check className="h-2 w-2 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-[#0B1F2A]">Zero Backtracking:</strong> Direct scenic highway corridors save 4+ hours of mountain road fatigue.
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    <Check className="h-2 w-2 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-[#0B1F2A]">Scenic Crescendo:</strong> Flows smoothly from calm Dal Lake waters to snow summits to pine glades.
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <div className="mt-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    <Check className="h-2 w-2 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-[#0B1F2A]">Safe Return:</strong> Closes in Srinagar to safeguard against mountain snow-chains delays.
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>Verified by Srinagar Operations</span>
              <span className="text-[#d98f5b] font-bold">100% Safe Route</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. DETAILED ITINERARY (All Days Rendered on UI + Dynamic Sticky Image on Right) ── */}
      <section id="itinerary" className="space-y-6 scroll-mt-36 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F2A]">
              Detailed Itinerary
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-manrope">
              {pkg.itinerary.length} Days Handcrafted by Local Kashmir Specialists
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              📍 {primaryRoute}
            </span>
          </div>
        </div>

        {/* Itinerary Layout: If any day has an image, render 2-column layout with right sticky image. Otherwise, span full width. */}
        <div className={hasAnyDayImages ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" : "w-full"}>
          
          {/* Left / Main Column: All Days Rendered Directly in UI */}
          <div className={hasAnyDayImages ? "lg:col-span-7 space-y-6" : "w-full space-y-6"}>
            {pkg.itinerary.map((d) => {
              const dImg = getDayImage(d);
              const isActive = activeDayNumber === d.day;

              return (
                <div
                  key={`itinerary-day-${d.day}`}
                  id={`itinerary-day-${d.day}`}
                  data-day={d.day}
                  className={`rounded-3xl border bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 scroll-mt-44 ${
                    isActive
                      ? 'border-[#d98f5b] ring-2 ring-[#d98f5b]/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3 min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#d98f5b] text-white font-extrabold text-xs tracking-wider uppercase shadow-xs shrink-0">
                        Day {d.day}
                      </span>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#0B1F2A] truncate whitespace-nowrap" title={d.title}>
                        {d.title}
                      </h3>
                    </div>
                    {d.stay && (
                      <span className="text-xs font-semibold text-slate-500 shrink-0 hidden xs:inline-block sm:inline-block">
                        📍 {d.stay.split(',')[0]}
                      </span>
                    )}
                  </div>

                  {/* Day Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-manrope">
                    {d.description}
                  </p>

                  {/* Stay & Meal Badges */}
                  <div className="pt-3 mt-3 border-t border-slate-100 space-y-2 text-xs font-manrope">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {d.stay && (
                        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <Hotel className="h-4 w-4 text-[#0D57C6] shrink-0" />
                          <span className="truncate font-medium">
                            <strong>Stay:</strong> {d.stay}
                          </span>
                        </div>
                      )}
                      {d.meals && (
                        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <Coffee className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="truncate font-medium">
                            <strong>Meal:</strong> {d.meals}
                          </span>
                        </div>
                      )}
                    </div>

                    {d.activities && d.activities.length > 0 && (
                      <div className="flex items-start gap-2 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 text-amber-950">
                        <Sparkles className="h-4 w-4 text-[#d98f5b] shrink-0 mt-0.5" />
                        <div className="leading-snug">
                          <strong>Key Activities:</strong> {d.activities.join(' • ')}
                        </div>
                      </div>
                    )}

                    {/* Mobile-Only Photo Preview (rendered ONLY if admin uploaded an image for this day) */}
                    {dImg && (
                      <div className="lg:hidden relative h-48 w-full rounded-2xl overflow-hidden border border-slate-200 mt-3">
                        <Image
                          src={dImg.url}
                          alt={dImg.caption}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                            {dImg.location}
                          </span>
                          <p className="text-xs font-medium text-slate-200 truncate mt-0.5">{dImg.caption}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Sticky Day Destination Image on Scroll (ONLY rendered if package has day images) */}
          {hasAnyDayImages && (
            <div className="hidden lg:block lg:col-span-5 sticky top-28 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xl p-3">
                {/* Image Frame - rendered ONLY if active day has an image */}
                {currentDayImage ? (
                  <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 group">
                    <Image
                      key={`sticky-img-${currentDay?.day}`}
                      src={currentDayImage.url}
                      alt={currentDayImage.caption}
                      fill
                      priority
                      sizes="(max-width: 1200px) 40vw, 450px"
                      className="object-cover transition-all duration-700 animate-in fade-in zoom-in-95 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B1F2A]/85 backdrop-blur-md px-3 py-1 text-xs font-extrabold text-white border border-white/20 shadow-xs">
                        <Calendar className="h-3.5 w-3.5 text-[#d98f5b]" />
                        Day {currentDay?.day} of {pkg.itinerary.length}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white border border-white/20">
                        <MapPin className="h-3 w-3 text-saffron" />
                        {currentDayImage.location}
                      </span>
                    </div>

                    {/* Bottom Caption & Title */}
                    <div className="absolute bottom-3.5 left-4 right-4 text-white space-y-1">
                      <h4 className="text-sm font-bold text-white leading-snug drop-shadow-md">
                        {currentDay?.title}
                      </h4>
                      <p className="text-xs text-slate-200 font-medium drop-shadow-sm truncate">
                        {currentDayImage.caption}
                      </p>
                    </div>
                  </div>
                ) : null}

                {/* Quick Jump Pills & Hotel Info */}
                <div className="p-3 pt-4 space-y-3 font-manrope">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0B1F2A]">Jump to Day:</span>
                    <span className="text-[11px] text-slate-500">Auto-updates on scroll</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {pkg.itinerary.map((d) => {
                      const isCurrent = d.day === (currentDay?.day ?? 1);
                      return (
                        <button
                          key={`quick-jump-${d.day}`}
                          type="button"
                          onClick={() => {
                            setActiveDayNumber(d.day);
                            const el = document.getElementById(`itinerary-day-${d.day}`);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }}
                          className={`h-8 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                            isCurrent
                              ? 'bg-[#0B1F2A] text-white shadow-sm ring-2 ring-[#d98f5b]'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                          title={d.title}
                        >
                          Day {d.day}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="truncate max-w-[200px]">
                      🏨 {currentDay.stay ? currentDay.stay.split(',')[0] : 'Luxury Stay'}
                    </span>
                    <span className="text-emerald-700 font-semibold shrink-0">
                      ☕ {currentDay.meals || 'Breakfast & Dinner'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── 4. STAY & ACCOMMODATION STANDARDS ── */}
      <section id="stay" className="space-y-5 scroll-mt-36 animate-in fade-in duration-200">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F2A]">
            Handpicked Stays & Houseboat Standards
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-manrope">
            Carefully vetted mountain properties with central heating and scenic views.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {staysOptions.map((stay, idx) => (
            <div
              key={stay.id || idx}
              className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all"
            >
              <div className="relative h-48 w-full bg-slate-900">
                <Image
                  src={stay.image || '/images/gallery/shikara-dal-lake.jpg'}
                  alt={stay.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute top-3 left-3 bg-[#0B1F2A]/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs border border-white/20">
                  {stay.type}
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-bold text-base">{stay.name}</h4>
                  <p className="text-xs text-slate-200">{stay.location}</p>
                </div>
              </div>

              <div className="p-5 space-y-3 text-xs text-slate-700 font-manrope">
                {stay.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-[#d98f5b] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DEDICATED PRIVATE TRANSPORT FLEET ── */}
      <section id="transport" className="space-y-6 scroll-mt-36 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F2A] flex items-center gap-2">
              <Car className="h-6 w-6 text-[#d98f5b]" />
              <span>Dedicated Private Transport Fleet</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-manrope">
              100% Dedicated Private Cab with Police-Verified Mountain Chauffeur. No shared rides.
            </p>
          </div>

          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            All Tolls, Fuel & Parking Included
          </span>
        </div>

        {/* Fleet Interactive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fleetOptions.map((car, idx) => {
            const carKey = car.id || car.name || `fleet-${idx}`;
            const isSelected = selectedFleetCar === carKey || (selectedFleetCar === 'crysta' && idx === 0);
            return (
              <div
                key={carKey}
                onClick={() => setSelectedFleetCar(carKey)}
                className={`rounded-3xl border-2 overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#d98f5b] bg-amber-50/20 shadow-md ring-2 ring-[#d98f5b]/30'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  {/* Vehicle Image */}
                  <div className="relative h-40 w-full bg-slate-900">
                    <Image
                      src={car.image || '/images/fleet/innova-crysta.jpg'}
                      alt={car.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
                    
                    {/* Vehicle Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-[#0B1F2A]/85 text-white text-[10px] font-bold backdrop-blur-xs border border-white/20">
                        {car.seats}
                      </span>
                      {car.tag && (
                        <span className="px-2 py-0.5 rounded-full bg-[#d98f5b] text-white text-[9px] font-bold shadow-xs">
                          {car.tag}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <h4 className="font-bold text-sm sm:text-base leading-tight">{car.name}</h4>
                      <p className="text-[11px] text-slate-200">{car.type}</p>
                    </div>
                  </div>

                  {/* Vehicle Specs & Details */}
                  <div className="p-3.5 space-y-2.5 text-xs font-manrope">
                    {car.ideal && (
                      <div className="flex items-center justify-between text-slate-600 pb-2 border-b border-slate-100">
                        <span className="font-semibold text-[#0B1F2A]">Ideal:</span>
                        <span className="text-right text-[11px] truncate max-w-[150px]">{car.ideal}</span>
                      </div>
                    )}

                    <div className="space-y-1 text-[11px] text-slate-700">
                      {car.features.slice(0, 3).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    {car.luggage || 'Luggage Included'}
                  </span>
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-[#d98f5b]' : 'text-slate-400'}`}>
                    {isSelected ? '✓ Selected' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Point Mountain Driving Quality Guarantee */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3 text-xs font-manrope">
          <h4 className="font-bold text-sm text-[#0B1F2A] flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>The Indian Wings Company — Mountain Driving Code</span>
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-700">
            <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200/80">
              <Fuel className="h-4 w-4 text-[#d98f5b] shrink-0 mt-0.5" />
              <span><strong>100% Pre-Paid:</strong> Fuel, inter-state permit, highway tolls & parking all pre-paid.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200/80">
              <Users className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Verified Chauffeurs:</strong> Courteous, non-smoking locals with 10+ years snow experience.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200/80">
              <ShieldAlert className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Snow Chain Ready:</strong> Heavy snow chains equipped for winter ascents.</span>
            </div>
            <div className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200/80">
              <Clock className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <span><strong>Airport Punctuality:</strong> Morning pickup ensures airport arrival 3 hours prior.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. INCLUSIONS & EXCLUSIONS ── */}
      <section id="inclusions" className="space-y-4 scroll-mt-36 animate-in fade-in duration-300">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F2A]">
            Inclusions & Exclusions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-manrope">
            Transparent breakdown with zero hidden surprises at checkout.
          </p>
        </div>

        <PackageInclusionsExclusions
          inclusions={pkg.inclusions}
          exclusions={pkg.exclusions}
          hideHeader={true}
        />
      </section>

      {/* ── 7. FREQUENTLY ASKED QUESTIONS ── */}
      <section id="faqs" className="space-y-4 scroll-mt-36 animate-in fade-in duration-300">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F2A] flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-[#d98f5b]" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-manrope">
            Answers to the most common questions travelers ask our Srinagar desk.
          </p>
        </div>

        <PackageFaqSection packageTitle={pkg.title} faqs={pkg.faqs && pkg.faqs.length > 0 ? pkg.faqs : undefined} hideHeader={true} />
      </section>

      {/* ── 8. CANCELLATION & RESCHEDULING POLICY ── */}
      <section id="cancellation" className="space-y-5 scroll-mt-36 animate-in fade-in duration-300">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1F2A] flex items-center gap-2">
              <RotateCcw className="h-6 w-6 text-[#d98f5b]" />
              <span>Cancellation & Rescheduling Policy</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-manrope">
              Clear, transparent terms and 100% free date rescheduling for peace of mind.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            Zero Rescheduling Fee
          </span>
        </div>

        {/* Cancellation Policy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cancellationTiers.map((tier, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0B1F2A]">{tier.window}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#d98f5b] text-white text-[10px] font-bold">{tier.refund}</span>
              </div>
              <p className="text-xs text-slate-600 font-manrope">
                {tier.note}
              </p>
            </div>
          ))}
        </div>

        {/* Snow & Flight Weather Protection Guarantee */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3 text-xs font-manrope">
          <h4 className="font-bold text-sm text-[#0B1F2A] flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Kashmir Weather & Flight Disruption Guarantee</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
              <strong className="text-[#0B1F2A] block">❄️ Snowfall & Highway Closure Protection:</strong>
              <span>If heavy snowfall or landslides block Srinagar highway or airport, we reschedule your tour with zero date-change penalties.</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
              <strong className="text-[#0B1F2A] block">⚡ 1-Click WhatsApp Support:</strong>
              <span>To request a change or cancellation, message our 24/7 Srinagar helpline. Approved refunds are credited within 5-7 business days.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Download Itinerary Modal */}
      <DownloadItineraryModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        pkg={pkg}
      />
    </div>
  );
};
