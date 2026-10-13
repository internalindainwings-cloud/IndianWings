'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { LandingEnquiryForm } from './LandingEnquiryForm';

const STORAGE_KEY = 'tiw_ads_exit_intent_dismissed';

/**
 * Helper to detect if another modal is currently open in the DOM
 */
const isAnotherModalOpen = (): boolean => {
  if (typeof document === 'undefined') return false;
  // Look for any dialog or package modal (excluding this exit-intent popup itself)
  const dialogs = document.querySelectorAll('[role="dialog"]');
  for (let i = 0; i < dialogs.length; i++) {
    const el = dialogs[i];
    if (el.id !== 'exit-intent-dialog-root' && !el.id?.includes('exit-intent')) {
      const style = window.getComputedStyle(el);
      if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
        return true;
      }
    }
  }
  return false;
};

/**
 * Robust detection of mobile/tablet devices
 */
const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (window.innerWidth < 768) return true;
  const hasTouch = 'ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0);
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator?.userAgent || ''
  );
  return isMobileUA || (hasTouch && window.innerWidth < 1024);
};

export const LandingExitIntentModal: React.FC<{
  packageOptions?: string[];
}> = ({ packageOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasTriggeredRef = useRef(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Allow URL param to quickly reset session dismissal during manual/mobile verification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__TIW_CLEAR_EXIT_INTENT = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        hasTriggeredRef.current = false;
        console.log('[ExitIntent] Session storage cleared. Modal can trigger again.');
      };
      if (window.location.search.includes('reset_exit_intent') || window.location.search.includes('clear_session')) {
        sessionStorage.removeItem(STORAGE_KEY);
        hasTriggeredRef.current = false;
        console.log('[ExitIntent] Cleared session via URL parameter.');
      }
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    document.body.classList.remove('exit-intent-modal-open');
    document.body.style.overflow = '';
    // Restore focus to previous element for accessibility
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
      previousFocusRef.current.focus();
    }
    console.log('[ExitIntent] Modal closed and session marked as dismissed.');
  }, []);

  const triggerModal = useCallback((triggerSource: 'desktop' | 'mobile') => {
    if (hasTriggeredRef.current) {
      console.warn(`[ExitIntent] Trigger blocked (${triggerSource}): already triggered.`);
      return;
    }
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
        console.warn(`[ExitIntent] Trigger blocked (${triggerSource}): session already dismissed.`);
        return;
      }
    } catch {
      // ignore
    }
    if (isAnotherModalOpen()) {
      console.warn(`[ExitIntent] Trigger blocked (${triggerSource}): another modal is open.`);
      return;
    }

    hasTriggeredRef.current = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.classList.add('exit-intent-modal-open');
    document.body.style.overflow = 'hidden';
    setIsOpen(true);
    console.log(`[ExitIntent] SUCCESS: Popup state set to OPEN from source: ${triggerSource}`);
  }, []);

  // Listen for Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  // ── 1. DESKTOP EXIT-INTENT DETECTION (Prompt trigger, zero artificial delays) ──
  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
        hasTriggeredRef.current = true;
        return;
      }
    } catch {
      // ignore
    }

    if (isMobileDevice()) return; // Desktop only

    let hasInteractedWithPage = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (hasTriggeredRef.current) return;
      if (isMobileDevice()) return;

      if (e.clientY > 35) {
        hasInteractedWithPage = true;
      }

      // Fast upward exit towards browser chrome/tabs
      if (hasInteractedWithPage && e.clientY <= 15 && e.movementY <= 0) {
        triggerModal('desktop');
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (hasTriggeredRef.current) return;
      if (isMobileDevice()) return;

      // Mouse exiting through the top edge of the browser viewport
      if (e.clientY <= 25 || (!e.relatedTarget && e.clientY <= 35)) {
        triggerModal('desktop');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [triggerModal]);

  // ── 2. MOBILE NO-CONVERSION TIMER (60-second timer without lead action) ──
  useEffect(() => {
    const isMobile = isMobileDevice();
    console.log(`[ExitIntent Mobile] Initializing mobile check: isMobile=${isMobile}, innerWidth=${typeof window !== 'undefined' ? window.innerWidth : 'SSR'}`);

    if (!isMobile) return;

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
        hasTriggeredRef.current = true;
        console.log('[ExitIntent Mobile] Session already dismissed in this tab.');
        return;
      }
    } catch {
      // ignore
    }

    let timer: NodeJS.Timeout | null = null;
    let heartbeatInterval: NodeJS.Timeout | null = null;
    let hasLeadActionTaken = false;
    const startTimestamp = Date.now();
    const NO_CONVERSION_LIMIT_MS = 60 * 1000; // Exactly 60 seconds

    console.log('[ExitIntent Mobile] 60s No-Conversion countdown initiated. (Browsing & scrolling will NOT cancel this timer; only a qualifying lead action will cancel it.)');

    const cancelConversionTimer = (reason: string) => {
      if (hasLeadActionTaken) return;
      hasLeadActionTaken = true;
      console.log(`[ExitIntent Mobile] Qualifying lead action detected: "${reason}". 60s conversion timer CANCELLED.`);
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
    };

    // 1. Listen for custom lead action event dispatched by analytics.ts (form_start, form_submit, whatsapp_click, generate_lead)
    const handleLeadEvent = (e: Event) => {
      const customEvt = e as CustomEvent;
      const eventName = customEvt.detail?.eventName || 'custom_lead_action';
      cancelConversionTimer(`analytics_${eventName}`);
    };
    window.addEventListener('tiw:lead_action', handleLeadEvent);

    // 2. Global click listener to catch WhatsApp, Call CTA, or Get Quote modal clicks
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a, button');
      if (!target) return;

      const href = (target.getAttribute('href') || '').toLowerCase();
      const ariaLabel = (target.getAttribute('aria-label') || '').toLowerCase();
      const textContent = (target.textContent || '').toLowerCase();

      // WhatsApp CTA Click
      if (href.includes('wa.me') || href.includes('whatsapp.com') || ariaLabel.includes('whatsapp')) {
        cancelConversionTimer('whatsapp_cta_click');
        return;
      }

      // Call Now / Telephone CTA Click
      if (href.startsWith('tel:') || ariaLabel.includes('call') || textContent.includes('call concierge')) {
        cancelConversionTimer('call_cta_click');
        return;
      }

      // "Get Quote" button click on package card (opens Quick Quote modal)
      if (textContent.includes('get quote') && !target.closest('#exit-intent-dialog-root')) {
        cancelConversionTimer('package_get_quote_click');
        return;
      }
    };
    document.addEventListener('click', handleGlobalClick, { capture: true });

    // 3. Form input engagement listener (when visitor touches/focuses an input on the landing page)
    const handleFormInteraction = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      // If user focuses or types into any form input on the page (other than inside the exit modal itself)
      if (target.closest('form') && !target.closest('#exit-intent-dialog-root')) {
        cancelConversionTimer('user_started_filling_lead_form');
      }
    };
    document.addEventListener('focusin', handleFormInteraction, { capture: true });
    document.addEventListener('input', handleFormInteraction, { capture: true });

    // 4. Timer execution after 60 seconds
    timer = setTimeout(() => {
      if (hasLeadActionTaken || hasTriggeredRef.current) return;

      try {
        if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
          console.log('[ExitIntent Mobile] 60s reached, but session was already dismissed.');
          return;
        }
      } catch {
        // ignore
      }

      // Verify the user is not actively typing in an open form right now
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT' || activeEl.tagName === 'TEXTAREA') && !activeEl.closest('#exit-intent-dialog-root')) {
        cancelConversionTimer('visitor_actively_typing_in_form');
        return;
      }

      // Verify another modal is not currently open
      if (isAnotherModalOpen()) {
        console.log('[ExitIntent Mobile] Another modal is currently active. Deferring popup.');
        return;
      }

      console.log('[ExitIntent Mobile] Full 60 seconds elapsed without a lead conversion! Displaying popup now.');
      triggerModal('mobile');
    }, NO_CONVERSION_LIMIT_MS);

    // Diagnostic heartbeat log every 10 seconds
    heartbeatInterval = setInterval(() => {
      if (hasLeadActionTaken || hasTriggeredRef.current) return;
      const elapsed = Date.now() - startTimestamp;
      const remainingSec = Math.max(0, Math.round((NO_CONVERSION_LIMIT_MS - elapsed) / 1000));
      if (remainingSec > 0 && remainingSec % 10 === 0) {
        console.log(`[ExitIntent Mobile] No-Conversion countdown: ${remainingSec}s remaining until popup`);
      }
    }, 1000);

    return () => {
      if (timer) clearTimeout(timer);
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      window.removeEventListener('tiw:lead_action', handleLeadEvent);
      document.removeEventListener('click', handleGlobalClick, { capture: true });
      document.removeEventListener('focusin', handleFormInteraction, { capture: true });
      document.removeEventListener('input', handleFormInteraction, { capture: true });
    };
  }, [triggerModal]);

  // Clean up body overflow if component unmounts while modal was open
  useEffect(() => {
    return () => {
      document.body.classList.remove('exit-intent-modal-open');
      document.body.style.overflow = '';
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      id="exit-intent-dialog-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
      className="fixed inset-0 z-[1000000] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        // Close if user clicks the dark backdrop outside modal card
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      {/* Modal Dialog Card */}
      <div
        ref={modalContainerRef}
        className="relative w-full max-w-[330px] sm:max-w-[365px] max-h-[92vh] flex flex-col bg-slate-950/95 text-white rounded-[20px] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* ── Top Accent Bar (Original Landing Page Gradient & Shimmer Light Flare) ── */}
        <div
          className="relative w-full h-[9px] sm:h-[10px] overflow-hidden select-none shrink-0"
          style={{
            background: 'linear-gradient(90deg, #ffd024, #fb790a 50%, #ffd024)',
          }}
          aria-hidden="true"
        >
          {/* Slanted Light Flare (Smooth GPU-accelerated beam sweeping across accent bar) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="thrillo-modal-flare">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 38" fill="none">
                <path d="M24 0H14.5L5 38H14.5L24 0Z" fill="white" fillOpacity="0.95" />
                <path d="M12 0H9.95238L0 38H2.04762L12 0Z" fill="white" fillOpacity="0.95" />
              </svg>
            </div>
          </div>
        </div>

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={closeModal}
          aria-label="Close dialog"
          className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd024]"
        >
          <X size={15} />
        </button>

        {/* Modal Scrollable Content Container (Accommodates virtual keyboard gracefully) */}
        <div className="p-3 sm:p-4 overflow-y-auto no-scrollbar">
          {/* Header Message: Matching Package Card Typography (Manrope, font-bold, tracking-tight) */}
          <div className="mb-2.5 pr-7 text-left">
            <h3
              id="exit-modal-title"
              className="text-[17px] sm:text-[19px] font-bold text-white leading-snug tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
            >
              Confused about planning your holiday?
            </h3>
            <p className="text-[11.5px] sm:text-xs text-slate-200 mt-1 leading-snug font-medium">
              Let our experts help you plan a memorable holiday!
            </p>
          </div>

          {/* ── REUSED EXACT LEAD FORM (With Exact Package CTA #122986 Background) ── */}
          <LandingEnquiryForm
            source="ads_exit_intent_popup"
            hideHeader={true}
            packageOptions={packageOptions}
            className="w-full bg-[#122986] rounded-xl p-2.5 sm:p-3 border border-white/15 shadow-md"
            onSuccess={() => {
              // Mark session complete when form submits successfully
              try {
                sessionStorage.setItem(STORAGE_KEY, 'true');
              } catch {
                // ignore
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
