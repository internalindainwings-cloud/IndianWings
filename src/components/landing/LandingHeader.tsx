'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { trackCallClick, trackWhatsAppClick } from '@/lib/utilities/analytics';

/**
 * LandingHeader
 * 
 * - Top Offer Banner with Thrillophilia-exact gradient coloring (#ffd024 -> #fb790a -> #ffd024),
 *   Framer Motion animated SVG light beams, and sale countdown timer.
 * - Desktop navigation: Home, Tour Packages, About
 * - Minimal mobile navigation: Logo + Hamburger
 */
export const LandingHeader: React.FC = () => {
  const settings = useSiteSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasCustomLogo = Boolean(settings?.logoUrl && !settings.logoUrl.includes('vishnav_devi'));
  const validLogoSrc = hasCustomLogo && settings?.logoUrl ? settings.logoUrl : '';

  // Live countdown timer state (matching Thrillophilia sale timer)
  const [timeLeft, setTimeLeft] = useState({ days: 8, hrs: 2, min: 26 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.min > 0) return { ...prev, min: prev.min - 1 };
        if (prev.hrs > 0) return { ...prev, hrs: prev.hrs - 1, min: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hrs: 23, min: 59 };
        return prev;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full relative z-30 flex flex-col shrink-0">
      {/* ── 1. Top Offer Banner (Thrillophilia Framer Motion & Color Matching) ── */}
      <div 
        className="relative w-full h-[36px] sm:h-[38px] flex items-center justify-between px-3 sm:px-6 overflow-hidden select-none shrink-0"
        style={{
          background: 'linear-gradient(90deg, #ffd024, #fb790a 50%, #ffd024)',
        }}
      >
        {/* Thrillophilia Slanted Light Flare (Continuous, No Delay, GPU-Accelerated) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="thrillo-top-flare">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 24 38" fill="none">
              <path d="M24 0H14.5L5 38H14.5L24 0Z" fill="white" fillOpacity="0.8" />
              <path d="M12 0H9.95238L0 38H2.04762L12 0Z" fill="white" fillOpacity="0.8" />
            </svg>
          </div>
        </div>

        {/* Banner Text (Exact Thrillophilia Styling) */}
        <div className="relative z-10 w-full flex items-center justify-center text-center">
          <div className="text-white text-[11px] min-[370px]:text-[12px] sm:text-[14px] font-light tracking-tight flex items-center justify-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
            <span className="font-bold mr-1.5 sm:mr-2 tracking-wide uppercase">
              FESTIVE SALE
            </span>
            <span>Save Upto</span>
            <span className="font-bold mx-1 sm:mx-1.5 text-white">
              INR 40,899
            </span>
            <span className="hidden min-[420px]:inline">On your Kashmir trip</span>
          </div>
        </div>

        {/* Thrillophilia Countdown Timer Badge (Visible on Tablet & Desktop) */}
        <div className="relative z-10 hidden sm:flex items-center absolute right-3 sm:right-6">
          <div className="flex items-center h-[26px] px-2.5 rounded-[3px] bg-black/40 text-white text-[12px] sm:text-[13px] font-semibold tracking-tight shadow-inner">
            <span>{timeLeft.days}</span>
            <span className="text-[9px] font-medium text-white/90 ml-0.5 mr-1 self-end pb-0.5">days</span>
            <span className="text-white/60 mx-1">:</span>
            <span>{timeLeft.hrs}</span>
            <span className="text-[9px] font-medium text-white/90 ml-0.5 mr-1 self-end pb-0.5">hrs</span>
            <span className="text-white/60 mx-1">:</span>
            <span>{timeLeft.min}</span>
            <span className="text-[9px] font-medium text-white/90 ml-0.5 self-end pb-0.5">min</span>
          </div>
        </div>
      </div>

      {/* ── 2. Main Navigation Bar ── */}
      <div className="w-full bg-[#071936]/80 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2.5 flex items-center justify-between">
        {/* Left: Indian Wings Brand Logo */}
        <div className="flex items-center">
          <button 
            type="button"
            onClick={() => scrollToSection('top')}
            className="inline-flex items-center transition-transform hover:opacity-95 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#7EB8FF] scale-[1.22] sm:scale-100 origin-left cursor-pointer"
            aria-label="Scroll to top of Kashmir trip landing page"
          >
            {hasCustomLogo && validLogoSrc ? (
              <img
                src={validLogoSrc}
                alt="The Indian Wings Company"
                className="h-7 sm:h-8 md:h-9 w-auto object-contain drop-shadow-md origin-left"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#122986] border border-[#E6B84A]/40 flex items-center justify-center text-[#E6B84A] shadow-xs shrink-0">
                  <svg className="w-4 h-4 text-[#E6B84A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight leading-tight">
                    THE INDIAN WINGS
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-semibold text-[#E6B84A] uppercase tracking-wider leading-none">
                    Company • Srinagar
                  </span>
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Center / Right: Desktop Navigation Links (In-Page Landing Smooth Scrolling) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-medium text-white/90">
          <button 
            type="button"
            onClick={() => scrollToSection('top')}
            className="hover:text-[#E6B84A] transition-colors py-1 cursor-pointer focus:outline-none focus-visible:text-[#E6B84A]"
          >
            Home
          </button>
          <button 
            type="button"
            onClick={() => scrollToSection('packages-section')}
            className="hover:text-[#E6B84A] transition-colors py-1 cursor-pointer focus:outline-none focus-visible:text-[#E6B84A]"
          >
            Tour Packages
          </button>
          <button 
            type="button"
            onClick={() => scrollToSection('why-us')}
            className="hover:text-[#E6B84A] transition-colors py-1 cursor-pointer focus:outline-none focus-visible:text-[#E6B84A]"
          >
            About
          </button>
        </nav>

        {/* Right Desktop CTA: Call Button */}
        <div className="hidden md:flex items-center">
          <a
            href="tel:+919811808387"
            onClick={() => trackCallClick('ads_header_desktop_call', '+919811808387')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white transition-all shadow-sm active:scale-95"
            aria-label="Call concierge +91 98118 08387"
          >
            <Phone size={13} className="text-[#E6B84A]" />
            <span>+91 98118 08387</span>
          </a>
        </div>

        {/* Mobile: Hamburger Toggle Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7EB8FF] active:scale-95 cursor-pointer"
            aria-label="Open mobile navigation menu"
            aria-expanded={isMenuOpen}
          >
            <Menu size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay & Modal */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col justify-start animate-in fade-in duration-200"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="w-full bg-[#071936] border-b border-white/15 p-4 sm:p-5 shadow-2xl flex flex-col gap-4 text-white animate-in slide-in-from-top-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top row with Logo and Close 'X' */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#122986] border border-[#E6B84A]/40 flex items-center justify-center text-[#E6B84A] shadow-xs shrink-0">
                  <svg className="w-4 h-4 text-[#E6B84A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-extrabold text-white tracking-tight leading-tight">
                    THE INDIAN WINGS
                  </span>
                  <span className="text-[8px] font-semibold text-[#E6B84A] uppercase tracking-wider leading-none">
                    Company • Srinagar
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* In-page navigation options */}
            <nav className="flex flex-col space-y-1.5 text-sm font-semibold">
              <button
                type="button"
                onClick={() => scrollToSection('top')}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/10 hover:text-[#E6B84A] transition-colors text-left cursor-pointer"
              >
                <span>Home</span>
                <span className="text-xs text-white/50">↑ Top</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('packages-section')}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#E6B84A] hover:text-[#f6cb5c] transition-colors text-left cursor-pointer font-bold"
              >
                <span>Tour Packages</span>
                <span className="text-xs bg-[#E6B84A] text-slate-950 font-bold px-2 py-0.5 rounded-md shadow-xs">View ↓</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('why-us')}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/10 hover:text-[#E6B84A] transition-colors text-left cursor-pointer"
              >
                <span>Why Travel With Us &amp; Reviews</span>
                <span className="text-xs text-amber-300">★ 4.9</span>
              </button>
            </nav>

            {/* Direct Calling & WhatsApp Support */}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <a
                href="tel:+919811808387"
                onClick={() => {
                  setIsMenuOpen(false);
                  trackCallClick('ads_header_mobile_drawer_call', '+919811808387');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#E6B84A] hover:bg-[#f6cb5c] text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98"
              >
                <Phone size={14} className="text-slate-950" />
                <span>Call Concierge: +91 98118 08387</span>
              </a>
              <a
                href="https://wa.me/919811808387?text=Hello%20Indian%20Wings%20Team%2C%20I%20am%20inquiring%20about%20a%20Kashmir%20trip"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setIsMenuOpen(false);
                  trackWhatsAppClick('ads_header_mobile_drawer_whatsapp');
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all active:scale-98"
              >
                <MessageCircle size={15} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
