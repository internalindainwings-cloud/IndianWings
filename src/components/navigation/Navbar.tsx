'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileBottomDock } from './MobileBottomDock';
import { AnnouncementBar } from './AnnouncementBar';

const MobileMenu = dynamic(
  () => import('./MobileMenu').then((m) => ({ default: m.MobileMenu })),
  { ssr: false }
);



export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-midnight/95 backdrop-blur-md border-b border-warm-white/10 ${
          isScrolled ? 'py-1 sm:py-1.5' : 'py-1.5 sm:py-2'
        }`}
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-midnight) 95%, transparent)'
        }}
      >
        <AnnouncementBar />
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 xl:px-9 flex items-center justify-between gap-2">
          {/* LOGO */}
          <div className="w-[115px] sm:w-[130px] lg:w-[145px] xl:w-[165px] h-8 md:h-10 relative flex items-center shrink-0">
            <Link href="/" className="absolute top-1/2 -translate-y-1/2 left-0 z-50 mt-[1px]">
              <Image
                src="/assets/client_logo.png"
                alt="The Indian Wings Logo"
                width={500}
                height={293}
                className={`object-contain w-auto drop-shadow-md hover:scale-105 transition-all duration-300 origin-left ${
                  isScrolled ? 'h-8 md:h-9 xl:h-9.5' : 'h-8.5 md:h-9.5 xl:h-10'
                }`} 
                loading="eager"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <DesktopNavigation isScrolled={isScrolled} />
          </div>

          {/* Mobile / Tablet Hamburger Toggle */}
          <button
            type="button"
            className="lg:hidden relative z-50 p-2 text-warm-white hover:text-saffron transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={32} className="drop-shadow-[0_2px_3px_rgba(245,158,11,0.85)]" />
            ) : (
              <Menu size={32} className="drop-shadow-[0_2px_3px_rgba(245,158,11,0.85)]" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Rendered only when open to avoid downloading chunk on desktop / initial load */}
      {isMobileMenuOpen && (
        <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Bottom Navigation Capsule Dock (Option 2) */}
      <MobileBottomDock
        isMenuOpen={isMobileMenuOpen}
        onToggleMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      />
    </>
  );
};
