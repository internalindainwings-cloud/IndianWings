'use client';

import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { siteConfig } from '@/config/site-config';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export const FloatingContactActions: React.FC = () => {
  const settings = useSiteSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    
    const checkScroll = () => {
      // Appear only after scrolling down 1.3 viewports
      const threshold = window.innerHeight * 1.3;
      const nextValue = window.scrollY > threshold;
      setIsVisible((prev) => (prev === nextValue ? prev : nextValue));
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        checkScroll();
      });
    };

    // Initial check on mount
    checkScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <aside 
      aria-label="Quick contact and social links" 
      className={`flex fixed left-3 sm:left-6 bottom-20 sm:bottom-8 z-50 flex-col gap-2 sm:gap-3 items-center transition-all duration-300 ease-out ${
        isVisible 
          ? 'opacity-100 translate-x-0 pointer-events-auto' 
          : 'opacity-0 -translate-x-6 pointer-events-none'
      }`}
    >
      {/* 1. WhatsApp — Official Platform Green (#25D366) - Top Priority Action */}
      <a
        href={settings.whatsappUrl || siteConfig.contact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 hover:bg-[#20bd5a] active:scale-95 motion-reduce:transform-none motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.34C9.36 7.34 9.09 7.4 8.87 7.65C8.64 7.89 8 8.49 8 9.72C8 10.95 8.89 12.14 9.01 12.31C9.14 12.47 10.77 14.97 13.25 16.05C13.84 16.31 14.3 16.46 14.66 16.57C15.26 16.77 15.8 16.74 16.23 16.67C16.71 16.6 17.71 16.07 17.92 15.48C18.13 14.9 18.13 14.4 18.06 14.29C18 14.19 17.85 14.13 17.61 14.01C17.37 13.89 16.2 13.31 15.98 13.23C15.76 13.15 15.6 13.11 15.44 13.35C15.28 13.6 14.81 14.14 14.67 14.3C14.53 14.47 14.38 14.49 14.14 14.37C13.9 14.25 13.13 14 12.21 13.18C11.49 12.54 11.01 11.75 10.87 11.51C10.73 11.27 10.85 11.14 10.97 11.02C11.08 10.91 11.21 10.73 11.34 10.59C11.46 10.45 11.5 10.34 11.58 10.18C11.66 10.02 11.62 9.87 11.56 9.75C11.5 9.63 11.03 8.47 10.84 7.99C10.65 7.53 10.45 7.59 10.3 7.58C10.16 7.57 10 7.57 9.84 7.57C9.68 7.57 9.53 7.34 9.53 7.34Z"/>
        </svg>
      </a>

      {/* 2. Phone / Call — Indian Wings Midnight Navy Brand Treatment */}
      <a
        href={`tel:${settings.phone || siteConfig.contact.phone}`}
        aria-label="Call The Indian Wings Company"
        className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-midnight text-saffron border border-saffron/40 hover:border-saffron hover:text-warm-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#102a3a] active:scale-95 motion-reduce:transform-none motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
      >
        <Phone className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.2} aria-hidden="true" />
      </a>

      {/* 3. Instagram — Official Brand Gradient */}
      <a
        href={siteConfig.contact.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Instagram"
        className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[linear-gradient(45deg,#f09433_0%,#e6683c_25%,#dc2743_50%,#cc2366_75%,#bc1888_100%)] text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 hover:brightness-105 active:scale-95 motion-reduce:transform-none motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#bc1888]"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </a>
    </aside>
  );
};
