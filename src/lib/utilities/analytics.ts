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

  // Dispatch window event for lead conversion listeners (e.g., cancel mobile exit popup)
  if (['form_start', 'form_submit', 'whatsapp_click', 'generate_lead'].includes(eventName)) {
    try {
      window.dispatchEvent(new CustomEvent('tiw:lead_action', { detail: { eventName, params } }));
    } catch {
      // ignore
    }
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

import { trackWhatsAppTelemetryClick, trackCallTelemetryClick } from '@/lib/utilities/telemetry';

export function trackCTAClick(buttonName: string, location: string): void {
  trackEvent('cta_click', {
    button_name: buttonName,
    location,
  });

  if (buttonName.toLowerCase().includes('call') || location.toLowerCase().includes('call')) {
    try {
      trackCallTelemetryClick(location, buttonName);
    } catch {
      // ignore
    }
  }
}

export function trackCallClick(source: string, phone?: string): void {
  trackEvent('call_click', {
    source,
    phone,
  });
  try {
    trackCallTelemetryClick(source, phone);
  } catch {
    // ignore
  }
}

export function trackWhatsAppClick(source: string): void {
  trackEvent('whatsapp_click', {
    source,
  });
  try {
    trackWhatsAppTelemetryClick(source);
  } catch {
    // ignore
  }
}

/**
 * Dispatches a verified lead conversion event to GA4 and Google Ads.
 * ONLY called upon verified HTTP 200 database-persisted lead submissions.
 * Never called on raw button clicks or client validation failures.
 */
export function trackLeadConversion(params: {
  enquiryId?: string;
  source?: string;
  tripType?: string;
  value?: number;
}): void {
  if (typeof window === 'undefined') return;

  // 1. GA4 recommended standard event: generate_lead
  trackEvent('generate_lead', {
    lead_id: params.enquiryId,
    event_category: 'engagement',
    event_label: params.source || 'ads_landing',
    trip_type: params.tripType,
    value: params.value || 1.0,
    currency: 'INR',
  });

  // 2. Google Ads specific conversion event (if AW- tag and conversion label are provided in env)
  const rawAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const adsId = rawAdsId && !rawAdsId.includes('XXXX') && rawAdsId.startsWith('AW-') ? rawAdsId.trim() : undefined;
  const rawConversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
  const conversionLabel = rawConversionLabel && !rawConversionLabel.includes('XXXX') ? rawConversionLabel.trim() : undefined;

  if (typeof window.gtag === 'function' && adsId) {
    const sendTo = conversionLabel
      ? (conversionLabel.includes('/') ? conversionLabel : `${adsId}/${conversionLabel}`)
      : adsId;

    window.gtag('event', 'conversion', {
      send_to: sendTo,
      transaction_id: params.enquiryId,
      value: params.value || 1.0,
      currency: 'INR',
    });
  }
}
