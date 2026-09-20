'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Car, 
  MessageCircle, 
  Check, 
  CheckCircle2,
  MapPin, 
  Clock, 
  Milestone
} from 'lucide-react';
import { PICKUP_DROP_ROUTES, PickupDropRoute } from '@/data/transport-data';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

type OriginFilter = 'All' | 'Jammu' | 'Katra' | 'Srinagar' | 'Udhampur';

const ORIGIN_TABS: OriginFilter[] = ['All', 'Jammu', 'Katra', 'Srinagar', 'Udhampur'];

export const PickupDropRoutes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OriginFilter>('All');
  const { openModal } = useEnquiryModal();

  const filteredRoutes = activeTab === 'All'
    ? PICKUP_DROP_ROUTES
    : PICKUP_DROP_ROUTES.filter((route) => route.origin === activeTab);

  return (
    <section id="pickup-drop" className="w-full bg-background py-12 sm:py-16 border-b border-black/[0.08] scroll-mt-24">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Minimal Section Header */}
        <div className="text-left mb-6 sm:mb-8 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-saffron rounded-full"></span>
            <span className="text-saffron font-manrope font-bold text-xs uppercase tracking-widest">
              POPULAR TRANSFERS
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0B1F2A]">
            Jammu • Katra • Srinagar • Udhampur
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#64748B]">
            Fixed transparent pricing. All highway tunnel tolls, fuel, and driver allowances included.
          </p>
        </div>

        {/* Origin Filter Tabs */}
        <div className="mb-6 pb-2 border-b border-black/[0.08]">
          <div 
            className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-nowrap py-1"
            role="tablist"
            aria-label="Filter routes"
          >
            {ORIGIN_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full font-manrope text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-saffron text-midnight font-bold shadow-xs'
                      : 'bg-white/70 hover:bg-white text-[#475569] border border-black/10'
                  }`}
                >
                  {tab === 'All' ? 'All Routes' : `From ${tab}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean, Compact Route Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredRoutes.map((route: PickupDropRoute) => (
            <div
              key={route.id}
              className="p-4 sm:p-5 rounded-xl bg-white border border-black/[0.08] hover:border-black/15 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Route Title & Popular Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-[#0B1F2A] flex items-center gap-1.5">
                      <span>{route.origin}</span>
                      <ArrowRight size={13} className="text-saffron shrink-0" />
                      <span className="text-saffron">{route.destination}</span>
                    </h3>
                    <span className="text-[11px] font-sans text-[#64748B] block mt-0.5">
                      {route.via}
                    </span>
                  </div>

                  {route.isPopular && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-saffron/15 text-saffron text-[10px] font-manrope font-bold uppercase tracking-wide shrink-0 border border-saffron/30">
                      <span>Popular</span>
                    </span>
                  )}
                </div>

                {/* Compact Distance & Time Pill */}
                <div className="flex items-center gap-2 text-xs font-manrope py-1 px-2.5 rounded-lg bg-black/[0.03] border border-black/[0.06] text-[#475569]">
                  <span className="font-semibold text-[#0B1F2A]">{route.distance}</span>
                  <span className="text-black/30">•</span>
                  <span>{route.duration}</span>
                  <span className="text-black/30">•</span>
                  <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    <span>Tolls Included</span>
                  </span>
                </div>

                {/* Highlights as small tags */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {route.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-black/[0.03] text-[#475569] text-[10px] font-sans border border-black/[0.05]"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Cabs available */}
                <div className="text-[11px] font-sans text-[#64748B] flex items-center gap-1.5 pt-1">
                  <Car size={12} className="text-saffron shrink-0" />
                  <span>Available: </span>
                  <span className="text-[#0B1F2A] font-medium">{route.cabs}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-black/[0.08] flex items-center gap-2">
                <button
                  type="button"
                  onClick={openModal}
                  className="flex-1 py-2 px-3 rounded-lg bg-saffron text-midnight font-manrope font-bold text-xs hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Car size={13} />
                  <span>Get Enquiry</span>
                </button>

                <a
                  href={`https://wa.me/917827743041?text=Hi%20The%20Indian%20Wings%20Company,%20I%20want%20to%20enquire%20about%20cab%20from%20${encodeURIComponent(route.routeTitle)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-emerald-700 border border-[#25D366]/30 transition-colors flex items-center justify-center shrink-0"
                  title="WhatsApp"
                >
                  <MessageCircle size={15} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PickupDropRoutes;
