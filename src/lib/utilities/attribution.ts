export interface AttributionData {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  fbclid: string | null;
  referrer: string | null;
  landingPage: string | null;
}

const STORAGE_KEY = 'tiwc_attribution';

function sanitizeParam(val: string | null): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Initializes and captures UTM parameters, click IDs, referrer, and initial landing page.
 * Keeps attribution intact across subsequent page navigations within the session.
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
      landingPage: null,
    };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const existingRaw = sessionStorage.getItem(STORAGE_KEY);
    const existing: Partial<AttributionData> = existingRaw ? JSON.parse(existingRaw) : {};

    // Current page path (e.g. /ads or /packages/kashmir-classic)
    const currentPath = window.location.pathname || '/';

    const current: AttributionData = {
      utmSource: sanitizeParam(params.get('utm_source')) || existing.utmSource || null,
      utmMedium: sanitizeParam(params.get('utm_medium')) || existing.utmMedium || null,
      utmCampaign: sanitizeParam(params.get('utm_campaign')) || existing.utmCampaign || null,
      utmTerm: sanitizeParam(params.get('utm_term')) || existing.utmTerm || null,
      utmContent: sanitizeParam(params.get('utm_content')) || existing.utmContent || null,
      gclid: sanitizeParam(params.get('gclid')) || existing.gclid || null,
      fbclid: sanitizeParam(params.get('fbclid')) || existing.fbclid || null,
      referrer: existing.referrer || (document.referrer ? document.referrer.slice(0, 500) : null),
      landingPage: existing.landingPage || currentPath,
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
      landingPage: null,
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
      landingPage: null,
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

/**
 * Human-readable attribution classification.
 * Strict rules:
 * - Google Ads ONLY if gclid is present OR utmSource matches google with paid medium.
 * - NEVER classify as Google Ads solely because landing page is /ads.
 * - Show 'Not available' for missing values.
 */
export interface ReadableAttribution {
  channel: 'Google Ads' | 'Organic Search' | 'Social' | 'Referral' | 'Direct' | 'Unknown';
  medium: string;
  campaign: string;
  searchTerm: string;
  content: string;
  landingPage: string;
  referrerDomain: string;
  action: string;
  hasClickId: boolean;
  clickIdSummary: string;
}

export function classifyAttribution(lead: {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  referrer?: string | null;
  landingPage?: string | null;
  source?: string | null;
}): ReadableAttribution {
  const sourceRaw = (lead.utmSource || '').toLowerCase().trim();
  const mediumRaw = (lead.utmMedium || '').toLowerCase().trim();
  const refRaw = (lead.referrer || '').toLowerCase().trim();
  const hasGclid = Boolean(lead.gclid && lead.gclid.trim().length > 0);
  const hasFbclid = Boolean(lead.fbclid && lead.fbclid.trim().length > 0);

  // 1. Channel Classification
  let channel: ReadableAttribution['channel'] = 'Unknown';
  let readableMedium = lead.utmMedium ? lead.utmMedium.trim() : 'Not available';

  if (hasGclid || ((sourceRaw.includes('google') || sourceRaw.includes('adwords')) && (mediumRaw.includes('cpc') || mediumRaw.includes('paid') || mediumRaw.includes('ppc')))) {
    channel = 'Google Ads';
    if (!lead.utmMedium) readableMedium = 'Paid Search';
  } else if (hasFbclid || ((sourceRaw.includes('facebook') || sourceRaw.includes('instagram') || sourceRaw.includes('meta')) && (mediumRaw.includes('cpc') || mediumRaw.includes('paid')))) {
    channel = 'Social';
    if (!lead.utmMedium) readableMedium = 'Paid Social';
  } else if (sourceRaw.includes('organic') || mediumRaw.includes('organic') || refRaw.includes('google.') || refRaw.includes('bing.') || refRaw.includes('yahoo.')) {
    channel = 'Organic Search';
    if (!lead.utmMedium) readableMedium = 'Organic Search';
  } else if (sourceRaw.includes('social') || sourceRaw.includes('instagram') || sourceRaw.includes('facebook') || sourceRaw.includes('youtube') || refRaw.includes('instagram.com') || refRaw.includes('facebook.com') || refRaw.includes('t.co')) {
    channel = 'Social';
    if (!lead.utmMedium) readableMedium = 'Social';
  } else if (lead.referrer && lead.referrer.startsWith('http') && !refRaw.includes('tourpackageskashmir.com') && !refRaw.includes('localhost')) {
    channel = 'Referral';
    if (!lead.utmMedium) readableMedium = 'Referral';
  } else if (!lead.utmSource && !lead.utmMedium && (!lead.referrer || refRaw === 'direct' || refRaw.includes('tourpackageskashmir.com'))) {
    channel = 'Direct';
    if (!lead.utmMedium) readableMedium = 'Direct Traffic';
  } else if (lead.utmSource) {
    channel = 'Unknown';
  }

  // 2. Action Description based on source component
  let action = 'Form Submission';
  const leadSource = (lead.source || '').toLowerCase();
  if (leadSource.includes('exit_intent')) {
    action = 'Exit Intent Popup';
  } else if (leadSource.includes('quick_callback')) {
    action = 'Quick Callback Form';
  } else if (leadSource.includes('packages_modal')) {
    action = 'Package Quote Modal';
  } else if (leadSource.includes('whatsapp')) {
    action = 'WhatsApp Action';
  } else if (leadSource.includes('call')) {
    action = 'Call CTA Action';
  }

  // 3. Referrer domain extraction
  let referrerDomain = 'Not available';
  if (lead.referrer) {
    try {
      if (lead.referrer.startsWith('http')) {
        const u = new URL(lead.referrer);
        referrerDomain = u.hostname.replace('www.', '');
      } else {
        referrerDomain = lead.referrer.slice(0, 40);
      }
    } catch {
      referrerDomain = lead.referrer.slice(0, 40);
    }
  }

  return {
    channel,
    medium: readableMedium,
    campaign: lead.utmCampaign && lead.utmCampaign.trim() ? lead.utmCampaign.trim() : 'Not available',
    searchTerm: lead.utmTerm && lead.utmTerm.trim() ? lead.utmTerm.trim() : 'Not available',
    content: lead.utmContent && lead.utmContent.trim() ? lead.utmContent.trim() : 'Not available',
    landingPage: lead.landingPage && lead.landingPage.trim() ? lead.landingPage.trim() : (leadSource.startsWith('ads_') ? '/ads' : 'Not available'),
    referrerDomain,
    action,
    hasClickId: hasGclid || hasFbclid,
    clickIdSummary: hasGclid ? `gclid: ${lead.gclid!.slice(0, 15)}...` : hasFbclid ? `fbclid: ${lead.fbclid!.slice(0, 15)}...` : 'None',
  };
}
