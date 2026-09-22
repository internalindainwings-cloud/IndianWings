import { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ShieldCheck,
  Award,
  HeartHandshake,
  CheckCircle2,
  Compass,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { siteConfig } from '@/config/site-config';
import { AboutCtaButtons } from './AboutCtaButtons';
import { safeJsonLd } from '@/lib/utilities/safe-json-ld';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tourpackageskashmir.com';

import { getSiteSettings } from '@/lib/settings-service';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const heroImage = settings.heroImageUrl || 'https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png';

  return {
    title: 'About Us | The Indian Wings Company — Kashmir Travel Specialists',
    description:
      'Discover The Indian Wings Company, your trusted local travel specialist based in Srinagar, Kashmir. Meet Founder Mrs. Komal Rai, our valley heritage, verified luxury houseboats, private fleet, and official registered office in Kanyar Chowk, Srinagar.',
    alternates: {
      canonical: '/about-us',
    },
    openGraph: {
      title: 'About Us | The Indian Wings Company — Kashmir Travel Specialists',
      description:
        'Discover The Indian Wings Company, your trusted local travel specialist based in Srinagar, Kashmir. Meet Founder Mrs. Komal Rai, our valley heritage, and official office in Srinagar.',
      url: `${siteUrl}/about-us`,
      siteName: 'The Indian Wings Company',
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: 'The Indian Wings Company - Handcrafted Kashmir Holidays',
        },
      ],
    },
  };
}

export default async function AboutUsPage() {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') ?? undefined;
  const cleanWhatsapp = (siteConfig.contact.whatsapp || '917827743041').replace(/[^0-9]/g, '');
  const settings = await getSiteSettings();

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${siteUrl}/#organization`,
    name: 'The Indian Wings Company',
    url: `${siteUrl}/about-us`,
    logo: settings.logoUrl || `${siteUrl}https://res.cloudinary.com/wmwdypan/image/upload/v1789666008/vishnav_devi.png`,
    description:
      'Premier local travel agency headquartered in Srinagar, specializing in handcrafted Kashmir holiday itineraries, verified luxury houseboats, and mountain transportation.',
    telephone: settings.phone || '+919811808387',
    email: settings.email || 'info@theindianwingscompany.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address || 'The Indian Wings Travels, Sheikh Palace, 2nd Floor, Kanyar Chowk',
      addressLocality: 'Srinagar',
      addressRegion: 'Jammu & Kashmir',
      postalCode: '190003',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 34.0900,
      longitude: 74.8100,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '21:00',
      },
    ],
  };

  const trustPillars = [
    {
      icon: ShieldCheck,
      title: '100% Personally Inspected',
      description:
        'Every luxury houseboat, heritage cottage, and boutique hotel in our packages is vetted in person by our Srinagar team for heating, hygiene, and authentic warmth.',
    },
    {
      icon: Award,
      title: 'Verified Mountain Chauffeurs',
      description:
        'We operate our own curated fleet of sanitized MPVs, SUVs, and sedans driven by courteous, valley-licensed chauffeurs experienced with alpine terrain and snow driving.',
    },
    {
      icon: HeartHandshake,
      title: 'Zero Hidden Costs Guarantee',
      description:
        'All toll taxes, parking fees, driver allowances, and transparent inclusions are detailed upfront with zero surprise commercial stops or unexpected add-on charges.',
    },
    {
      icon: Clock,
      title: '24/7 On-Ground Valley Desk',
      description:
        'From airport arrival to flight departure, our local team is physically present in Srinagar. We are just a phone call away at any hour of your stay.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#FCFBF8] text-foreground font-manrope">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: safeJsonLd(aboutJsonLd) }}
      />

      {/* ── 1. Hero Header Section ── */}
      <section className="relative bg-midnight text-white pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-saffron transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-saffron font-semibold">About Us</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-saffron text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
              <Sparkles size={13} />
              <span>Srinagar, Jammu &amp; Kashmir</span>
            </div>

            <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-warm-white leading-tight">
              Born in Kashmir. Rooted in Hospitality.
            </h1>

            <p className="mt-4 text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed font-normal">
              We started <strong className="text-white">The Indian Wings Company</strong> with one clear mission: to replace impersonal call-center aggregators with genuine, trustworthy local valley stewardship. When you travel with us, Kashmir opens its heart to you as family.
            </p>

            {/* Quick Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90">
                <CheckCircle2 size={13} className="text-saffron" />
                Headquartered in Srinagar
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90">
                <CheckCircle2 size={13} className="text-saffron" />
                Verified Luxury Fleet
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90">
                <CheckCircle2 size={13} className="text-saffron" />
                100% Tailored Holidays
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Our Story & Valley Heritage ── */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Column: Authentic Narrative */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 text-saffron text-xs font-bold uppercase tracking-widest">
              <Compass size={14} />
              <span>Our Valley Heritage</span>
            </div>

            <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-midnight leading-snug">
              Why Local Expertise is Everything in the Himalayas
            </h2>

            <div className="space-y-4 text-sm sm:text-[15px] text-gray-700 leading-relaxed">
              <p>
                Kashmir is not just any holiday destination—it is a living, breathing mountain paradise with delicate micro-climates, changing snowlines, ancient cultural corridors, and unique high-altitude logistics.
              </p>
              <p>
                Too many travellers book through faceless portals in distant metropolitan cities, only to arrive and encounter sub-par accommodation, surprise charges for heaters, and drivers unfamiliar with sudden snowfall passes.
              </p>
              <p>
                At <strong>The Indian Wings Company</strong>, our registered office is located right in the historic heart of Srinagar. Our relationships with houseboat families, boutique hoteliers, shikara boatmen, and mountain drivers span generations. We personally oversee every itinerary so your trip runs like clockwork.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#office"
                className="inline-flex items-center gap-2 text-xs font-bold text-midnight hover:text-saffron transition-colors"
              >
                <span>View Registered Office &amp; Address Details</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Right Column: Visual Composite Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-black/8">
                <Image
                  src="/images/gallery/shikara-dal-lake.jpg"
                  alt="Dal Lake Srinagar Shikara"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-black/8">
                <Image
                  src="/images/gallery/gulmarg-snow.jpg"
                  alt="Gulmarg Alpine Skiing"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-black/8">
                <Image
                  src="/images/gallery/houseboat-kashmir.jpg"
                  alt="Luxury Houseboat Stay"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
              </div>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md border border-black/8">
                <Image
                  src="/images/gallery/pahalgam-valley.jpg"
                  alt="Pahalgam Betaab Valley"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Our 4 Pillars of Trust ── */}
      <section className="py-14 sm:py-18 bg-white border-y border-black/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-saffron uppercase tracking-widest block mb-1">
              Guaranteed Excellence
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-midnight">
              The Indian Wings Standard
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Every package and private transfer we offer adheres to strict quality and transparency criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl p-6 bg-[#FAF9F5] border border-black/8 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-midnight text-saffron flex items-center justify-center mb-4 shadow-sm">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-playfair font-bold text-base text-midnight mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Meet the Leadership (Mrs. Komal Rai) ── */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF9F5] rounded-3xl p-6 sm:p-10 lg:p-12 border border-black/8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Founder Portrait */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-56 h-72 sm:w-64 sm:h-84 rounded-2xl overflow-hidden border-2 border-midnight/10 shadow-xl bg-slate-100">
                <Image
                  src="https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789917437/founder_new.jpg"
                  alt="Mrs. Komal Rai — Founder & Managing Director"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 224px, 256px"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Founder Message Content */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="border-b border-black/8 pb-3">
                <span className="text-[11px] font-bold text-saffron uppercase tracking-widest block mb-1">
                  From The Managing Director&apos;s Desk
                </span>
                <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-midnight">
                  Mrs. Komal Rai
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Founder &amp; Managing Director &bull; The Indian Wings Company (Srinagar, Kashmir)
                </p>
              </div>

              <blockquote className="space-y-3 text-sm sm:text-[14.5px] text-gray-700 leading-relaxed font-normal">
                <p className="italic text-midnight font-medium">
                  &ldquo;In Kashmir, our culture regards guests as &lsquo;Mehmaan-e-Khuda&rsquo;—guests sent by the divine. When you entrust your family holiday to us, you are not just purchasing a package; you are receiving our personal commitment of safety, honesty, and genuine warmth.&rdquo;
                </p>
                <p>
                  From the instant you land at Srinagar Airport, our chauffeurs greet you with warm smiles and sanitized vehicles. We never compromise on clean, heated stays during chilly winter nights or transparent advice on weather conditions. My personal phone line is always accessible to ensure you have a seamless holiday.
                </p>
              </blockquote>

              {/* Direct Founder Contact Actions */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-midnight hover:bg-midnight/90 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                >
                  <Phone size={13} className="text-saffron" />
                  <span>Call Srinagar Office</span>
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                    'Hello Mrs. Komal Rai & The Indian Wings team, I would like to consult with you about my Kashmir holiday.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00A859] hover:bg-[#16A34A] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                >
                  <MessageCircle size={14} />
                  <span>Chat with Founder&apos;s Desk</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. Official Registered Head Office & Physical Contact Details ── */}
      <section id="office" className="py-14 sm:py-20 bg-white border-t border-black/8 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/15 text-midnight text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin size={13} className="text-saffron" />
              <span>Physical Presence</span>
            </div>
            <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-midnight">
              Visit Our Srinagar Head Office
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Feel free to visit our registered office or contact our local team anytime for on-ground assistance, customized itineraries, and travel advisories.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Office Information Card (7 cols) */}
            <div className="lg:col-span-7 bg-[#FAF9F5] rounded-3xl p-6 sm:p-8 lg:p-10 border border-black/8 shadow-xs flex flex-col justify-between space-y-6">
              
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold text-saffron uppercase tracking-widest block mb-1">
                    Official Registered Office
                  </span>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-midnight">
                    The Indian Wings Company
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    (Operating as The Indian Wings Travels) &bull; Kashmir Tour Operator &amp; Destination Specialist
                  </p>
                </div>

                {/* Address Block */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-black/8 shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-midnight text-saffron flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-midnight">Physical Head Office Address</h4>
                    <p className="text-xs sm:text-[13px] text-gray-700 mt-1 leading-relaxed">
                      <strong>Sheikh Palace, 2nd Floor</strong>,<br />
                      Kanyar Chowk, Srinagar, Jammu &amp; Kashmir – <strong>190003</strong>, India.
                    </p>
                    <p className="text-[11.5px] text-gray-500 mt-1.5 flex items-center gap-1">
                      <span>Landmark:</span> Near heritage Old City corridor &amp; Khanyar road leading toward Dal Lake / Boulevard.
                    </p>
                  </div>
                </div>

                {/* Operating Hours & Contact Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hours */}
                  <div className="p-4 rounded-2xl bg-white border border-black/8 shadow-2xs flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-saffron/20 text-midnight flex items-center justify-center shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-midnight">Office Working Hours</h5>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Monday – Sunday<br />
                        <strong>9:00 AM – 9:00 PM IST</strong>
                      </p>
                      <p className="text-[10.5px] text-emerald-700 font-semibold mt-1">
                        *24/7 Emergency Ground Support for in-transit travellers.
                      </p>
                    </div>
                  </div>

                  {/* Telephone / WhatsApp */}
                  <div className="p-4 rounded-2xl bg-white border border-black/8 shadow-2xs flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-saffron/20 text-midnight flex items-center justify-center shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-midnight">Direct Lines</h5>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Call: <a href="tel:+919811808387" className="font-bold text-midnight hover:text-saffron">+91 98118 08387</a>
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        WhatsApp: <a href={`https://wa.me/${cleanWhatsapp}`} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-700 hover:underline">+91 78277 43041</a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Block */}
                <div className="p-4 rounded-2xl bg-white border border-black/8 shadow-2xs flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-saffron/20 text-midnight flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-midnight">Official Email Correspondence</h5>
                    <a
                      href="mailto:info@theindianwingscompany.com"
                      className="text-xs font-semibold text-midnight hover:text-saffron transition-colors"
                    >
                      info@theindianwingscompany.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Khanyar+Chowk+Srinagar+Jammu+and+Kashmir+190003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-midnight hover:bg-midnight/90 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                >
                  <span>Open Directions on Google Maps</span>
                  <ExternalLink size={13} className="text-saffron" />
                </a>
              </div>

            </div>

            {/* Right: Stylized Srinagar Map Card (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-black/8 shadow-md bg-[#0F4C54] text-white flex flex-col justify-between relative p-6 sm:p-8">
              {/* Background Atmospheric Map Effect */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-saffron uppercase tracking-widest">
                    Srinagar Location Pin
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-mono">
                    34.09° N, 74.81° E
                  </span>
                </div>

                <h4 className="font-playfair text-xl sm:text-2xl font-bold leading-snug">
                  Heart of Srinagar, Jammu &amp; Kashmir
                </h4>

                <p className="text-xs text-white/80 leading-relaxed font-normal">
                  Our office is positioned conveniently in Srinagar to coordinate with drivers arriving at Sheikh ul-Alam Airport (SXR), houseboats on Dal and Nigeen Lakes, and highway routes departing for Gulmarg, Pahalgam, and Sonmarg.
                </p>

                {/* Valley Distances Table */}
                <div className="mt-4 rounded-xl bg-black/25 border border-white/10 p-3.5 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-white/85">
                    <span>Srinagar Airport (SXR):</span>
                    <span className="text-saffron font-bold">14 km</span>
                  </div>
                  <div className="flex items-center justify-between text-white/85">
                    <span>Dal Lake Boulevard:</span>
                    <span className="text-saffron font-bold">3.5 km</span>
                  </div>
                  <div className="flex items-center justify-between text-white/85">
                    <span>Gulmarg Ski Resort:</span>
                    <span className="text-saffron font-bold">52 km</span>
                  </div>
                  <div className="flex items-center justify-between text-white/85">
                    <span>Pahalgam Valley:</span>
                    <span className="text-saffron font-bold">88 km</span>
                  </div>
                </div>
              </div>

              {/* Map CTA */}
              <div className="relative z-10 pt-6 mt-6 border-t border-white/10">
                <a
                  href="https://maps.google.com/?q=Khanyar+Chowk+Srinagar+Jammu+and+Kashmir+190003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-saffron hover:bg-saffron/90 text-midnight font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <MapPin size={14} />
                  <span>Navigate to Sheikh Palace Office</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 6. Bottom Call to Action ── */}
      <section className="py-14 sm:py-18 bg-[#071720] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-saffron text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Ready for Kashmir?</span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Let Our Srinagar Team Plan Your Unforgettable Journey
          </h2>

          <p className="text-xs sm:text-sm text-white/75 max-w-xl mx-auto leading-relaxed">
            Tell us your travel dates, group size, and preferences. We will handcraft a personalized itinerary with verified hotels, houseboats, and sanitized mountain transport.
          </p>

          <div className="pt-2">
            <AboutCtaButtons cleanWhatsapp={cleanWhatsapp} />
          </div>
        </div>
      </section>
    </main>
  );
}
