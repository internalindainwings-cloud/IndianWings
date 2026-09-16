import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MapPin, Clock, Calendar, ArrowRight, Compass } from 'lucide-react';
import { siteConfig } from '@/config/site-config';
import { HeroActionBar } from '@/components/trust/HeroActionBar';

export const metadata: Metadata = {
  title: 'Top Things to Do in Kashmir | The Ultimate Bucket List',
  description: 'Curated bucket list of unmissable Kashmir experiences: Dal Lake dawn Shikara ride, Gulmarg Gondola Phase 2, Betaab Valley, traditional Wazwan dining, and Lidder river rafting.',
  keywords: [
    'Things to do in Kashmir',
    'Kashmir bucket list',
    'Dal lake shikara ride timing',
    'Gulmarg gondola ride booking',
    'Betaab valley Pahalgam activities',
    'Kashmiri Wazwan dining Srinagar',
    'Sonmarg Thajiwas glacier activities'
  ],
  alternates: {
    canonical: '/bucket-list/things-to-do',
  },
};

const BUCKET_EXPERIENCES = [
  {
    id: 'shikara-dawn',
    rank: '01',
    title: 'Dawn Shikara Ride on Dal Lake',
    location: 'Dal Lake, Srinagar',
    duration: '2 Hours',
    bestTime: 'Early Morning (05:30 AM – 07:30 AM)',
    description: 'Glide through misty waters at sunrise to witness the centuries-old floating vegetable and flower market. Watch aquatic wildlife and reflections of the Zabarwan range in pure stillness.',
    badge: 'Must Experience',
    imageUrl: '/images/gallery/shikara-dal-lake.jpg'
  },
  {
    id: 'gondola-phase2',
    rank: '02',
    title: 'Gulmarg Gondola to Apharwat Peak (13,780 ft)',
    location: 'Gulmarg, Baramulla',
    duration: 'Half Day (3–4 Hours)',
    bestTime: 'Morning (09:00 AM – 01:00 PM)',
    description: 'Board the world’s second-highest operating cable car. Phase 1 takes you to Kongdoori Valley, and Phase 2 ascends through clouds to Apharwat Ridge for year-round snow and panoramic views into the Pir Panjal range.',
    badge: 'High Altitude',
    imageUrl: '/images/gallery/gulmarg-snow.jpg'
  },
  {
    id: 'betaab-valley',
    rank: '03',
    title: 'Explore Betaab Valley & Aru Valley',
    location: 'Pahalgam, Anantnag',
    duration: 'Full Day',
    bestTime: 'April to October (Lush Green) or Dec–Feb (Snow)',
    description: 'Surrounded by pine forests and snow-crowned summits, stroll along the crystalline Lidder river streams and take a pony ride to Baisaran Meadow, affectionately called "Mini Switzerland".',
    badge: 'Scenic Nature',
    imageUrl: '/images/gallery/pahalgam-valley.jpg'
  },
  {
    id: 'houseboat-stay',
    rank: '04',
    title: 'Overnight in a Carved Cedar Houseboat',
    location: 'Nigeen Lake & Dal Lake',
    duration: 'Overnight (1–2 Nights)',
    bestTime: 'All Seasons',
    description: 'Experience authentic Kashmiri royalty aboard hand-carved deodar wood houseboats. Savor traditional warm Kehwa on the deck as walnut wood fire keeps your heritage suite cozy.',
    badge: 'Heritage Stay',
    imageUrl: '/images/gallery/houseboat-kashmir.jpg'
  },
  {
    id: 'wazwan-feast',
    rank: '05',
    title: 'Savor a Traditional 36-Course Wazwan Feast',
    location: 'Downtown Srinagar & Boulevard',
    duration: '2–3 Hours',
    bestTime: 'Lunch or Dinner',
    description: 'Prepared by master chefs (Wazas), this culinary ritual features Rogan Josh, Rista, Gushtaba, Tabak Maaz, and aromatic saffron pulao served in traditional copper tramis.',
    badge: 'Culinary Masterpiece',
    imageUrl: '/images/gallery/sonmarg-glacier.jpg'
  },
  {
    id: 'thajiwas-glacier',
    rank: '06',
    title: 'Thajiwas Glacier Trek & Snow Sledge',
    location: 'Sonmarg (Meadow of Gold)',
    duration: '4–5 Hours',
    bestTime: 'May to September (Alpine Trek) or Winter (Snow)',
    description: 'Trek or ride a pony to the foot of Thajiwas Glacier. Marvel at frozen streams, melting waterfalls, and alpine pine forests that serve as the gateway to Ladakh.',
    badge: 'Adventure Trek',
    imageUrl: '/images/gallery/sonmarg-glacier.jpg'
  }
];

export default function ThingsToDoPage() {
  return (
    <main className="w-full min-h-screen bg-background text-[#222222] flex flex-col">
      {/* 1. Hero Header */}
      <section className="relative w-screen max-w-full h-[calc(100dvh-115px)] sm:h-[calc(100dvh-110px)] min-h-[435px] max-h-[545px] min-[1140px]:h-[calc(100dvh-150px)] min-[1140px]:min-h-[465px] min-[1140px]:max-h-[575px] flex flex-col justify-between overflow-hidden bg-midnight">
        {/* 1. Background Image with Light Natural Scrim */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery/gulmarg-snow.jpg"
            alt="Things to do in Kashmir"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-midnight/40 via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />
        </div>

        {/* 2. Hero Content Container - Left 50% of Viewport — shifted slightly above */}
        <div className="flex-1 flex flex-col relative z-10 w-full justify-center min-h-0 pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 -translate-y-2 sm:-translate-y-3">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 w-full flex flex-col items-start text-left">
            <div className="w-full lg:w-1/2 max-w-xl flex flex-col items-start text-left">
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="mb-2.5 sm:mb-3">
                <ol className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-manrope text-warm-white/70">
                  <li>
                    <Link href="/" className="hover:text-warm-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <ChevronRight size={12} className="text-warm-white/40 shrink-0" />
                  <li>
                    <Link href="/bucket-list/travel-information" className="hover:text-warm-white transition-colors">
                      Bucket List
                    </Link>
                  </li>
                  <ChevronRight size={12} className="text-warm-white/40 shrink-0" />
                  <li>
                    <span className="text-saffron font-semibold">Things to Do</span>
                  </li>
                </ol>
              </nav>

              {/* Major Heading - One Line */}
            <h1 className="font-display text-[18px] min-[360px]:text-[20px] min-[400px]:text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[44px] text-saffron leading-tight tracking-tight whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-3 sm:mb-4">
              Unmissable Kashmir Bucket List
            </h1>

              {/* Action Buttons: Small size directly here */}
              <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Link
                  href="/packages"
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-saffron text-midnight font-manrope font-bold text-xs shadow-md hover:shadow-saffron/30 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Explore Tour Packages</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
                <a
                  href="#bucket-list-grid"
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-warm-white border border-white/20 backdrop-blur-md font-manrope font-semibold text-xs transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Explore Experiences</span>
                  <span aria-hidden="true">&darr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Hero Bottom Action Bar - Docked right at bottom edge */}
        <div className="relative z-20 w-full shrink-0">
          <HeroActionBar />
        </div>
      </section>

      {/* 2. Experiences Grid */}
      <section id="bucket-list-grid" className="w-full bg-background py-14 sm:py-20 border-b border-black/[0.08] scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-left mb-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-saffron rounded-full"></span>
              <span className="text-saffron font-manrope font-bold text-xs uppercase tracking-widest">
                THE BUCKET LIST
              </span>
            </div>
            <h2 className="font-manrope text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1F2A]">
              Curated Highlights &amp; Must-Try Activities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {BUCKET_EXPERIENCES.map((exp) => (
              <div
                key={exp.id}
                className="bg-white border border-black/[0.08] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-black/15 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-52 overflow-hidden">
                    <Image
                      src={exp.imageUrl}
                      alt={exp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 bg-midnight/80 backdrop-blur-md text-saffron border border-saffron/30 font-manrope text-xs font-bold px-2.5 py-1 rounded-full">
                      #{exp.rank}
                    </span>
                    <span className="absolute top-3 right-3 bg-saffron text-midnight font-manrope text-[11px] font-bold px-2.5 py-1 rounded-full">
                      {exp.badge}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-manrope text-xl font-bold text-[#0B1F2A] group-hover:text-saffron transition-colors mb-2">
                      {exp.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mb-3">
                      <div className="flex items-center gap-1 text-saffron">
                        <MapPin size={13} />
                        <span>{exp.location}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={13} />
                        <span>{exp.duration}</span>
                      </div>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-[#475569] leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    <div className="bg-black/[0.03] rounded-lg p-2.5 text-xs text-[#64748B] flex items-center gap-2">
                      <Calendar size={13} className="text-saffron shrink-0" />
                      <span>{exp.bestTime}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-black/[0.08] mt-4">
                  <Link
                    href="/packages"
                    className="w-full text-center bg-black/[0.04] hover:bg-saffron hover:text-midnight text-[#0B1F2A] border border-black/10 hover:border-saffron font-manrope text-xs font-bold py-2.5 rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    <span>View Packages Including This</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA */}
      <section className="w-full bg-background py-14 sm:py-18 text-center px-4">
        <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-white border border-black/[0.08] shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/15 text-saffron text-xs font-bold uppercase tracking-widest">
            <Compass size={14} />
            <span>CUSTOM ITINERARY</span>
          </div>
          <h2 className="font-manrope text-3xl sm:text-4xl font-bold text-[#0B1F2A]">
            Want to Include All These in Your Kashmir Trip?
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
            Let our local destination planners design a seamless day-by-day itinerary with verified cabs, hotel stays, and Gondola tickets.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/packages"
              className="bg-saffron hover:bg-opacity-90 text-midnight font-manrope font-bold text-sm px-6 py-3.5 rounded-full transition-all shadow-md inline-flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>Explore Tour Packages</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href={`https://wa.me/${siteConfig.contact.phone.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%20would%20like%20to%20plan%20my%20Kashmir%20bucket%20list%20trip`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-black/15 hover:border-black/30 text-[#0B1F2A] font-manrope font-semibold text-sm px-6 py-3.5 rounded-full transition-all hover:bg-black/5"
            >
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
