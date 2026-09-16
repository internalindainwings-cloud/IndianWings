'use client';

export interface AttributionData {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  fbclid: string | null;
  referrer: string | null;
}

const STORAGE_KEY = 'tiwc_attribution';

/**
 * Initializes and captures UTM parameters and click IDs from URL into sessionStorage
 * Keeps attribution across page navigations within the session.
 */
export function initAttribution(): AttributionData {
  if (typeof window === 'undefined') {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
      gclid: null,
      fbclid: null,
      referrer: null,
    };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const existingRaw = sessionStorage.getItem(STORAGE_KEY);
    const existing: Partial<AttributionData> = existingRaw ? JSON.parse(existingRaw) : {};

    const current: AttributionData = {
      utmSource: params.get('utm_source') || existing.utmSource || null,
      utmMedium: params.get('utm_medium') || existing.utmMedium || null,
      utmCampaign: params.get('utm_campaign') || existing.utmCampaign || null,
      utmTerm: params.get('utm_term') || existing.utmTerm || null,
      utmContent: params.get('utm_content') || existing.utmContent || null,
      gclid: params.get('gclid') || existing.gclid || null,
      fbclid: params.get('fbclid') || existing.fbclid || null,
      referrer: existing.referrer || (document.referrer ? document.referrer.slice(0, 500) : null),
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
      gclid: null,
      fbclid: null,
      referrer: null,
    };
  }
}

/**
 * Retrieves stored attribution parameters
 */
export function getAttributionData(): AttributionData {
  if (typeof window === 'undefined') {
    return {
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmTerm: null,
      utmContent: null,
      gclid: null,
      fbclid: null,
      referrer: null,
    };
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  return initAttribution();
}
