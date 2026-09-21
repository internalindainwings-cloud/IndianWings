'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import { siteConfig } from '@/config/site-config';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';

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

interface FooterLinkItem {
  label: string;
  href: string;
}

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { openModal } = useEnquiryModal();
  const settings = useSiteSettings();

  const [destinationLinks, setDestinationLinks] = useState<FooterLinkItem[]>([
    { label: 'Explore All Destinations →', href: '/destinations' },
  ]);
  const [packageLinks, setPackageLinks] = useState<FooterLinkItem[]>([
    { label: 'All Kashmir Tour Packages', href: '/packages' },
    { label: 'Verified Luxury Fleet & Cabs', href: '/transport' },
    { label: 'Adventure Activities & Sports', href: '/activities' },
  ]);

  // Fetch available destinations and packages dynamically
  React.useEffect(() => {
    let isMounted = true;

    // 1. Fetch Destinations
    fetch('/api/destinations')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.destinations) && data.destinations.length > 0) {
          const links: FooterLinkItem[] = data.destinations.slice(0, 5).map((d: any) => ({
            label: d.tagline ? `${d.name} (${d.tagline})` : d.name,
            href: `/destinations/${d.slug}`,
          }));
          links.push({ label: 'Explore All Destinations →', href: '/destinations' });
          setDestinationLinks(links);
        } else {
          setDestinationLinks([
            { label: 'Explore All Destinations →', href: '/destinations' },
          ]);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch destinations for footer:', err);
      });

    // 2. Fetch Packages
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && Array.isArray(data.packages) && data.packages.length > 0) {
          const links: FooterLinkItem[] = data.packages.slice(0, 3).map((p: any) => ({
            label: p.title.length > 36 ? `${p.title.slice(0, 36)}...` : p.title,
            href: `/packages/${p.slug}`,
          }));
          links.push(
            { label: 'Verified Luxury Fleet & Cabs', href: '/transport' },
            { label: 'Adventure Activities (Gondola, Rafting)', href: '/activities' },
            { label: 'Explore All Packages →', href: '/packages' }
          );
          setPackageLinks(links);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch packages for footer:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const footerSections = [
    {
      heading: 'Destinations',
      links: destinationLinks,
    },
    {
      heading: 'Packages & Fleet',
      links: packageLinks,
    },
    {
      heading: 'Travel Information',
      links: [
        { label: 'Things to Do in Kashmir', href: '/bucket-list/things-to-do' },
        { label: 'Travel Advisory & FAQs', href: '/bucket-list/travel-information' },
        { label: 'Clothing & Packing Guide', href: '/bucket-list/travel-information#clothing' },
        { label: 'Permits, Prepaid SIMs & ATMs', href: '/bucket-list/travel-information#permits' },
        { label: 'Local Kashmiri Shopping Guide', href: '/bucket-list/shopping' },
        { label: 'Explore Kashmir Bucket List →', href: '/bucket-list' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About Us', href: '/about-us' },
        { label: 'Why Travel With Us', href: '/#why-us' },
        { label: 'Client Stories & Reviews', href: '/#reviews' },
        { label: 'Safety & Hospitality Standards', href: '/activities#safety' },
        { label: 'Terms & Conditions', href: '/terms-and-conditions' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Cancellation & Refunds', href: '/cancellation-refund-policy' },
      ],
    },
  ];

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
          message: 'Subscribed to Kashmir travel deals & tips from website footer.',
          source: 'footer_newsletter',
        }),
      });
    } catch (err) {
      console.warn('Newsletter submission error:', err);
    }

    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="text-warm-white/70 bg-midnight relative z-20 border-t border-warm-white/10 font-manrope">
      {/* 1. Top Newsletter Banner — Slim, Low-Profile Treatment */}
      <div className="py-3.5 sm:py-4 bg-[#071720] border-b border-white/10 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 relative z-10">
          <div>
            <h3 className="font-manrope text-[14.5px] sm:text-base font-bold text-white tracking-tight">
              Get Kashmir Travel Deals &amp; Insider Tips
            </h3>
            <p className="text-white/65 text-[11px] sm:text-xs font-manrope font-normal mt-0.5">
              Seasonal offers, handcrafted itineraries, and authentic mountain recommendations.
            </p>
          </div>
          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-lg font-bold text-xs shadow-xs animate-fadeIn">
                <CheckCircle2 size={15} />
                <span>Subscribed! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full sm:w-64 h-8 sm:h-9 px-3 rounded-lg bg-white/10 text-white placeholder:text-white/40 text-xs font-medium border border-white/15 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all"
                />
                <button
                  type="submit"
                  className="h-8 sm:h-9 bg-saffron hover:bg-saffron/90 text-midnight px-4 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 whitespace-nowrap cursor-pointer text-xs"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5 text-midnight font-bold" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand & Contact Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4 group">
              <Image
                src="/assets/client_logo.png"
                alt="The Indian Wings Company"
                width={200}
                height={70}
                className="h-12 sm:h-14 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform origin-left"
              />
            </Link>
            <p className="text-sm leading-relaxed text-warm-white/75 mb-6 pr-2">
              Kashmir&apos;s trusted travel companion. Handcrafted holiday packages, verified luxury fleet, thrilling mountain adventures, and timeless Kashmiri hospitality.
            </p>

            <div className="space-y-3 mb-6">
              <a
                href={`tel:${settings.phone || siteConfig.contact.phone}`}
                className="text-sm text-warm-white/80 hover:text-saffron transition-colors flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-warm-white/5 group-hover:bg-saffron/20 flex items-center justify-center text-saffron transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{settings.displayPhone || siteConfig.contact.displayPhone}</span>
              </a>
              <a
                href={`mailto:${settings.email || siteConfig.contact.email}`}
                className="text-sm text-warm-white/80 hover:text-saffron transition-colors flex items-center gap-3 group"
              >
                <div className="w-8 h-8 rounded-full bg-warm-white/5 group-hover:bg-saffron/20 flex items-center justify-center text-saffron transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{settings.email || siteConfig.contact.email}</span>
              </a>
              <Link
                href="/about-us#office"
                className="flex items-start gap-3 text-sm text-warm-white/80 hover:text-saffron transition-colors group"
                title="View our Srinagar registered office and directions"
              >
                <div className="w-8 h-8 rounded-full bg-warm-white/5 group-hover:bg-saffron/20 flex items-center justify-center text-saffron shrink-0 transition-colors mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-snug">
                  {settings.address || 'The Indian Wings Travels, Sheikh Palace, 2nd Floor, Kanyar Chowk, Srinagar, Jammu & Kashmir, 190003'}
                </span>
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2.5 pt-2">
              {[
                { Icon: InstagramIcon, href: siteConfig.contact.instagramUrl, label: 'Instagram' },
                { Icon: WhatsAppIcon, href: settings.whatsappUrl || siteConfig.contact.whatsappUrl, label: 'WhatsApp' },
                { Icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
                { Icon: YoutubeIcon, href: 'https://youtube.com', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-warm-white/5 hover:bg-saffron text-warm-white/80 hover:text-midnight flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {footerSections.map(({ heading, links }) => (
            <div key={heading} className="lg:col-span-1">
              <h4 className="font-playfair font-bold text-warm-white text-base tracking-wide mb-4 border-b border-warm-white/10 pb-2">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-xs sm:text-[13px] text-warm-white/70 hover:text-saffron transition-colors block py-0.5 leading-snug ${
                        link.label.includes('→') ? 'text-saffron font-semibold hover:brightness-110' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Bar with Clean 2-Tier Responsive Layout (Prevents Cramped Wrapping & Overlap) */}
      <div className="border-t border-warm-white/10 bg-[#081720]">
        <div className="max-w-7xl mx-auto px-4 pl-16 sm:px-6 lg:px-8 py-5 pb-28 min-[1140px]:pl-8 min-[1140px]:pb-6 flex flex-col gap-3.5 text-xs text-warm-white/65">
          
          {/* Row 1: Copyright & Legal Navigation Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <p className="whitespace-nowrap font-medium text-warm-white/75">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 text-warm-white/60">
              <Link href="/terms-and-conditions" className="hover:text-saffron transition-colors">
                Terms &amp; Conditions
              </Link>
              <span className="text-warm-white/25">•</span>
              <Link href="/privacy-policy" className="hover:text-saffron transition-colors">
                Privacy Policy
              </Link>
              <span className="text-warm-white/25">•</span>
              <Link href="/cancellation-refund-policy" className="hover:text-saffron transition-colors">
                Cancellation &amp; Refunds
              </Link>
              <span className="text-warm-white/25">•</span>
              <Link href="/bucket-list/travel-information" className="hover:text-saffron transition-colors">
                Travel Advisory
              </Link>
            </div>
          </div>

          {/* Row 2: Developer Credit & Made in Kashmir */}
          <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11.5px] text-warm-white/50">
            <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
              <span>Designed &amp; Developed by</span>
              <a
                href="mailto:bhatubaid341@gmail.com"
                className="text-[#F5A623] font-bold hover:underline transition-colors inline-flex items-center gap-1"
              >
                Ubaid Ahmad Bhat
              </a>
              <span className="text-warm-white/30">|</span>
              <a
                href="mailto:bhatubaid341@gmail.com"
                className="text-warm-white/70 hover:text-[#F5A623] transition-colors"
              >
                bhatubaid341@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />
                <span>in Kashmir</span>
              </span>
              <span className="text-warm-white/30">•</span>
              <span className="inline-flex items-center gap-1">
                <span>🇮🇳</span>
                <span>India</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
