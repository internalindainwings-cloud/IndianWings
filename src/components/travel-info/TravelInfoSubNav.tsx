'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Phone,
  Plane,
  Car,
  Mountain,
  Snowflake,
  Info,
  ShieldAlert,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

interface SubNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: SubNavItem[] = [
  { id: 'quick-tips', label: 'Crucial Rules', icon: CheckSquare },
  { id: 'connectivity', label: 'SIM & Connectivity', icon: Phone },
  { id: 'airport-logistics', label: 'Airport Protocols', icon: Plane },
  { id: 'local-transport', label: 'Union Cabs & Transport', icon: Car },
  { id: 'gondola-booking', label: 'Gulmarg Gondola', icon: Mountain },
  { id: 'packing-clothing', label: 'Packing & Weather', icon: Snowflake },
  { id: 'money-banking', label: 'Money & Payments', icon: Info },
  { id: 'health-safety', label: 'Health & Safety', icon: ShieldAlert },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
];

export const TravelInfoSubNav: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('quick-tips');

  useEffect(() => {
    let rafId: number | null = null;

    const checkScroll = () => {
      const scrollPosition = window.scrollY + 180;

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveId((prev) => (prev === item.id ? prev : item.id));
            break;
          }
        }
      }
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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <nav 
      aria-label="Travel Information quick navigation"
      style={{ backgroundColor: 'color-mix(in srgb, var(--color-midnight) 6%, white)' }}
      className="sticky top-16 sm:top-20 z-40 w-full backdrop-blur-md border-b border-black/10"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <ul 
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none flex-nowrap py-2.5 sm:py-3 -mx-4 px-4 sm:mx-0 sm:px-0"
          role="tablist"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            const Icon = item.icon;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full font-manrope text-xs sm:text-[13px] font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-saffron text-midnight font-bold shadow-[0_4px_14px_rgba(245,158,11,0.5),0_2px_4px_rgba(0,0,0,0.1)]'
                      : 'text-slate-700 hover:text-midnight hover:bg-black/5 hover:shadow-[0_3px_10px_rgba(245,158,11,0.3)]'
                  }`}
                >
                  <Icon className={`w-[17px] h-[17px] shrink-0 text-current ${
                    isActive
                      ? 'drop-shadow-[0_1.5px_2px_rgba(15,76,84,0.45)]'
                      : 'drop-shadow-[0_2px_3px_rgba(245,158,11,0.7)]'
                  }`} />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default TravelInfoSubNav;
