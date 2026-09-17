'use client';

import React from 'react';
import { Users, Award, Star, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import type { HeroTrustPill } from '@/data/hero-defaults';

interface HeroActionBarProps {
  trustPills?: HeroTrustPill[];
}

export const HeroActionBar: React.FC<HeroActionBarProps> = ({ trustPills }) => {
  const defaultPills: HeroTrustPill[] = [
    { id: '1', icon: 'users', value: '600+', label: 'Happy Families' },
    { id: '2', icon: 'star', value: '★ 4.9', label: 'Google Reviews' },
    { id: '3', icon: 'award', value: '15+ Years', label: 'Local Experience' },
  ];

  const items = trustPills && trustPills.length > 0 ? trustPills : defaultPills;

  const renderIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'star':
      case 'google':
        return (
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
          </svg>
        );
      case 'award':
        return <Award size={11} strokeWidth={2.2} className="text-[#C5A45E]" />;
      case 'shield':
        return <ShieldCheck size={11} strokeWidth={2.2} className="text-[#C5A45E]" />;
      case 'sparkles':
        return <Sparkles size={11} strokeWidth={2.2} className="text-[#C5A45E]" />;
      case 'heart':
        return <Heart size={11} strokeWidth={2.2} className="text-[#C5A45E]" />;
      case 'users':
      default:
        return <Users size={11} strokeWidth={2.2} className="text-[#C5A45E]" />;
    }
  };

  return (
    <section 
      className="w-full border-y py-[7px] sm:py-[6px] px-2 sm:px-4 relative z-20 shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-300"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-midnight) 45%, transparent)',
        borderColor: 'rgba(197, 164, 94, 0.25)'
      }}
    >
      <div className="w-fit max-w-full mx-auto flex items-center justify-center gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
        {items.map((pill, idx) => (
          <div 
            key={pill.id || idx}
            className="group flex items-center gap-1 sm:gap-1.5 py-[4.5px] sm:py-[5px] px-2 sm:px-2.5 rounded-md sm:rounded-lg backdrop-blur-md sm:backdrop-blur-lg bg-black/30 hover:bg-black/45 border border-[#C5A45E]/40 hover:border-[#C5A45E]/80 shadow-[0_2px_10px_rgba(197,164,94,0.12)] hover:-translate-y-0.5 transition-all duration-200 text-left cursor-default select-none shrink-0"
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-[4px] sm:rounded-md flex items-center justify-center shrink-0 bg-[#C5A45E]/15 border border-[#C5A45E]/30 shadow-[inset_0_1px_0_rgba(197,164,94,0.2)] group-hover:scale-105 transition-transform">
              {renderIcon(pill.icon)}
            </div>
            <div className="flex flex-col text-left leading-none min-w-0">
              <span className="text-[11px] sm:text-[11.5px] md:text-[12px] font-extrabold text-[#C5A45E] tracking-tight truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                {pill.value}
              </span>
              <span className="text-[8px] sm:text-[8.5px] md:text-[9px] text-white/90 font-medium tracking-wide truncate mt-0.5">
                {pill.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
