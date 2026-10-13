'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import { siteConfig } from '@/config/site-config';
import { useSiteSettings } from '@/context/SiteSettingsContext';

const MAIN_DOMAIN = 'https://tourpackageskashmir.com';
const GENUINE_PHONE = '+919811808387';
const DISPLAY_PHONE = '+91 98118 08387';
const GENUINE_EMAIL = 'info@tourpackageskashmir.com';
const OFFICE_ADDRESS = 'The Indian Wings Travels, Sheikh Palace, 2nd Floor, Khanyar Chowk, Srinagar, Jammu & Kashmir, 190003';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
      clipRule="evenodd"
    />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
      clipRule="evenodd"
    />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z"
      clipRule="evenodd"
    />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.34C9.36 7.34 9.09 7.4 8.87 7.65C8.64 7.89 8 8.49 8 9.72C8 10.95 8.89 12.14 9.01 12.31C9.14 12.47 10.77 14.97 13.25 16.05C13.84 16.31 14.3 16.46 14.66 16.57C15.26 16.77 15.8 16.74 16.23 16.67C16.71 16.6 17.71 16.07 17.92 15.48C18.13 14.9 18.13 14.4 18.06 14.29C18 14.19 17.85 14.13 17.61 14.01C17.37 13.89 16.2 13.31 15.98 13.23C15.76 13.15 15.6 13.11 15.44 13.35C15.28 13.6 14.81 14.14 14.67 14.3C14.53 14.47 14.38 14.49 14.14 14.37C13.9 14.25 13.13 14 12.21 13.18C11.49 12.54 11.01 11.75 10.87 11.51C10.73 11.27 10.85 11.14 10.97 11.02C11.08 10.91 11.21 10.73 11.34 10.59C11.46 10.45 11.5 10.34 11.58 10.18C11.66 10.02 11.62 9.87 11.56 9.75C11.5 9.63 11.03 8.47 10.84 7.99C10.65 7.53 10.45 7.59 10.3 7.58C10.16 7.57 10 7.57 9.84 7.57C9.68 7.57 9.53 7.34 9.53 7.34Z" />
  </svg>
);

const FOOTER_SECTIONS = [
  {
    title: 'Top Destinations',
    links: [
      { label: 'Srinagar (Dal Lake & Mughal Gardens)', href: `${MAIN_DOMAIN}/destinations/srinagar` },
      { label: 'Gulmarg (Gondola & Snow Peaks)', href: `${MAIN_DOMAIN}/destinations/gulmarg` },
      { label: 'Pahalgam (Betaab & Aru Valleys)', href: `${MAIN_DOMAIN}/destinations/pahalgam` },
      { label: 'Sonamarg (Thajiwas Glacier)', href: `${MAIN_DOMAIN}/destinations/sonamarg` },
      { label: 'Doodhpathri (Valley of Milk)', href: `${MAIN_DOMAIN}/destinations/doodhpathri` },
      { label: 'Explore All Destinations →', href: `${MAIN_DOMAIN}/destinations` },
    ],
  },
  {
    title: 'Packages & Services',
    links: [
      { label: 'All Kashmir Tour Packages', href: `${MAIN_DOMAIN}/packages` },
      { label: 'Verified Luxury Fleet & Cabs', href: `${MAIN_DOMAIN}/transport` },
      { label: 'Adventure Activities (Gondola, Rafting)', href: `${MAIN_DOMAIN}/activities` },
      { label: 'Luxury Houseboats & Shikara Stays', href: `${MAIN_DOMAIN}/packages` },
      { label: 'Custom Honeymoon & Family Tours', href: `${MAIN_DOMAIN}/packages` },
    ],
  },
  {
    title: 'Travel Guides & Advice',
    links: [
      { label: 'Things to Do in Kashmir', href: `${MAIN_DOMAIN}/bucket-list/things-to-do` },
      { label: 'Travel Advisory & FAQs', href: `${MAIN_DOMAIN}/bucket-list/travel-information` },
      { label: 'Clothing & Packing Guide', href: `${MAIN_DOMAIN}/bucket-list/travel-information#clothing` },
      { label: 'Permits, Prepaid SIMs & ATMs', href: `${MAIN_DOMAIN}/bucket-list/travel-information#permits` },
      { label: 'Local Kashmiri Shopping Guide', href: `${MAIN_DOMAIN}/bucket-list/shopping` },
      { label: 'Kashmir Travel Blog & Guides', href: `${MAIN_DOMAIN}/blog` },
    ],
  },
  {
    title: 'Company & Trust',
    links: [
      { label: 'About Us', href: `${MAIN_DOMAIN}/about-us` },
      { label: 'Why Travel With Us', href: '#why-us' },
      { label: 'Client Stories & Reviews', href: '#reviews' },
      { label: 'Safety & Hospitality Standards', href: `${MAIN_DOMAIN}/activities#safety` },
      { label: 'Registered Srinagar Office', href: `${MAIN_DOMAIN}/about-us#office` },
    ],
  },
];

export const LandingFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const settings = useSiteSettings();
  const hasCustomLogo = Boolean(settings?.logoUrl && !settings.logoUrl.includes('vishnav_devi'));
  const validLogoSrc = hasCustomLogo && settings?.logoUrl ? settings.logoUrl : '';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return;

    setSubscribed(true);
    setEmail('');

    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          phone: '+910000000000',
          email: cleanEmail,
          travelDate: 'Newsletter Subscription',
          guests: '1 Guest',
          tripType: 'Newsletter & Deals',
          message: 'Subscribed to Kashmir travel deals from ads landing page footer.',
          source: 'landing_footer_newsletter',
        }),
      });
    } catch {
      // ignore
    }

    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="w-full bg-white text-slate-600 font-manrope border-t border-slate-200 relative z-20">
      {/* ── 1. COMPACT NEWSLETTER STRIP (EXACT TOP-BAR COLORING & LIGHT FLARE MOTION) ── */}
      <div 
        className="relative overflow-hidden py-1 sm:py-1.5 px-3 sm:px-6 lg:px-8 select-none border-b border-black/10"
        style={{
          background: 'linear-gradient(90deg, #ffd024, #fb790a 50%, #ffd024)',
        }}
      >
        {/* Thrillophilia Slanted Light Flare (Continuous, GPU-Accelerated) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="thrillo-top-flare">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="34" viewBox="0 0 24 38" fill="none">
              <path d="M24 0H14.5L5 38H14.5L24 0Z" fill="white" fillOpacity="0.8" />
              <path d="M12 0H9.95238L0 38H2.04762L12 0Z" fill="white" fillOpacity="0.8" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 sm:gap-4">
          <div className="text-center md:text-left">
            <h4 className="text-xs sm:text-[13px] font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              <span>Get Kashmir Travel Deals &amp; Insider Tips</span>
            </h4>
          </div>

          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="flex items-center justify-center gap-1.5 bg-black/40 text-white border border-white/30 px-2.5 py-0.5 rounded-md text-[11px] font-semibold shadow-inner">
                <CheckCircle2 size={12} className="text-white" />
                <span>Subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center justify-center gap-1.5 w-full md:w-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full sm:w-52 h-7 px-2.5 rounded-md bg-black/30 text-white placeholder:text-white/75 text-[11px] border border-white/35 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-medium drop-shadow-xs"
                />
                <button
                  type="submit"
                  className="h-7 px-3 bg-[#071936] hover:bg-[#0c2550] active:scale-98 text-white font-bold text-[11px] rounded-md flex items-center justify-center gap-1 transition-all shrink-0 cursor-pointer shadow-md"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={11} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. MAIN FOOTER CONTENT COLUMNS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-6">
          
          {/* Brand Info & Contact Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <a href={MAIN_DOMAIN} target="_blank" rel="noopener noreferrer" className="inline-block group">
              {hasCustomLogo && validLogoSrc ? (
                <Image
                  src={validLogoSrc}
                  alt="The Indian Wings Company"
                  width={190}
                  height={60}
                  className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm group-hover:scale-102 transition-transform"
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#122986] border border-[#122986]/20 flex items-center justify-center text-white shadow-xs shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-base sm:text-lg font-extrabold text-[#071936] tracking-tight leading-tight">
                      THE INDIAN WINGS
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#122986] uppercase tracking-wider leading-none mt-0.5">
                      Company • Srinagar
                    </span>
                  </div>
                </div>
              )}
            </a>

            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 pr-2">
              Kashmir&apos;s trusted travel companion. Handcrafted holiday packages, verified luxury fleet, thrilling mountain adventures, and timeless Kashmiri hospitality.
            </p>

            {/* Direct Contact List */}
            <div className="space-y-2.5 pt-1 text-xs">
              <a
                href={`tel:${GENUINE_PHONE}`}
                className="flex items-center gap-2.5 text-slate-700 hover:text-[#122986] transition-colors group font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200/80 group-hover:bg-[#122986] group-hover:text-white text-[#122986] flex items-center justify-center shrink-0 transition-colors">
                  <Phone size={13} />
                </div>
                <span className="font-bold text-slate-900">{DISPLAY_PHONE}</span>
              </a>

              <a
                href={`mailto:${GENUINE_EMAIL}`}
                className="flex items-center gap-2.5 text-slate-700 hover:text-[#122986] transition-colors group font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200/80 group-hover:bg-[#122986] group-hover:text-white text-[#122986] flex items-center justify-center shrink-0 transition-colors">
                  <Mail size={13} />
                </div>
                <span>{GENUINE_EMAIL}</span>
              </a>

              <div className="flex items-start gap-2.5 text-slate-600 leading-snug">
                <div className="w-7 h-7 rounded-full bg-slate-200/80 text-[#122986] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={13} />
                </div>
                <span className="text-[11.5px]">{OFFICE_ADDRESS}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={siteConfig.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-[#122986] text-slate-700 hover:text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://wa.me/919811808387`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-emerald-600 text-slate-700 hover:text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-[#1877F2] text-slate-700 hover:text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-[#FF0000] text-slate-700 hover:text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <YoutubeIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 4 Content Link Columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="lg:col-span-1 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#071936] border-b border-slate-200/90 pb-1.5">
                {section.title}
              </h5>
              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={`text-xs block text-slate-600 hover:text-[#122986] transition-colors leading-relaxed ${
                        link.label.includes('→') ? 'text-[#122986] font-bold hover:underline' : ''
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* ── 3. LEGAL POLICIES & COMPLIANCE BAR (EXACT TOP-BAR COLORING & LIGHT FLARE MOTION) ── */}
      <div 
        className="relative overflow-hidden py-2 sm:py-2.5 px-4 sm:px-6 lg:px-8 select-none border-t border-black/10"
        style={{
          background: 'linear-gradient(90deg, #ffd024, #fb790a 50%, #ffd024)',
        }}
      >
        {/* Thrillophilia Slanted Light Flare (Continuous, GPU-Accelerated) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="thrillo-top-flare">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="32" viewBox="0 0 24 38" fill="none">
              <path d="M24 0H14.5L5 38H14.5L24 0Z" fill="white" fillOpacity="0.8" />
              <path d="M12 0H9.95238L0 38H2.04762L12 0Z" fill="white" fillOpacity="0.8" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs text-white text-center md:text-left drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 font-semibold">
            <span>© {new Date().getFullYear()} The Indian Wings Company. All rights reserved.</span>
            <span className="hidden md:inline text-white/70">•</span>
            <a
              href={`${MAIN_DOMAIN}/terms-and-conditions`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 underline-offset-2 hover:underline transition-colors"
            >
              Terms &amp; Conditions
            </a>
            <span className="text-white/70">•</span>
            <a
              href={`${MAIN_DOMAIN}/privacy-policy`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 underline-offset-2 hover:underline transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-white/70">•</span>
            <a
              href={`${MAIN_DOMAIN}/cancellation-refund-policy`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 underline-offset-2 hover:underline transition-colors"
            >
              Cancellation &amp; Refunds
            </a>
            <span className="text-white/70">•</span>
            <a
              href={`${MAIN_DOMAIN}/bucket-list/travel-information`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 underline-offset-2 hover:underline transition-colors"
            >
              Travel Advisory
            </a>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-white font-bold">
            <span className="inline-flex items-center gap-1">
              <span>Made with</span>
              <Heart size={11} className="text-white fill-white" />
              <span>in Kashmir, India 🇮🇳</span>
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};
