'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, ShieldCheck, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/config/site-config';
import { queueLeadLocally, removePendingLead } from '@/lib/utilities/offline-queue';
import { getAttributionData } from '@/lib/utilities/attribution';
import { trackFormStart, trackFormSubmit, trackWhatsAppClick } from '@/lib/utilities/analytics';
import { getVisitorId, trackTelemetryEvent } from '@/lib/utilities/telemetry';

interface EnquiryFormProps {
  onSuccess?: () => void;
  isCompact?: boolean;
  touchBottom?: boolean;
  source?: string;
  defaultTripType?: string;
  defaultPackageTitle?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  onSuccess,
  isCompact = false,
  touchBottom = false,
  source = 'website_inline',
  defaultTripType,
  defaultPackageTitle,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    travelDate: '',
    nights: '',
    guests: '2-4 Guests',
    tripType: defaultTripType || 'Kashmir Classic',
    message: defaultPackageTitle ? `Inquiry regarding ${defaultPackageTitle}` : '',
    hpField: '',
  });

  React.useEffect(() => {
    if (defaultTripType) {
      setFormData((prev) => ({ ...prev, tripType: defaultTripType }));
    }
    if (defaultPackageTitle) {
      setFormData((prev) => ({
        ...prev,
        message: `Inquiry regarding ${defaultPackageTitle}`,
      }));
    }
  }, [defaultTripType, defaultPackageTitle]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState('');
  const [error, setError] = useState('');
  const [hasTrackedStart, setHasTrackedStart] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

    if (!formData.name.trim() || !formData.phone.trim() || !formData.travelDate.trim()) {
      setError('Please fill in your name, phone or WhatsApp number, and travel date.');
      return;
    }

    if (formData.email.trim() && !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    if (formData.hpField && formData.hpField.trim() !== '') {
      setIsSubmitting(false);
      setSubmitted(true);
      return;
    }

    const attribution = getAttributionData();

    const combinedMessage = [
      formData.nights.trim() ? `Duration: ${formData.nights.trim()}` : '',
      formData.message.trim(),
    ].filter(Boolean).join(' | ');

    const leadPayload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() ? formData.email.trim().toLowerCase() : undefined,
      travelDate: formData.travelDate.trim(),
      guests: formData.guests,
      tripType: formData.tripType,
      message: combinedMessage,
      source,
      hpField: formData.hpField,
      visitorId: getVisitorId(),
      ...attribution,
    };

    trackTelemetryEvent('MODAL_OPEN', window.location.pathname, `Enquiry Form Submit (${formData.tripType})`, {
      package: defaultPackageTitle,
      tripType: formData.tripType,
    });

    const pendingLead = queueLeadLocally(leadPayload);

    trackFormSubmit(source, formData.tripType);

    const formattedPhone = formData.phone.trim();
    const message =
      `*New Kashmir Trip Enquiry — The Indian Wings Company*\n\n` +
      `👤 *Name:* ${formData.name.trim()}\n` +
      `📞 *Phone/WhatsApp:* ${formattedPhone}\n` +
      (formData.email.trim() ? `✉️ *Email:* ${formData.email.trim()}\n` : '') +
      `📅 *Travel Dates:* ${formData.travelDate.trim()}\n` +
      (formData.nights.trim() ? `🌙 *Duration / Nights:* ${formData.nights.trim()}\n` : '') +
      `👥 *Travellers:* ${formData.guests}\n` +
      `🏔️ *Trip Preference:* ${formData.tripType}\n` +
      (formData.message.trim() ? `💬 *Special Requests:* ${formData.message.trim()}\n` : '') +
      `\n_Sent from the website inquiry form._`;

    const cleanContactPhone = siteConfig.contact.phone.replace(/[^0-9]/g, '');
    const finalWhatsAppUrl = `https://wa.me/${cleanContactPhone}?text=${encodeURIComponent(message)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        removePendingLead(pendingLead.tempId);
      } else {
        const errJson = await response.json().catch(() => ({}));
        let errorMsg = errJson.message || errJson.error || 'Failed to submit enquiry. Please check your details.';
        if (errJson.details) {
          const firstErr = Object.values(errJson.details)[0];
          errorMsg = Array.isArray(firstErr) ? firstErr[0] : (typeof firstErr === 'string' ? firstErr : errorMsg);
        }
        setError(errorMsg);
        setIsSubmitting(false);
        return;
      }
    } catch (apiError: any) {
      if (apiError.name === 'AbortError') {
        setError('Connection timed out. Please check your connection or send your enquiry via WhatsApp below.');
        setIsSubmitting(false);
        return;
      }
    } finally {
      clearTimeout(timeoutId);
    }

    setSubmittedWhatsAppUrl(finalWhatsAppUrl);
    setIsSubmitting(false);
    setSubmitted(true);

    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 4000);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-[#F8F6F0] rounded-xl border border-midnight/10 animate-in fade-in duration-300">
        <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mb-3.5 shadow-sm">
          <CheckCircle2 size={24} className="text-emerald-600" />
        </div>
        <h3 className="font-playfair text-xl sm:text-2xl font-bold text-midnight mb-2">
          Thank You, {formData.name}!
        </h3>
        <p className="font-manrope text-[14px] text-midnight/75 max-w-md mb-4 leading-relaxed">
          Your Kashmir trip enquiry has been safely received. Our destination specialist is reviewing your travel requirements and will connect with you shortly with your custom itinerary and transparent quote.
        </p>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mb-5 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Inquiry secured & queued for priority response</span>
        </div>

        {submittedWhatsAppUrl && (
          <div className="mb-4">
            <a
              href={submittedWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick(source)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <MessageSquare size={15} />
              <span>Chat on WhatsApp Directly (Optional)</span>
            </a>
          </div>
        )}

        <button
          onClick={() => {
            setSubmitted(false);
            setSubmittedWhatsAppUrl('');
            setFormData({
              name: '',
              phone: '',
              email: '',
              travelDate: '',
              nights: '',
              guests: '2-4 Guests',
              tripType: 'Kashmir Classic',
              message: '',
              hpField: '',
            });
          }}
          className="text-xs font-semibold text-midnight/70 hover:text-midnight underline cursor-pointer"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full flex-1 flex flex-col justify-between ${isCompact ? 'gap-2.5 sm:gap-3' : 'gap-4'}`}>
      <div className={`flex flex-col ${isCompact ? 'gap-2.5 sm:gap-3' : 'gap-4'}`}>
        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
            {error}
          </div>
        )}

        {defaultPackageTitle && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-saffron/15 border border-saffron/30 text-midnight text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-saffron shrink-0 animate-pulse" />
            <span className="truncate">Inquiring for: <strong className="font-bold text-midnight">{defaultPackageTitle}</strong></span>
          </div>
        )}

        <div className="hidden" aria-hidden="true">
          <label htmlFor="enquiry-hp">Do not fill this field</label>
          <input
            type="text"
            id="enquiry-hp"
            name="hpField"
            value={formData.hpField}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isCompact ? 'gap-2.5 sm:gap-3' : 'gap-4'}`}>
          <div>
            <label
              htmlFor="enquiry-name"
              className={`block font-manrope font-bold uppercase tracking-[0.05em] text-midnight/80 ${isCompact ? 'text-[11px] mb-1' : 'text-xs mb-1.5'}`}
            >
              Full Name <span className="text-saffron">*</span>
            </label>
            <input
              type="text"
              id="enquiry-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Rahul Sharma"
              required
              disabled={isSubmitting}
              className={`w-full ${isCompact ? 'h-10 sm:h-9.5 px-3 text-[16px] sm:text-[13px]' : 'h-11 px-3.5 text-[16px] sm:text-sm'} rounded-lg border border-midnight/20 bg-white text-midnight placeholder:text-midnight/35 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors disabled:opacity-60`}
            />
          </div>

          <div>
            <label
              htmlFor="enquiry-phone"
              className={`block font-manrope font-bold uppercase tracking-[0.05em] text-midnight/80 ${isCompact ? 'text-[11px] mb-1' : 'text-xs mb-1.5'}`}
            >
              Phone / WhatsApp <span className="text-saffron">*</span>
            </label>
            <input
              type="tel"
              id="enquiry-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              required
              disabled={isSubmitting}
              className={`w-full ${isCompact ? 'h-10 sm:h-9.5 px-3 text-[16px] sm:text-[13px]' : 'h-11 px-3.5 text-[16px] sm:text-sm'} rounded-lg border border-midnight/20 bg-white text-midnight placeholder:text-midnight/35 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors disabled:opacity-60`}
            />
          </div>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isCompact ? 'gap-2.5 sm:gap-3' : 'gap-4'}`}>
          <div>
            <label
              htmlFor="enquiry-email"
              className={`block font-manrope font-bold uppercase tracking-[0.05em] text-midnight/80 ${isCompact ? 'text-[11px] mb-1' : 'text-xs mb-1.5'}`}
            >
              Email Address <span className="text-saffron">*</span>
            </label>
            <input
              type="email"
              id="enquiry-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="rahul@example.com"
              required
              disabled={isSubmitting}
              className={`w-full ${isCompact ? 'h-10 sm:h-9.5 px-3 text-[16px] sm:text-[13px]' : 'h-11 px-3.5 text-[16px] sm:text-sm'} rounded-lg border border-midnight/20 bg-white text-midnight placeholder:text-midnight/35 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors disabled:opacity-60`}
            />
          </div>

          <div>
            <label
              htmlFor="enquiry-date"
              className={`block font-manrope font-bold uppercase tracking-[0.05em] text-midnight/80 ${isCompact ? 'text-[11px] mb-1' : 'text-xs mb-1.5'}`}
            >
              Approx. Travel Dates <span className="text-saffron">*</span>
            </label>
            <input
              type="text"
              id="enquiry-date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              placeholder="15 Oct / Next Month"
              required
              disabled={isSubmitting}
              className={`w-full ${isCompact ? 'h-10 sm:h-9.5 px-3 text-[16px] sm:text-[13px]' : 'h-11 px-3.5 text-[16px] sm:text-sm'} rounded-lg border border-midnight/20 bg-white text-midnight placeholder:text-midnight/35 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors disabled:opacity-60`}
            />
          </div>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isCompact ? 'gap-2.5 sm:gap-3' : 'gap-4'}`}>
          <div>
            <label
              htmlFor="enquiry-nights"
              className={`block font-manrope font-bold uppercase tracking-[0.05em] text-midnight/80 ${isCompact ? 'text-[11px] mb-1' : 'text-xs mb-1.5'}`}
            >
              No. of Nights
            </label>
            <input
              type="text"
              id="enquiry-nights"
              name="nights"
              value={formData.nights}
              onChange={handleChange}
              placeholder="5 Nights / 6 Days"
              disabled={isSubmitting}
              className={`w-full ${isCompact ? 'h-10 sm:h-9.5 px-3 text-[16px] sm:text-[13px]' : 'h-11 px-3.5 text-[16px] sm:text-sm'} rounded-lg border border-midnight/20 bg-white text-midnight placeholder:text-midnight/35 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors disabled:opacity-60`}
            />
          </div>

          <div>
            <label
              htmlFor="enquiry-guests"
              className={`block font-manrope font-bold uppercase tracking-[0.05em] text-midnight/80 ${isCompact ? 'text-[11px] mb-1' : 'text-xs mb-1.5'}`}
            >
              Number of Travellers
            </label>
            <select
              id="enquiry-guests"
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full ${isCompact ? 'h-10 sm:h-9.5 px-3 text-[16px] sm:text-[13px]' : 'h-11 px-3.5 text-[16px] sm:text-sm'} rounded-lg border border-midnight/20 bg-white text-midnight focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors cursor-pointer disabled:opacity-60`}
            >
              <option value="1-2 Guests">1–2 Guests (Couple / Solo)</option>
              <option value="2-4 Guests">2–4 Guests (Family / Small Group)</option>
              <option value="5-8 Guests">5–8 Guests (Large Family)</option>
              <option value="8+ Guests">8+ Guests (Corporate / Group)</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="enquiry-trip"
            className={`block font-manrope font-bold uppercase tracking-[0.05em] text-midnight/80 ${isCompact ? 'text-[11px] mb-1' : 'text-xs mb-1.5'}`}
          >
            Trip Preference
          </label>
          <select
            id="enquiry-trip"
            name="tripType"
            value={formData.tripType}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full ${isCompact ? 'h-10 sm:h-9.5 px-3 text-[16px] sm:text-[13px]' : 'h-11 px-3.5 text-[16px] sm:text-sm'} rounded-lg border border-midnight/20 bg-white text-midnight focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors cursor-pointer disabled:opacity-60`}
          >
            <option value="Kashmir Classic (Srinagar, Gulmarg, Pahalgam)">
              Kashmir Classic (Srinagar, Gulmarg, Pahalgam)
            </option>
            <option value="Honeymoon Special with Luxury Houseboat">
              Honeymoon Special with Luxury Houseboat
            </option>
            <option value="Adventure & Snow Sports (Gulmarg Skiing & Treks)">
              Adventure & Snow Sports (Gulmarg Skiing & Treks)
            </option>
            <option value="Offbeat Kashmir (Doodhpathri, Gurez, Sinthan Top)">
              Offbeat Kashmir (Doodhpathri, Gurez, Sinthan Top)
            </option>
            <option value="Custom Tailor-made Package">Custom Tailor-made Package</option>
          </select>
        </div>

        {!isCompact && (
          <div>
            <label
              htmlFor="enquiry-message"
              className="block font-manrope text-xs font-bold uppercase tracking-[0.05em] text-midnight/80 mb-1.5"
            >
              Special Requests or Notes{' '}
              <span className="text-midnight/40 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              id="enquiry-message"
              name="message"
              rows={2}
              value={formData.message}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Tell us about hotel preferences, private cabs, or specific sights..."
              className="w-full p-3 rounded-lg border border-midnight/20 bg-white text-midnight text-sm placeholder:text-midnight/35 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-colors resize-none disabled:opacity-60"
            />
          </div>
        )}
      </div>

      <div className={`mt-auto ${touchBottom ? 'pt-2.5 sm:pt-3' : 'pt-3 sm:pt-4 flex flex-col gap-1.5'}`}>
        {touchBottom ? (
          <>
            <p className="text-center font-manrope text-[10.5px] text-midnight/70 mb-2 sm:mb-2.5 px-2">
              By submitting, you agree to receive trip details on WhatsApp/Call as per our{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-midnight font-bold underline hover:text-saffron">
                Privacy Policy
              </a>
              .
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-[calc(100%+1.75rem)] sm:w-[calc(100%+2.5rem)] md:w-[calc(100%+3rem)] -mx-3.5 sm:-mx-5 md:-mx-6 -mb-3.5 sm:-mb-5 md:-mb-6 h-12 sm:h-12.5 md:h-13 bg-saffron text-midnight font-manrope font-bold text-xs sm:text-[13px] tracking-[0.05em] uppercase flex items-center justify-center gap-2 border-t border-black/[0.08] hover:brightness-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed rounded-b-xl lg:rounded-b-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin text-midnight" />
                  <span>Securing Your Enquiry...</span>
                </>
              ) : (
                <>
                  <span>GET FREE CUSTOM QUOTE</span>
                  <Send size={14} className="text-midnight" />
                </>
              )}
            </button>
          </>
        ) : (
          <>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full ${isCompact ? 'h-11 sm:h-10 md:h-10.5 text-xs sm:text-[13px]' : 'h-12 text-sm'} rounded-lg bg-saffron text-midnight font-manrope font-bold tracking-[0.04em] uppercase flex items-center justify-center gap-2 shadow-sm hover:brightness-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin text-midnight" />
                  <span>Securing Your Enquiry...</span>
                </>
              ) : (
                <>
                  <span>GET FREE CUSTOM QUOTE</span>
                  <Send size={14} className="text-midnight" />
                </>
              )}
            </button>

            <p className="text-center font-manrope text-[10.5px] text-midnight/70 leading-relaxed px-1">
              By submitting, you agree to receive customized itineraries via WhatsApp/Call under our{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-midnight font-bold underline hover:text-saffron">
                Privacy Policy
              </a>
              . Zero spam guaranteed.
            </p>
          </>
        )}
      </div>
    </form>
  );
};
