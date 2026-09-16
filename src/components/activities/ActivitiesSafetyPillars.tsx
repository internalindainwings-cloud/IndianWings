'use client';

import React from 'react';
import { 
  ShieldCheck, 
  LifeBuoy, 
  CloudSun, 
  HeartPulse 
} from 'lucide-react';
import { ACTIVITY_SAFETY_PILLARS } from '@/data/activities-data';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'ShieldCheck':
      return <ShieldCheck size={22} className="text-emerald-400" />;
    case 'LifeBuoy':
      return <LifeBuoy size={22} className="text-sky-400" />;
    case 'CloudSun':
      return <CloudSun size={22} className="text-saffron" />;
    case 'HeartPulse':
    default:
      return <HeartPulse size={22} className="text-rose-400" />;
  }
};

export const ActivitiesSafetyPillars: React.FC = () => {
  return (
    <section className="w-full bg-background py-12 sm:py-16 border-b border-black/[0.08]">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10 space-y-1.5">
          <span className="text-saffron font-manrope font-bold text-xs uppercase tracking-widest block">
            SAFETY FIRST
          </span>
          <h2 className="font-manrope text-2xl sm:text-3xl font-bold text-[#0B1F2A]">
            Hassle-Free, Guided Adventures
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {ACTIVITY_SAFETY_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white border border-black/[0.08] shadow-sm hover:shadow-md transition-all duration-200 space-y-2.5"
            >
              <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center shrink-0">
                {getIcon(pillar.icon)}
              </div>
              <h3 className="font-manrope text-sm sm:text-base font-bold text-[#0B1F2A]">
                {pillar.title}
              </h3>
              <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSafetyPillars;
