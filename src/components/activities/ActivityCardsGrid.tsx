'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Check, 
  ChevronRight,
  Filter,
  Sparkles,
  Compass,
  MessageCircle
} from 'lucide-react';
import { ADVENTURE_ACTIVITIES, AdventureActivityItem } from '@/data/activities-data';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

type ActivityCategory = 'All' | 'Snow & Winter' | 'Water Sports' | 'Aerial & Flying' | 'Trails & Off-Road';

const CATEGORIES: ActivityCategory[] = [
  'All',
  'Snow & Winter',
  'Water Sports',
  'Aerial & Flying',
  'Trails & Off-Road'
];

export const ActivityCardsGrid: React.FC = () => {
  const { openModal } = useEnquiryModal();
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>('All');
  const [activitiesList, setActivitiesList] = useState<AdventureActivityItem[]>(ADVENTURE_ACTIVITIES);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch('/api/activities');
        const json = await res.json();
        if (json.success && Array.isArray(json.activities) && isMounted) {
          setActivitiesList(json.activities);
        }
      } catch {
        // preserve fallback
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredActivities = activeCategory === 'All'
    ? activitiesList
    : activitiesList.filter((act) => act.category === activeCategory);

  return (
    <section id="activities-grid" className="w-full bg-background py-12 sm:py-16 border-b border-black/[0.08] scroll-mt-24">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-left mb-6 sm:mb-8 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-5 bg-saffron rounded-full"></span>
            <span className="text-saffron font-manrope font-bold text-xs uppercase tracking-widest">
              POPULAR EXPEDITIONS
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0B1F2A]">
            Choose Your Adventure
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#64748B]">
            Certified equipment, licensed instructors, and transparent quotes.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 pb-2 border-b border-black/[0.08]">
          <div 
            className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-nowrap py-1"
            role="tablist"
            aria-label="Filter adventure activities"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full font-manrope text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-saffron text-midnight font-bold shadow-xs'
                      : 'bg-white/70 hover:bg-white text-[#475569] border border-black/10'
                  }`}
                >
                  {cat === 'All' ? 'All Adventures' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Activity Cards Grid */}
        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredActivities.map((act: AdventureActivityItem) => (
              <div
                key={act.id}
                className="group bg-white rounded-xl overflow-hidden border border-black/[0.08] shadow-sm hover:shadow-md hover:border-black/15 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Image Preview */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/5">
                  <Image
                    src={act.imageUrl}
                    alt={act.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-midnight/80 backdrop-blur-md text-[10px] font-manrope font-semibold text-warm-white border border-white/15">
                      {act.category}
                    </span>
                  </div>

                  {act.badge && (
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-saffron text-midnight text-[10px] font-manrope font-bold uppercase tracking-wide">
                        <span>{act.badge}</span>
                      </span>
                    </div>
                  )}

                  {/* Specs Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-1 text-[11px] font-manrope text-warm-white bg-midnight/85 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} className="text-saffron shrink-0" />
                      <span>{act.duration}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Flame size={12} className="text-saffron shrink-0" />
                      <span>{act.difficulty}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-warm-white/80">
                      <span>{act.season}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-[11px] font-manrope text-saffron font-semibold">
                      <MapPin size={12} className="shrink-0" />
                      <span>{act.location}</span>
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-semibold text-[#0B1F2A] group-hover:text-saffron transition-colors">
                      {act.name}
                    </h3>

                    {/* Bullet Tags */}
                    <ul className="space-y-1.5 pt-0.5">
                      {act.tags.map((tag, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs font-sans text-[#475569]">
                          <span className="w-3 h-3 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                            <Check size={8} />
                          </span>
                          <span>{tag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-black/[0.08] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={openModal}
                      className="flex-1 py-2 px-3 rounded-lg bg-saffron text-midnight font-manrope font-bold text-xs hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Compass size={13} />
                      <span>Get Enquiry</span>
                    </button>

                    <a
                      href={`https://wa.me/917827743041?text=Hi%20The%20Indian%20Wings%20Company,%20I%20want%20to%20enquire%20about%20booking%20${encodeURIComponent(act.name)}%20in%20${encodeURIComponent(act.location)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-emerald-700 border border-[#25D366]/30 transition-colors flex items-center justify-center shrink-0"
                      title={`WhatsApp ${act.name}`}
                    >
                      <MessageCircle size={15} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 sm:py-16 text-center rounded-2xl border border-dashed border-black/15 bg-black/[0.02]">
            <Compass size={32} className="mx-auto text-slate-400 mb-2" />
            <p className="font-manrope font-bold text-base text-midnight mb-1">
              No adventure activities available at the moment
            </p>
            <p className="font-manrope text-xs text-slate-500 max-w-md mx-auto">
              We are updating our live adventure experiences. Please contact our adventure desk for custom bookings and permits.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivityCardsGrid;
