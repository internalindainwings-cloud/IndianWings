'use client';

import React, { useState } from 'react';
import { Phone, ArrowRight, MessageCircle, MapPin, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { getAttributionData } from '@/lib/utilities/attribution';
import { trackLeadConversion, trackCallClick, trackWhatsAppClick } from '@/lib/utilities/analytics';

const GENUINE_PHONE = '+919811808387';
const DISPLAY_PHONE = '+91 98118 08387';
const WHATSAPP_URL = 'https://wa.me/919811808387?text=Hi%20The%20Indian%20Wings%2C%20I%20am%20planning%20a%20Kashmir%20trip.%20Please%20share%20customized%20package%20details.';

export const LandingFinalCta: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQuickCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const attribution = getAttributionData();
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Quick Callback Request',
          phone: cleanPhone.startsWith('+91') ? cleanPhone : `+91${cleanPhone.slice(-10)}`,
          travelDate: 'Flexible / Next Month',
          guests: '2-4 Guests',
          tripType: 'Kashmir Holiday Package',
          message: 'Requested urgent callback from bottom landing CTA.',
          source: 'bottom_cta_quick_callback',
          ...attribution,
        }),
      });
      if (res.ok) {
        const resJson = await res.json().catch(() => ({}));
        trackLeadConversion({
          enquiryId: resJson.id,
          source: 'bottom_cta_quick_callback',
          tripType: 'Kashmir Holiday Package',
        });
      }
      setSubmitted(true);
      setPhone('');
    } catch {
      // Even if network glitches, assure the guest and trigger direct call prompt
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-slate-50/70 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 relative z-20 font-manrope">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Top Header Strip (Compact & Balanced Height) */}
        <div className="bg-[#122986] text-white px-5 py-3 sm:px-8 sm:py-3.5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-semibold text-[#E6B84A] tracking-wide uppercase mb-0.5">
              <Star size={11} fill="#E6B84A" className="text-[#E6B84A]" />
              <span>Srinagar Local Destination Desk</span>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white leading-snug">
              Still Planning? Speak Directly with Our Kashmir Expert
            </h2>
          </div>

          {/* Direct Call Button (Compact Height) */}
          <div className="shrink-0 w-full sm:w-auto">
            <a
              href={`tel:${GENUINE_PHONE}`}
              onClick={() => trackCallClick('ads_bottom_cta_call', GENUINE_PHONE)}
              style={{
                background: 'linear-gradient(90deg, #ffd024, #fb790a 50%, #ffd024)',
              }}
              className="relative overflow-hidden w-full sm:w-auto h-9 sm:h-9.5 px-4 sm:px-4.5 inline-flex items-center justify-center gap-1.5 text-white font-extrabold rounded-lg shadow-sm hover:shadow-md hover:brightness-105 transition-all text-xs sm:text-[13px] active:scale-98 select-none"
            >
              {/* Single Slanted Light Flare (Continuous, GPU-Accelerated) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="thrillo-btn-flare">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="32" viewBox="0 0 24 38" fill="none">
                    <path d="M24 0H14.5L5 38H14.5L24 0Z" fill="white" fillOpacity="0.8" />
                    <path d="M12 0H9.95238L0 38H2.04762L12 0Z" fill="white" fillOpacity="0.8" />
                  </svg>
                </div>
              </div>

              <span className="relative z-10 flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                <Phone size={14} className="text-white" />
                <span>Call {DISPLAY_PHONE}</span>
              </span>
            </a>
          </div>
        </div>

        {/* Content Body: Quick Callback Form & Direct Channels */}
        <div className="p-6 sm:p-8 lg:p-10 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Quick Callback Box */}
            <div className="md:col-span-7">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Request a Free Call Back &amp; Custom Quote
              </h3>
              <p className="text-xs font-semibold text-slate-700 mt-1 mb-4 font-manrope leading-relaxed">
                No automated bot. A local tour planner from our Srinagar office will call you within 15 minutes.
              </p>

              {submitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Callback Request Received!</h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Our Srinagar trip specialist will call your mobile number shortly. You can also message us directly on WhatsApp for an immediate response.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleQuickCallback} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full h-11 pl-12 pr-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:border-[#122986] focus:bg-white focus:ring-1 focus:ring-[#122986] transition-all font-medium placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-11 px-5 bg-[#122986] hover:bg-[#0d1e63] active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-70"
                  >
                    <span>{loading ? 'Submitting...' : 'Request Call Back'}</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              )}
            </div>

            {/* Right: Direct Touchpoints (WhatsApp & Srinagar Office) */}
            <div className="md:col-span-5 md:border-l md:border-slate-200 md:pl-8 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Prefer instant messaging?
                </span>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick('ads_bottom_cta_whatsapp')}
                  className="mt-1.5 flex items-center justify-between p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <MessageCircle size={17} fill="currentColor" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-900">Chat on WhatsApp</div>
                      <div className="text-[11px] text-emerald-700">Instant quotation &amp; photos</div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-emerald-700 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Office Location & Trust Point */}
              <div className="pt-2 text-xs font-semibold text-slate-700 space-y-2 font-manrope">
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#122986] shrink-0 mt-0.5" />
                  <span className="leading-snug"><strong className="text-slate-900 font-bold">Srinagar Office:</strong> Sheikh Palace, 2nd Floor, Khanyar Chowk, Srinagar</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  <span className="leading-snug">Direct local fleet &amp; hotel partnerships. Zero middleman commission.</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
