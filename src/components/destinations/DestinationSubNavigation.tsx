'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Calendar, Send, Home } from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

interface DestinationSubNavigationProps {
  destinationName: string;
}

export const DestinationSubNavigation: React.FC<DestinationSubNavigationProps> = () => {
  const { openModal } = useEnquiryModal();
  const [activeSection, setActiveSection] = useState<string>('things-to-do');

  // Scrollspy to detect active section in view
  useEffect(() => {
    let rafId: number | null = null;

    const checkScroll = () => {
      const scrollPosition = window.scrollY + 180;

      const thingsSection = document.getElementById('things-to-do');
      const bestTimeSection = document.getElementById('best-time');
      const staySection = document.getElementById('stay');

      if (staySection && scrollPosition >= staySection.offsetTop) {
        setActiveSection((prev) => (prev === 'stay' ? prev : 'stay'));
      } else if (bestTimeSection && scrollPosition >= bestTimeSection.offsetTop) {
        setActiveSection((prev) => (prev === 'best-time' ? prev : 'best-time'));
      } else if (thingsSection && scrollPosition >= thingsSection.offsetTop) {
        setActiveSection((prev) => (prev === 'things-to-do' ? prev : 'things-to-do'));
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      aria-label="Destination sections navigation"
      className="sticky top-16 sm:top-20 z-40 w-full bg-white/95 backdrop-blur-md border-b border-black/10"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Horizontal Navigation Track: Single row on all devices, scrollable if needed */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-2 sm:py-2.5 flex-nowrap">
          {/* 1. Things to Do */}
          <button
            type="button"
            onClick={() => scrollToSection('things-to-do')}
            className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-full font-manrope text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
              activeSection === 'things-to-do'
                ? 'bg-saffron text-midnight shadow-[0_4px_14px_rgba(245,158,11,0.5),0_2px_4px_rgba(0,0,0,0.1)] font-bold'
                : 'text-[#64748B] hover:text-[#0B1F2A] hover:bg-black/5 hover:shadow-[0_3px_10px_rgba(245,158,11,0.3)]'
            }`}
          >
            <CheckSquare className={`w-[17px] h-[17px] shrink-0 text-current ${
              activeSection === 'things-to-do'
                ? 'drop-shadow-[0_1.5px_2px_rgba(15,76,84,0.45)]'
                : 'drop-shadow-[0_2px_3px_rgba(245,158,11,0.7)]'
            }`} />
            <span>Things to Do</span>
          </button>

          {/* 2. Best Time To Visit */}
          <button
            type="button"
            onClick={() => scrollToSection('best-time')}
            className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-full font-manrope text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
              activeSection === 'best-time'
                ? 'bg-saffron text-midnight shadow-[0_4px_14px_rgba(245,158,11,0.5),0_2px_4px_rgba(0,0,0,0.1)] font-bold'
                : 'text-[#64748B] hover:text-[#0B1F2A] hover:bg-black/5 hover:shadow-[0_3px_10px_rgba(245,158,11,0.3)]'
            }`}
          >
            <Calendar className={`w-[17px] h-[17px] shrink-0 text-current ${
              activeSection === 'best-time'
                ? 'drop-shadow-[0_1.5px_2px_rgba(15,76,84,0.45)]'
                : 'drop-shadow-[0_2px_3px_rgba(245,158,11,0.7)]'
            }`} />
            <span>Best Time To Visit</span>
          </button>

          {/* 3. Book Your Trip (Reuses existing Enquiry Modal) */}
          <button
            type="button"
            onClick={openModal}
            className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-full font-manrope text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer text-[#64748B] hover:text-[#0B1F2A] hover:bg-black/5 hover:shadow-[0_3px_10px_rgba(245,158,11,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron flex items-center gap-1.5"
          >
            <Send className="w-[17px] h-[17px] shrink-0 text-current drop-shadow-[0_2px_3px_rgba(245,158,11,0.7)]" />
            <span>Book Your Trip</span>
          </button>

          {/* 4. Stay (Extensible for future Stay section) */}
          <button
            type="button"
            onClick={() => {
              const stayEl = document.getElementById('stay');
              if (stayEl) {
                stayEl.scrollIntoView({ behavior: 'smooth' });
              } else {
                openModal();
              }
            }}
            className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-full font-manrope text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 whitespace-nowrap cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
              activeSection === 'stay'
                ? 'bg-saffron text-midnight shadow-[0_4px_14px_rgba(245,158,11,0.5),0_2px_4px_rgba(0,0,0,0.1)] font-bold'
                : 'text-[#64748B] hover:text-[#0B1F2A] hover:bg-black/5 hover:shadow-[0_3px_10px_rgba(245,158,11,0.3)]'
            }`}
          >
            <Home className={`w-[17px] h-[17px] shrink-0 text-current ${
              activeSection === 'stay'
                ? 'drop-shadow-[0_1.5px_2px_rgba(15,76,84,0.45)]'
                : 'drop-shadow-[0_2px_3px_rgba(245,158,11,0.7)]'
            }`} />
            <span>Stay</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DestinationSubNavigation;
