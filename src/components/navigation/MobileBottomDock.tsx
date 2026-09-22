'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Luggage, Menu, X, Sparkles } from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryModalContext';

interface MobileBottomDockProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  isMenuOpen,
  onToggleMenu,
}) => {
  const pathname = usePathname();
  const { openModal } = useEnquiryModal();

  const isMoreActive =
    isMenuOpen ||
    pathname.startsWith('/bucket-list') ||
    pathname === '/activities';

  return (
    <aside
      aria-label="Mobile navigation dock"
      className="fixed bottom-3.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[410px] lg:hidden select-none pointer-events-auto"
    >
      <nav 
        className="bg-midnight/95 backdrop-blur-md rounded-full border border-warm-white/15 px-2 py-1.5 flex items-center justify-between gap-1"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-midnight) 95%, transparent)'
        }}
      >
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all duration-200 active:scale-95 ${
            pathname === '/' && !isMenuOpen
              ? 'bg-white/10 text-saffron font-bold'
              : 'text-warm-white/75 hover:text-saffron'
          }`}
        >
          <Home size={20} className="drop-shadow-[0_2px_3px_rgba(245,158,11,0.85)]" strokeWidth={pathname === '/' && !isMenuOpen ? 2.4 : 1.9} />
          <span className="text-[9.5px] tracking-tight font-medium leading-none mt-1">
            Home
          </span>
        </Link>

        {/* 2. Packages */}
        <Link
          href="/packages"
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all duration-200 active:scale-95 ${
            pathname.startsWith('/packages') && !isMenuOpen
              ? 'bg-white/10 text-saffron font-bold'
              : 'text-warm-white/75 hover:text-saffron'
          }`}
        >
          <Luggage size={20} className="drop-shadow-[0_2px_3px_rgba(245,158,11,0.85)]" strokeWidth={pathname.startsWith('/packages') && !isMenuOpen ? 2.4 : 1.9} />
          <span className="text-[9.5px] tracking-tight font-medium leading-none mt-1">
            Packages
          </span>
        </Link>

        {/* 3. CENTER CONVERSION PILL (MakeMyTrip Style Instant Quote Trigger) */}
        <button
          type="button"
          onClick={() => openModal({ source: 'mobile_dock_center_quote' })}
          className="flex-[1.2] flex flex-col items-center justify-center py-1.5 px-2 rounded-full font-manrope font-bold transition-all duration-200 hover:brightness-105 active:scale-95 cursor-pointer -my-0.5"
          style={{
            backgroundColor: 'var(--color-saffron)',
            color: 'var(--color-midnight)'
          }}
          aria-label="Get instant custom quote"
        >
          <div className="flex items-center justify-center gap-1">
            <Sparkles size={14} className="shrink-0" />
            <span className="text-[11px] tracking-wide font-extrabold uppercase leading-none">
              Quote
            </span>
          </div>
          <span className="text-[8px] font-semibold opacity-85 leading-tight mt-0.5">
            Free Plan
          </span>
        </button>

        {/* 4. Explore Destinations */}
        <Link
          href="/destinations"
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all duration-200 active:scale-95 ${
            pathname.startsWith('/destinations') && !isMenuOpen
              ? 'bg-white/10 text-saffron font-bold'
              : 'text-warm-white/75 hover:text-saffron'
          }`}
        >
          <Compass size={20} className="drop-shadow-[0_2px_3px_rgba(245,158,11,0.85)]" strokeWidth={pathname.startsWith('/destinations') && !isMenuOpen ? 2.4 : 1.9} />
          <span className="text-[9.5px] tracking-tight font-medium leading-none mt-1">
            Destinations
          </span>
        </Link>

        {/* 5. Menu / More */}
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label={isMenuOpen ? 'Close navigation drawer' : 'Open more navigation links'}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all duration-200 active:scale-95 cursor-pointer ${
            isMoreActive
              ? 'bg-white/10 text-saffron font-bold'
              : 'text-warm-white/75 hover:text-saffron'
          }`}
        >
          {isMenuOpen ? (
            <X size={20} className="drop-shadow-[0_2px_3px_rgba(245,158,11,0.85)]" strokeWidth={2.4} />
          ) : (
            <Menu size={20} className="drop-shadow-[0_2px_3px_rgba(245,158,11,0.85)]" strokeWidth={1.9} />
          )}
          <span className="text-[9.5px] tracking-tight font-medium leading-none mt-1">
            {isMenuOpen ? 'Close' : 'More'}
          </span>
        </button>
      </nav>
    </aside>
  );
};
