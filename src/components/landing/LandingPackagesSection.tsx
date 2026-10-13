'use client';

import React, { useState } from 'react';
import {
  Utensils,
  Camera,
  Car,
  Building2,
  Phone,
  Clock,
  X,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import type { EnrichedPackage } from '@/lib/packages-service';
import { getAttributionData } from '@/lib/utilities/attribution';
import { trackLeadConversion } from '@/lib/utilities/analytics';

interface LandingPackagesSectionProps {
  packages: EnrichedPackage[];
}

const PHONE_NUMBER = '+919811808387';

/**
 * Clean package titles for the paid ads landing page:
 * Strips long secondary poetic names (e.g. Darbar-e-Khaas, Jashn-e-Umr, Kam Kharch, Mehfil-e-Parivar, etc.)
 * leaving concise, high-converting English package titles.
 */
export const cleanPackageTitle = (rawTitle: string): string => {
  const title = (rawTitle || '').trim();

  if (/corporate/i.test(title)) return 'Corporate Tour Package';
  if (/senior citizen|senior citizan|ashn-e-umr/i.test(title)) return 'Senior Citizen Group Tour';
  if (/pocket-friendly|kam kharch/i.test(title)) return 'Pocket-Friendly Tour Package';
  if (/small family|deewan-e-khaas/i.test(title)) return 'Small Family Tour Package';
  if (/big family|jashn-e-khandaan/i.test(title)) return 'Big Family Tour Package';
  if (/family tour|mehfil-e-parivar/i.test(title)) return 'Family Tour Package';
  if (/friends group|mehfil-e-yaaran/i.test(title)) return 'Friends Group Tour Package';
  if (/honeymoon|shalimar specia/i.test(title)) return 'Honeymoon Special Package';
  if (/gurez valley/i.test(title)) return 'Gurez Valley Tour';
  if (/winter escape/i.test(title)) return 'Kashmir Winter Escape';
  if (/vaishno devi/i.test(title)) return 'Vaishno Devi Tour Package';

  // Fallback: cut off any trailing hyphen, dash, or colon
  const parts = title.split(/[-—–:]/);
  if (parts.length > 1 && parts[0].trim().length > 3) {
    return parts[0].trim();
  }

  return title;
};

export const LandingPackagesSection: React.FC<LandingPackagesSectionProps> = ({
  packages = [],
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [quoteFormData, setQuoteFormData] = useState({
    name: '',
    phone: '',
    travelDate: '',
    guests: '2-4 Travellers',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGetQuote = (packageTitle: string) => {
    // If screen is scrolled down, open the fast quote modal for convenience
    // or smooth scroll to top
    setSelectedPackage(packageTitle);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteFormData.name.trim() || !quoteFormData.phone.trim()) return;

    setIsSubmitting(true);
    try {
      const cleanDigits = quoteFormData.phone.trim().replace(/\D/g, '');
      const phone = cleanDigits.startsWith('91') && cleanDigits.length === 12
        ? `+${cleanDigits}`
        : `+91${cleanDigits.slice(-10)}`;
      const attribution = getAttributionData();

      const payload = {
        name: quoteFormData.name.trim(),
        phone,
        travelDate: quoteFormData.travelDate || 'Tentative / Next Month',
        guests: quoteFormData.guests,
        tripType: selectedPackage || 'Kashmir Tour Package',
        message: `Requested quote for package: ${selectedPackage || 'Kashmir Tour Package'}`,
        source: 'ads_packages_modal',
        ...attribution,
      };

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const resJson = await res.json().catch(() => ({}));
        trackLeadConversion({
          enquiryId: resJson.id,
          source: 'ads_packages_modal',
          tripType: selectedPackage || 'Kashmir Tour Package',
        });
        setIsSubmitted(true);
      } else {
        // Fallback smooth scroll to hero form if API issue
        setSelectedPackage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      setSelectedPackage(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="packages-section" className="w-full bg-[#FAF9F5] border-t border-slate-200/80 pt-5 sm:pt-7 pb-10 sm:pb-14 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading (Clean, Tight Spacing) */}
        <div className="text-center mb-5 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#122986] tracking-tight">
            Popular Kashmir Tour Packages
          </h2>
          <div className="w-14 h-[2.5px] bg-[#E6B84A] mx-auto mt-2 rounded-full" />
        </div>

        {/* 3 * 3 Cards Grid (Desktop 3 columns, Tablet 2, Mobile 1) */}
        {packages && packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {packages.map((pkg, index) => {
              const displayTitle = cleanPackageTitle(pkg.title);
              const isPocketFriendly =
                displayTitle === 'Pocket-Friendly Tour Package' ||
                /pocket-friendly|kam kharch/i.test(pkg.title) ||
                /pocket-friendly|kam-kharch/i.test(pkg.slug);
              const cardImage = isPocketFriendly
                ? 'https://res.cloudinary.com/wmwdypan/image/upload/v1791816042/new.jpg'
                : (pkg.imageUrl || '/images/gallery/shikara-dal-lake.jpg');

              return (
                <div
                  key={pkg.id}
                  id={index === 0 ? 'first-package-card' : undefined}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* 1. CLEAN PHOTO (NO TAGS AS REQUESTED) */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={cardImage}
                      alt={displayTitle}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 sm:gap-4">
                    {/* Title, Duration & Price (Mentioned Below Photo) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-500">
                          <Clock size={12} className="text-[#B48827]" />
                          <span>{pkg.duration}</span>
                        </span>
                        <div className="text-right leading-none">
                          <span className="text-sm sm:text-base font-extrabold text-[#071936]">
                            {pkg.startingPrice ? `₹${pkg.startingPrice.toLocaleString('en-IN')}` : 'Best Price'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium"> / person</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-base sm:text-[17px] text-[#071936] line-clamp-1 group-hover:text-[#101F55] transition-colors tracking-tight">
                        {displayTitle}
                      </h3>
                    </div>

                    {/* 2. Key Inclusions Grid (Meal, Sightseeing, Car, Hotel) */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Meal */}
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-semibold">
                        <div className="w-6 h-6 rounded-lg bg-amber-50 text-[#B48827] flex items-center justify-center shrink-0">
                          <Utensils size={13} />
                        </div>
                        <span className="truncate">Meal</span>
                      </div>

                      {/* Sightseeing */}
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-semibold">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Camera size={13} />
                        </div>
                        <span className="truncate">Sightseeing</span>
                      </div>

                      {/* Car */}
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-semibold">
                        <div className="w-6 h-6 rounded-lg bg-indigo-50 text-[#101F55] flex items-center justify-center shrink-0">
                          <Car size={13} />
                        </div>
                        <span className="truncate">Car</span>
                      </div>

                      {/* Hotel */}
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-semibold">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Building2 size={13} />
                        </div>
                        <span className="truncate">Hotel</span>
                      </div>
                    </div>

                    {/* 3. Get Quote & Call Buttons */}
                    <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleGetQuote(displayTitle)}
                        className="relative overflow-hidden flex-1 py-2.5 px-3 rounded-xl bg-[#122986] hover:bg-[#0e206b] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer select-none"
                      >
                        {/* Slanted Light Flare (Continuous, GPU-Accelerated) */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                          <div className="thrillo-btn-flare">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="38" viewBox="0 0 24 38" fill="none">
                              <path d="M24 0H14.5L5 38H14.5L24 0Z" fill="white" fillOpacity="0.8" />
                              <path d="M12 0H9.95238L0 38H2.04762L12 0Z" fill="white" fillOpacity="0.8" />
                            </svg>
                          </div>
                        </div>

                        <span className="relative z-10">Get Quote</span>
                        <span className="relative z-10 text-[#E6B84A]">→</span>
                      </button>

                      <a
                        href={`tel:${PHONE_NUMBER}`}
                        className="py-2.5 px-3.5 rounded-xl border border-[#122986]/30 hover:border-[#122986] bg-white hover:bg-[#122986]/5 text-[#122986] text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                        aria-label="Call concierge"
                      >
                        <Phone size={14} className="text-[#122986]" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 text-sm">
            Packages are being loaded...
          </div>
        )}

      </div>

      {/* Quick Quote Modal */}
      {selectedPackage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPackage(null)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedPackage(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="text-lg font-bold text-[#071936]">Quote Request Received!</h4>
                <p className="text-xs text-slate-600">
                  Our Srinagar trip planner will send your customized itinerary and best quote shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPackage(null);
                    setIsSubmitted(false);
                  }}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#122986] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 pr-6">
                  <span className="text-[11px] font-bold text-[#B48827] uppercase">Custom Quote</span>
                  <h4 className="text-base sm:text-lg font-bold text-[#122986] mt-0.5 line-clamp-1">
                    {selectedPackage}
                  </h4>
                </div>

                <form onSubmit={handleModalSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={quoteFormData.name}
                      onChange={(e) => setQuoteFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#122986]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">WhatsApp / Phone Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-xs font-medium text-slate-600">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={quoteFormData.phone}
                        onChange={(e) =>
                          setQuoteFormData((prev) => ({
                            ...prev,
                            phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                          }))
                        }
                        className="w-full px-3 py-2 rounded-r-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#122986]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Travel Date</label>
                      <input
                        type="date"
                        value={quoteFormData.travelDate}
                        onChange={(e) => setQuoteFormData((prev) => ({ ...prev, travelDate: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#122986]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Travellers</label>
                      <select
                        value={quoteFormData.guests}
                        onChange={(e) => setQuoteFormData((prev) => ({ ...prev, guests: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#122986] bg-white"
                      >
                        <option>1-2 Travellers</option>
                        <option>2-4 Travellers</option>
                        <option>5-8 Travellers</option>
                        <option>8+ Travellers</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative overflow-hidden w-full mt-2 py-3 rounded-xl bg-[#122986] hover:bg-[#0e206b] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 select-none"
                  >
                    {/* Slanted Light Flare (Continuous, GPU-Accelerated) */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                      <div className="thrillo-btn-flare">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="38" viewBox="0 0 24 38" fill="none">
                          <path d="M24 0H14.5L5 38H14.5L24 0Z" fill="white" fillOpacity="0.8" />
                          <path d="M12 0H9.95238L0 38H2.04762L12 0Z" fill="white" fillOpacity="0.8" />
                        </svg>
                      </div>
                    </div>

                    {isSubmitting ? (
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Loader2 size={14} className="animate-spin" />
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center gap-1.5">
                        <span>Get Free Custom Quote</span>
                        <span className="text-[#E6B84A]">→</span>
                      </span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
