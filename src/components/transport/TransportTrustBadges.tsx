'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Receipt, 
  Clock, 
  Snowflake 
} from 'lucide-react';
import { TRANSPORT_TRUST_PILLARS } from '@/data/transport-data';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'ShieldCheck':
      return <ShieldCheck size={24} className="text-emerald-400" />;
    case 'Receipt':
      return <Receipt size={24} className="text-saffron" />;
    case 'Clock':
      return <Clock size={24} className="text-sky-400" />;
    case 'Snowflake':
    default:
      return <Snowflake size={24} className="text-indigo-400" />;
  }
};

export const TransportTrustBadges: React.FC = () => {
  return (
    <section className="w-full bg-background py-14 sm:py-20 border-b border-black/[0.08]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <span className="text-saffron font-manrope font-bold text-xs uppercase tracking-widest block">
            THE INDIAN WINGS PROMISE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0B1F2A] font-semibold leading-tight">
            Why Travelers Choose Our Kashmir &amp; Jammu Cabs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {TRANSPORT_TRUST_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white border border-black/[0.08] shadow-sm hover:shadow-md transition-all duration-200 space-y-2.5"
            >
              <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center shrink-0">
                {getIcon(pillar.icon)}
              </div>
              <h3 className="font-serif text-sm sm:text-base font-semibold text-[#0B1F2A]">
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

export default TransportTrustBadges;
