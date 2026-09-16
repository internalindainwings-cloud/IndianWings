'use client';

type EventParams = Record<string, string | number | boolean | undefined | null>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Fires custom analytics events to GA4 and Microsoft Clarity
 */
export function trackEvent(eventName: string, params: EventParams = {}): void {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // Microsoft Clarity custom event / tag
  if (typeof window.clarity === 'function') {
    window.clarity('event', eventName);
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        window.clarity?.('set', key, String(val));
      }
    });
  }

  if (process.env.NODE_ENV === 'development') {

  }
}

export function trackFormView(formName: string): void {
  trackEvent('form_view', { form_name: formName });
}

export function trackFormStart(formName: string): void {
  trackEvent('form_start', { form_name: formName });
}

export function trackFormSubmit(formName: string, tripType?: string): void {
  trackEvent('form_submit', {
    form_name: formName,
    trip_type: tripType,
  });
}

export function trackCTAClick(buttonName: string, location: string): void {
  trackEvent('cta_click', {
    button_name: buttonName,
    location,
  });
}

export function trackWhatsAppClick(source: string): void {
  trackEvent('whatsapp_click', {
    source,
  });
}
