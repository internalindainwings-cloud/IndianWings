'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Compass, LucideIcon } from 'lucide-react';

interface SubNavSection {
  id: string;
  label: string;
  icon: LucideIcon;
}

const SECTIONS: SubNavSection[] = [
  { id: 'featured', label: 'Featured Packages', icon: Sparkles },
  { id: 'seasonal', label: 'Seasonal Specials', icon: Calendar },
  { id: 'off-beat', label: 'Off-Beat Kashmir', icon: Compass },
];

export const PackagesSubNav: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('featured');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const item = SECTIONS[i];
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <nav 
      aria-label="Packages sub navigation"
      className="sticky top-16 sm:top-20 z-40 w-full backdrop-blur-md border-y"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-midnight) 6%, white)',
        borderColor: 'color-mix(in srgb, var(--color-midnight) 12%, transparent)'
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <ul 
          className="flex items-center justify-center sm:justify-start gap-2 py-2.5 sm:py-3 overflow-x-auto scrollbar-none flex-nowrap"
          role="tablist"
        >
          {SECTIONS.map((sec) => {
            const isActive = activeId === sec.id;
            const Icon = sec.icon;
            return (
              <li key={sec.id} className="shrink-0">
                <a
                  href={`#${sec.id}`}
                  onClick={(e) => scrollToSection(e, sec.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-manrope text-xs sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-saffron text-midnight font-bold shadow-[0_4px_14px_rgba(245,158,11,0.5),0_2px_4px_rgba(0,0,0,0.1)]'
                      : 'text-[#64748B] hover:text-[#0B1F2A] hover:bg-black/5 hover:shadow-[0_3px_10px_rgba(245,158,11,0.3)]'
                  }`}
                >
                  <Icon className={`w-[17px] h-[17px] shrink-0 text-current ${
                    isActive
                      ? 'drop-shadow-[0_1.5px_2px_rgba(15,76,84,0.45)]'
                      : 'drop-shadow-[0_2px_3px_rgba(245,158,11,0.7)]'
                  }`} />
                  <span>{sec.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default PackagesSubNav;
