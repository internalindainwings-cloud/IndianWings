'use client';

import React, { useState } from 'react';
import { CheckCircle2, Loader2, MessageSquare } from 'lucide-react';
import { getAttributionData } from '@/lib/utilities/attribution';
import { trackFormStart, trackFormSubmit, trackWhatsAppClick, trackLeadConversion } from '@/lib/utilities/analytics';
import { getVisitorId, trackTelemetryEvent } from '@/lib/utilities/telemetry';
import { queueLeadLocally, removePendingLead } from '@/lib/utilities/offline-queue';

const COUNTRY_CODES = [
  { code: '+91', label: 'IN (+91)' },
  { code: '+971', label: 'AE (+971)' },
  { code: '+966', label: 'SA (+966)' },
  { code: '+1', label: 'US (+1)' },
  { code: '+44', label: 'UK (+44)' },
  { code: '+65', label: 'SG (+65)' },
  { code: '+60', label: 'MY (+60)' },
  { code: '+61', label: 'AU (+61)' },
  { code: '+968', label: 'OM (+968)' },
  { code: '+974', label: 'QA (+974)' },
  { code: '+965', label: 'KW (+965)' },
  { code: '+973', label: 'BH (+973)' },
];

const GUEST_OPTIONS = [
  '1-2 Travellers',
  '2-4 Travellers',
  '5-8 Travellers',
  '8+ Travellers',
];

export const DEFAULT_PACKAGE_OPTIONS = [
  'Family Tour Package',
  'Honeymoon Special Package',
  'Pocket-Friendly Tour Package',
  'Small Family Tour Package',
  'Big Family Tour Package',
  'Senior Citizen Group Tour',
  'Friends Group Tour Package',
  'Corporate Tour Package',
  'Gurez Valley Tour',
  'Kashmir Winter Escape',
  'Vaishno Devi Tour Package',
  'Customized Itinerary',
];

/**
 * LandingEnquiryForm (Compact / "Chota" Edition)
 * 
 * Space-efficient lead card:
 * - 2-column responsive layout for date & guests
 * - Compact input heights (36-38px)
 * - Retains full 5 fields, validation, attribution, and API connection
 */
export const LandingEnquiryForm: React.FC<{
  source?: string;
  className?: string;
  onSuccess?: () => void;
  hideHeader?: boolean;
  packageOptions?: string[];
  defaultPackage?: string;
}> = ({
  source = 'ads_tourpackageskashmir',
  className,
  onSuccess,
  hideHeader = false,
  packageOptions = DEFAULT_PACKAGE_OPTIONS,
  defaultPackage,
}) => {
  const options = packageOptions && packageOptions.length > 0 ? packageOptions : DEFAULT_PACKAGE_OPTIONS;
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+91',
    phoneNumber: '',
    travelDate: '',
    guests: GUEST_OPTIONS[1], // Default: 2-4 Travellers
    tripType: defaultPackage || options[0],
    hpField: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState('');
  const [error, setError] = useState('');
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');

    if (!hasTrackedStart) {
      setHasTrackedStart(true);
      trackFormStart(source);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }

    const cleanDigits = formData.phoneNumber.replace(/[^\d]/g, '');
    if (!cleanDigits || cleanDigits.length < 7) {
      setError('Please enter a valid WhatsApp number.');
      return;
    }

    if (!formData.travelDate.trim()) {
      setError('Please specify your travel date or month.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    if (formData.hpField && formData.hpField.trim() !== '') {
      setIsSubmitting(false);
      setSubmitted(true);
      return;
    }

    const fullPhoneNumber = `${formData.countryCode}${cleanDigits}`;
    const attribution = getAttributionData();

    const leadPayload = {
      name: formData.name.trim(),
      phone: fullPhoneNumber,
      travelDate: formData.travelDate.trim(),
      guests: formData.guests,
      tripType: formData.tripType,
      message: source === 'ads_exit_intent_popup' 
        ? `Exit-Intent Popup Inquiry (${formData.tripType}, ${formData.guests})`
        : `Direct inquiry from ads hero (${formData.tripType}, ${formData.guests})`,
      source,
      hpField: formData.hpField,
      visitorId: getVisitorId(),
      ...attribution,
    };

    trackTelemetryEvent('MODAL_OPEN', window.location.pathname, `Ads Hero Submit (${formData.tripType})`, {
      tripType: formData.tripType,
      source,
    });

    const pendingLead = queueLeadLocally(leadPayload);
    trackFormSubmit(source, formData.tripType);

    const waText = 
      `*New Kashmir Trip Enquiry — The Indian Wings Company*\n\n` +
      `👤 *Name:* ${formData.name.trim()}\n` +
      `📞 *Phone/WhatsApp:* ${fullPhoneNumber}\n` +
      `📅 *Travel Dates:* ${formData.travelDate.trim()}\n` +
      `👥 *Travellers:* ${formData.guests}\n` +
      `🏔️ *Trip Preference:* ${formData.tripType}\n` +
      `\n_Sent via adds.tourpackageskashmir.com_`;

    const finalWhatsAppUrl = `https://wa.me/917827743041?text=${encodeURIComponent(waText)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const resJson = await response.json().catch(() => ({}));
        removePendingLead(pendingLead.tempId);
        trackLeadConversion({
          enquiryId: resJson.id,
          source: leadPayload.source,
          tripType: leadPayload.tripType,
        });
        if (onSuccess) {
          try { onSuccess(); } catch {}
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        let errorMsg = errJson.message || errJson.error || 'Failed to submit. Please check your details.';
        if (errJson.details) {
          const firstErr = Object.values(errJson.details)[0];
          errorMsg = Array.isArray(firstErr) ? firstErr[0] : (typeof firstErr === 'string' ? firstErr : errorMsg);
        }
        setError(errorMsg);
        setIsSubmitting(false);
        return;
      }
    } catch {
      setError('Network slow. Your lead was saved offline for auto-sync.');
    } finally {
      clearTimeout(timeoutId);
    }

    setSubmittedWhatsAppUrl(finalWhatsAppUrl);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  // SUCCESS STATE
  if (submitted) {
    return (
      <div className={className || "w-full max-w-[320px] sm:max-w-[340px] ml-auto mr-1 sm:mx-auto bg-white/95 backdrop-blur-md rounded-[16px] shadow-2xl p-4 sm:p-5 border border-white/90 text-center animate-in fade-in duration-200"}>
        <div className="w-10 h-10 bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-2">
          <CheckCircle2 size={22} className="text-emerald-600" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-[#071936] mb-1">
          Thank You, {formData.name}!
        </h3>
        <p className="text-xs text-slate-600 max-w-xs mx-auto mb-3 leading-relaxed">
          Your quote request has been received. Our Kashmir specialist will message you on WhatsApp shortly.
        </p>

        {submittedWhatsAppUrl && (
          <a
            href={submittedWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick(source)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-none shadow transition-all mb-2"
          >
            <MessageSquare size={14} />
            <span>Chat on WhatsApp Directly</span>
          </a>
        )}

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-[11px] text-slate-500 hover:text-[#101F55] underline cursor-pointer"
        >
          Submit another request
        </button>
      </div>
    );
  }

  // COMPACT ACTIVE FORM CARD (16PX CORNERS, FROSTED GLASS & WHITE BOLD LABELS)
  return (
    <div className={className || "w-full max-w-[310px] sm:max-w-[340px] ml-auto mr-1 sm:mx-auto bg-black/60 backdrop-blur-xl rounded-[16px] p-3 sm:p-4 border border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.75)]"}>
      {!hideHeader && (
        <div className="mb-1.5 sm:mb-2 flex items-center justify-between">
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              Get Your Kashmir Plan
            </h2>
            <p className="text-[10px] sm:text-[10.5px] text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] opacity-90">
              Instant quote & custom itinerary
            </p>
          </div>
          <span className="px-2 py-0.5 bg-[#D1FADF] text-[#027A48] text-[9.5px] font-extrabold uppercase tracking-wider rounded-[3px] shadow-sm select-none">
            FREE QUOTE
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-1.5 sm:space-y-2">
        <input
          type="text"
          name="hpField"
          value={formData.hpField}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        {error && (
          <div role="alert" className="p-1.5 text-[11px] text-red-200 bg-red-950/80 border border-red-500/40 rounded-sm leading-tight">
            {error}
          </div>
        )}

        {/* 1. Full Name */}
        <div>
          <label htmlFor="compact-name" className="block text-[11.5px] font-bold text-white mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            Full Name <span className="text-amber-400 font-bold">*</span>
          </label>
          <input
            id="compact-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-8 sm:h-8.5 px-2.5 bg-white rounded-[4px] border-none text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ffd024] transition-all font-medium"
          />
        </div>

        {/* 2. WhatsApp Number (with Country Code) */}
        <div>
          <label htmlFor="compact-phone" className="block text-[11.5px] font-bold text-white mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            WhatsApp Number <span className="text-amber-400 font-bold">*</span>
          </label>
          <div className="flex gap-1">
            <div className="w-[85px] shrink-0">
              <select
                id="compact-country"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                aria-label="Country Code"
                className="w-full h-8 sm:h-8.5 px-1 bg-white rounded-[4px] border-none text-[11px] text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#ffd024] cursor-pointer"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <input
                id="compact-phone"
                type="tel"
                name="phoneNumber"
                required
                autoComplete="tel"
                placeholder="10-digit No."
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full h-8 sm:h-8.5 px-2.5 bg-white rounded-[4px] border-none text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ffd024] transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* 3 & 4. Two-Column Row: Travel Date & Travellers */}
        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <label htmlFor="compact-date" className="block text-[11.5px] font-bold text-white mb-0.5 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              Date / Month <span className="text-amber-400 font-bold">*</span>
            </label>
            <input
              id="compact-date"
              type="text"
              name="travelDate"
              required
              placeholder="e.g. 15 May"
              value={formData.travelDate}
              onChange={handleChange}
              className="w-full h-8 sm:h-8.5 px-2 bg-white rounded-[4px] border-none text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ffd024] transition-all font-medium"
            />
          </div>

          <div>
            <label htmlFor="compact-guests" className="block text-[11.5px] font-bold text-white mb-0.5 truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              Travellers
            </label>
            <select
              id="compact-guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              className="w-full h-8 sm:h-8.5 px-1.5 bg-white rounded-[4px] border-none text-[11px] text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#ffd024] cursor-pointer"
            >
              {GUEST_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Package Selection */}
        <div>
          <label htmlFor="compact-trip" className="block text-[11.5px] font-bold text-white mb-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            Select Package
          </label>
          <select
            id="compact-trip"
            name="tripType"
            value={formData.tripType}
            onChange={handleChange}
            className="w-full h-8 sm:h-8.5 px-2 bg-white rounded-[4px] border-none text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#ffd024] cursor-pointer"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Square CTA Button (Thrillophilia-style Gradient & Framer Motion Shimmer) */}
        <div className="pt-0.5">
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: 'linear-gradient(90deg, #ffd024, #fb790a 50%, #ffd024)',
            }}
            className="relative w-full h-8.5 sm:h-9 px-4 text-white font-extrabold text-xs sm:text-sm rounded-none border-none transition-all shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ffd024] overflow-hidden select-none"
          >
            {/* Single Slanted Light Flare (Continuous, No Delay, GPU-Accelerated) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <div className="thrillo-btn-flare">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="38" viewBox="0 0 24 38" fill="none">
                  <path d="M24 0H14.5L5 38H14.5L24 0Z" fill="white" fillOpacity="0.8" />
                  <path d="M12 0H9.95238L0 38H2.04762L12 0Z" fill="white" fillOpacity="0.8" />
                </svg>
              </div>
            </div>

            {/* Button Content */}
            <span className="relative z-10 flex items-center justify-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin text-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Get Free Quote →</span>
                </>
              )}
            </span>
          </button>
        </div>
      </form>

    </div>
  );
};
