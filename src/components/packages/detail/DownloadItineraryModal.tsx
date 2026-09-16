'use client';

import React, { useState } from 'react';
import { X, Download, Mail, Phone, User, CheckCircle2, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import type { EnrichedPackage } from '@/data/package-defaults';
import { generateItineraryPdf } from '@/lib/utilities/pdf-itinerary-generator';
import { getAttributionData } from '@/lib/utilities/attribution';
import { getVisitorId } from '@/lib/utilities/telemetry';
import { siteConfig } from '@/config/site-config';

interface DownloadItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: EnrichedPackage;
}

export const DownloadItineraryModal: React.FC<DownloadItineraryModalProps> = ({
  isOpen,
  onClose,
  pkg,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const attribution = getAttributionData();
      const visitorId = getVisitorId();

      // 1. Send lead and trigger email dispatch via API
      const response = await fetch('/api/itinerary/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          packageSlug: pkg.slug,
          packageTitle: pkg.title,
          duration: pkg.duration,
          startingPrice: pkg.startingPrice,
          destinations: pkg.destinations || [],
          itinerary: pkg.itinerary || [],
          inclusions: pkg.inclusions || [],
          visitorId,
          ...attribution,
        }),
      });

      if (!response.ok) {
        const resData = await response.json().catch(() => ({}));
        throw new Error(resData.message || 'Failed to submit enquiry.');
      }

      // 2. Automatically generate and download the PDF locally for instantaneous delivery
      generateItineraryPdf({
        packageTitle: pkg.title,
        duration: pkg.duration,
        startingPrice: pkg.startingPrice,
        destinations: pkg.destinations || [],
        highlights: pkg.highlights || [],
        inclusions: pkg.inclusions || [],
        itinerary: pkg.itinerary || [],
        travelerName: name.trim() || undefined,
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Download error:', err);
      // Even if API fails, still attempt to give user their PDF
      try {
        generateItineraryPdf({
          packageTitle: pkg.title,
          duration: pkg.duration,
          startingPrice: pkg.startingPrice,
          destinations: pkg.destinations || [],
          highlights: pkg.highlights || [],
          inclusions: pkg.inclusions || [],
          itinerary: pkg.itinerary || [],
          travelerName: name.trim() || undefined,
        });
        setIsSuccess(true);
      } catch {
        setErrorMessage(err?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      `Hi The Indian Wings Company! I just downloaded the itinerary for "${pkg.title}" (${pkg.duration}). My email is ${email}. Please assist me with pricing and seasonal date availability.`
    );
    const cleanPhone = siteConfig.contact.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#0B1F2A]/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d98f5b] mb-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Instant PDF & Email Copy</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F2A] leading-snug">
              Download Detailed Itinerary
            </h2>

            <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-[#475569]">
              <span className="font-bold text-[#0B1F2A] block truncate">{pkg.title}</span>
              <span className="text-[#64748B] text-[11px]">
                {pkg.duration} • ₹{pkg.startingPrice.toLocaleString('en-IN')}/person
              </span>
            </div>

            <p className="text-xs text-[#64748B] mt-3 leading-relaxed">
              Enter your email to instantly download the complete day-by-day travel plan with hotel standards, private cab details, and local Kashmiri tips.
            </p>

            {errorMessage && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Email (Required) */}
              <div>
                <label className="block text-[11px] font-bold text-[#0B1F2A] uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-[#0B1F2A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#d98f5b] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#0B1F2A] hover:bg-[#163040] text-white py-3 px-4 text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#0B1F2A]/20 transition-all active:scale-98 disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-[#d98f5b]" />
                    <span>Preparing PDF & Sending Email...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 text-[#d98f5b]" />
                    <span>Download PDF & Send to Email</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <span className="text-[10px] text-slate-400">
                  🔒 Zero spam guarantee. Your details are safe with our Srinagar office.
                </span>
              </div>
            </form>
          </div>
        ) : (
          /* ── SUCCESS STATE ── */
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#0B1F2A]">Itinerary Downloaded!</h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Your PDF file has downloaded automatically to your device. We have also sent a full copy to{' '}
                <strong className="text-[#0B1F2A]">{email}</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="font-semibold text-[#0B1F2A] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#d98f5b]" />
                Next Recommended Step:
              </div>
              <p className="text-[#475569] text-[11px] leading-relaxed">
                Want to check availability for your dates, upgrade to a luxury houseboat, or get an all-inclusive quote with flights?
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleWhatsAppRedirect}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Talk to Srinagar Team on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Close & Return to Package
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
