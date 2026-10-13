'use client';

import React, { useEffect } from 'react';
import { trackWhatsAppClick } from '@/lib/utilities/analytics';

const WHATSAPP_NUMBER = '919811808387';
const PREFILLED_MESSAGE = 'Hi The Indian Wings, I am planning a Kashmir trip. Please share customized package options & quotes.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`;

/**
 * LandingWhatsAppButton
 *
 * Mobile: Hidden on hero. Fades in as soon as user scrolls past hero (scrollY > 80px)
 *         OR when first package card enters the viewport.
 *         Positioned in the natural right-hand thumb-reach zone (middle-right of screen).
 * Desktop: Always visible at bottom-right corner (right: 24px, bottom: 32px).
 */
export const LandingWhatsAppButton: React.FC = () => {
  useEffect(() => {
    const btn = document.getElementById('floating-whatsapp-concierge-btn');
    if (!btn) return;

    const check = () => {
      // Desktop: always visible via CSS, skip
      if (window.innerWidth >= 640) {
        btn.classList.remove('wa-hero-hidden');
        return;
      }

      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const firstCard = document.getElementById('first-package-card');
      const cardPassed = firstCard
        ? firstCard.getBoundingClientRect().top < window.innerHeight
        : false;

      // Hide only on hero (top of page, not scrolled)
      if (scrollY > 80 || cardPassed) {
        btn.classList.remove('wa-hero-hidden');
      } else {
        btn.classList.add('wa-hero-hidden');
      }
    };

    // Run once immediately — hides on hero
    check();
    const t1 = setTimeout(check, 200);
    const t2 = setTimeout(check, 600);

    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  const handleClick = () => {
    trackWhatsAppClick('ads_floating_thumb_whatsapp');
  };

  return (
    <aside
      id="floating-whatsapp-concierge-btn"
      aria-label="Direct WhatsApp Concierge"
      className="floating-whatsapp-thumb pointer-events-auto select-none"
      style={{
        position: 'fixed',
        zIndex: 999999,
      }}
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current drop-shadow-xs"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.34C9.36 7.34 9.09 7.4 8.87 7.65C8.64 7.89 8 8.49 8 9.72C8 10.95 8.89 12.14 9.01 12.31C9.14 12.47 10.77 14.97 13.25 16.05C13.84 16.31 14.3 16.46 14.66 16.57C15.26 16.77 15.8 16.74 16.23 16.67C16.71 16.6 17.71 16.07 17.92 15.48C18.13 14.9 18.13 14.4 18.06 14.29C18 14.19 17.85 14.13 17.61 14.01C17.37 13.89 16.2 13.31 15.98 13.23C15.76 13.15 15.6 13.11 15.44 13.35C15.28 13.6 14.81 14.14 14.67 14.3C14.53 14.47 14.38 14.49 14.14 14.37C13.9 14.25 13.13 14 12.21 13.18C11.49 12.54 11.01 11.75 10.87 11.51C10.73 11.27 10.85 11.14 10.97 11.02C11.08 10.91 11.21 10.73 11.34 10.59C11.46 10.45 11.5 10.34 11.58 10.18C11.66 10.02 11.62 9.87 11.56 9.75C11.5 9.63 11.03 8.47 10.84 7.99C10.65 7.53 10.45 7.59 10.3 7.58C10.16 7.57 10 7.57 9.84 7.57C9.68 7.57 9.53 7.34 9.53 7.34Z"/>
        </svg>
      </a>
    </aside>
  );
};
