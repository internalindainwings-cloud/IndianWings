import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, CheckCircle2, ShieldCheck, MapPin, ShoppingBag, Award, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site-config';
import { HeroActionBar } from '@/components/trust/HeroActionBar';

export const metadata: Metadata = {
  title: 'Kashmiri Shopping Guide | Authentic Crafts, Pashmina & Saffron',
  description: 'Expert guide to shopping in Kashmir: Certified Pashmina shawls, Pampore Mongra saffron, carved walnut wood, paper mâché, and the best artisan markets in Srinagar.',
  keywords: [
    'Kashmir shopping guide',
    'Buy authentic Pashmina Srinagar',
    'Pure Pampore saffron buy',
    'Walnut wood carvings Kashmir',
    'Paper mache Srinagar',
    'Polo View high street Srinagar',
    'Kashmiri dry fruits mamra almonds'
  ],
  alternates: {
    canonical: '/bucket-list/shopping',
  },
};

const CRAFT_ITEMS = [
  {
    id: 'pashmina',
    title: 'Certified Pashmina & Cashmere Shawls',
    tag: 'GI Tag Certified',
    origin: 'Changthangi Goat Underfleece / Hand-spun in Srinagar',
    description: 'Genuine Pashmina is spun from the delicate winter underfleece of high-altitude Himalayan goats. Look for GI-tagged shawls with micro-fine hand needlework (Sozni embroidery).',
    purityTips: [
      'Authentic Pashmina passes smoothly through a small finger ring.',
      'Smell test: Single thread burn emits a natural protein burnt-hair aroma, never plastic.',
      'Slight unevenness in weave confirms traditional handloom weaving.'
    ],
    whereToBuy: 'Polo View High Street & Government Arts Emporium, Srinagar'
  },
  {
    id: 'saffron',
    title: 'Grade-A Pampore Mongra Saffron (Kesar)',
    tag: 'Highest Crocin Grade',
    origin: 'Pampore Plateau (14 km from Srinagar)',
    description: 'Renowned as the purest saffron globally, Kashmiri Mongra is characterized by dark crimson-red stigmas with flared tips, free from yellow styles, delivering unmatched aroma and medicinal purity.',
    purityTips: [
      'In warm water or milk, authentic saffron slowly releases golden-yellow color, never immediate red.',
      'The stigma threads remain intact and crimson even after releasing their color.',
      'Sweet fragrance on the nose, but distinctly bitter-earthy on the palate.'
    ],
    whereToBuy: 'Pampore Saffron Farms & Verified Saffron Growers Cooperative, Srinagar'
  },
  {
    id: 'walnut-wood',
    title: 'Hand-Carved Walnut Woodwork',
    tag: 'Artisan Heritage',
    origin: 'Old Srinagar Workshops',
    description: 'Crafted from seasoned walnut trees (often cured for 2–4 years). Artisans painstakingly chisel delicate Chinar leaves, dragon motifs, and lotus patterns into bowls, trays, and memory boxes.',
    purityTips: [
      'Carved from a single solid block of wood with zero glue joints on main structural relief.',
      'Unvarnished natural wax finish that develops a richer patina with age.',
      'Root wood (darkest grain) represents the highest durability and value.'
    ],
    whereToBuy: 'Zaina Kadal Artisan Quarter & Residency Road Handicraft Centers'
  },
  {
    id: 'paper-mache',
    title: 'Traditional Kashmiri Paper Mâché Art',
    tag: 'Naqashi Gold Leaf',
    origin: 'Introduced by Mir Sayyid Ali Hamadani in the 14th century',
    description: 'Pulp of recycled paper and cloth molded into exquisite boxes, vases, and ornaments, hand-painted with fine squirrel-hair brushes and pure 24k gold leaf highlights.',
    purityTips: [
      'Weight test: Solid Sakhtsazi papier-mâché has a solid, dense heft, not hollow cardboard.',
      'Intricate floral miniatures outlined with ultra-fine gold line work.',
      'Finished with natural amber lacquer to prevent chipping.'
    ],
    whereToBuy: 'Zadibal Craft Center & Polo View Art Galleries'
  },
  {
    id: 'dry-fruits',
    title: 'Kashmiri Mamra Almonds & Kagzi Walnuts',
    tag: '100% Natural & High Oil',
    origin: 'Pulwama & Shopian Orchards',
    description: 'Kashmiri Mamra almonds contain up to 50% natural oil content compared to imported varieties. Pair them with thin-shelled Kagzi walnuts that can be cracked effortlessly between palms.',
    purityTips: [
      'Mamra almonds have concave curves with textured rough skin and high oil sheen.',
      'Kagzi walnuts crack with light pressure in two hands and yield intact halves.',
      'Fragrant Kashmiri saffron kehwa tea mix made with whole spices and green tea leaves.'
    ],
    whereToBuy: 'Lal Chowk Dry Fruit Markets & Maharaj Gunj'
  }
];

const MARKETS = [
  {
    name: 'Polo View High Street',
    location: 'Near Dal Lake, Srinagar',
    bestFor: 'GI-tagged Pashminas, Paper Mâché, Designer Boutiques, Cozy Cafes',
    vibe: 'Pedestrian-only cobble street with fixed-price heritage boutiques.'
  },
  {
    name: 'Government Arts Emporium',
    location: 'Residency Road, Srinagar',
    bestFor: 'Verified Government certified Silk Carpets, Woodwork & Shawls',
    vibe: '100% genuine pricing, ideal for certified collector pieces.'
  },
  {
    name: 'Old City (Zaina Kadal & Maharaj Gunj)',
    location: 'Downtown Srinagar',
    bestFor: 'Hand-hammered Copper Samovars, Spices, Traditional Bakeries (Kandur)',
    vibe: 'Bustling historic heritage bazaars with centuries of artisan lineage.'
  },
  {
    name: 'Pampore Saffron Belt',
    location: 'Srinagar–Jammu National Highway',
    bestFor: 'Farm-direct Saffron, Kehwa blends, Pure Mountain Honey',
    vibe: 'Surrounded by purple autumn saffron blooms with direct farm growers.'
  }
];

export default function ShoppingGuidePage() {
  return (
    <main className="w-full min-h-screen bg-background text-[#222222] flex flex-col">
      {/* 1. Hero Header */}
      <section className="relative w-screen max-w-full h-[calc(100dvh-115px)] sm:h-[calc(100dvh-110px)] min-h-[435px] max-h-[545px] min-[1140px]:h-[calc(100dvh-150px)] min-[1140px]:min-h-[465px] min-[1140px]:max-h-[575px] flex flex-col justify-between overflow-hidden bg-midnight">
        {/* 1. Background Image with Light Natural Scrim */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery/houseboat-kashmir.jpg"
            alt="Kashmir Handicrafts and Markets"
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
              {/* Breadcrumb */}
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
                    <span className="text-saffron font-semibold">Shopping Guide</span>
                  </li>
                </ol>
              </nav>

              {/* Major Heading - One Line */}
              <h1 className="font-display text-[18px] min-[360px]:text-[20px] min-[400px]:text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[44px] text-saffron leading-tight tracking-tight whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-3 sm:mb-4">
                Authentic Kashmiri Shopping
              </h1>

              {/* Action Buttons: Small size directly here */}
              <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Link
                  href="/transport"
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-saffron text-midnight font-manrope font-bold text-xs shadow-md hover:shadow-saffron/30 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Shopping Cab Chauffeur</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
                <a
                  href="#crafts"
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-warm-white border border-white/20 backdrop-blur-md font-manrope font-semibold text-xs transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Explore Crafts</span>
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

      {/* 2. Authentic Craft Showcase */}
      <section id="crafts" className="w-full bg-background py-14 sm:py-20 border-b border-black/[0.08] scroll-mt-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-left mb-10 sm:mb-12 space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-saffron rounded-full"></span>
              <span className="text-saffron font-manrope font-bold text-xs uppercase tracking-widest">
                HERITAGE SOUVENIRS
              </span>
            </div>
            <h2 className="font-manrope text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1F2A]">
              What to Buy &amp; How to Check Purity
            </h2>
            <p className="font-sans text-sm text-[#64748B] max-w-xl">
              Avoid tourist markups and counterfeit goods with our practical buyer&apos;s purity indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {CRAFT_ITEMS.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-black/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="inline-block bg-saffron/15 text-saffron border border-saffron/30 text-[11px] font-manrope font-bold px-3 py-1 rounded-full">
                      {item.tag}
                    </span>
                    <span className="text-xs text-[#64748B] font-manrope">
                      {item.origin}
                    </span>
                  </div>

                  <h3 className="font-manrope text-xl sm:text-2xl font-bold text-[#0B1F2A] group-hover:text-saffron transition-colors mb-3">
                    {item.title}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-[#475569] leading-relaxed mb-5">
                    {item.description}
                  </p>

                  <div className="bg-black/[0.02] border border-black/[0.06] rounded-xl p-4 mb-4">
                    <h4 className="font-manrope text-xs font-bold text-saffron uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ShieldCheck size={14} />
                      <span>How to Test Genuine Quality:</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {item.purityTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#475569] leading-snug">
                          <CheckCircle2 size={13} className="text-saffron shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/[0.08] flex items-center justify-between text-xs text-[#64748B]">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-saffron" />
                    <span>{item.whereToBuy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Verified Market Bazaars */}
      <section className="w-full bg-background py-14 sm:py-20 border-b border-black/[0.08]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-left mb-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-saffron rounded-full"></span>
              <span className="text-saffron font-manrope font-bold text-xs uppercase tracking-widest">
                VERIFIED BAZAARS
              </span>
            </div>
            <h2 className="font-manrope text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B1F2A]">
              Best Shopping Locations in Srinagar
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MARKETS.map((m) => (
              <div
                key={m.name}
                className="bg-white border border-black/[0.08] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-full bg-saffron/15 text-saffron flex items-center justify-center mb-3">
                    <ShoppingBag size={18} />
                  </div>
                  <h3 className="font-manrope font-bold text-lg text-[#0B1F2A] mb-1">
                    {m.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-saffron mb-3">
                    <MapPin size={12} />
                    <span>{m.location}</span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                    {m.vibe}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/[0.08]">
                  <span className="text-[11px] font-bold text-[#0B1F2A] block mb-1">Recommended for:</span>
                  <span className="text-[11px] text-[#64748B] leading-tight block">{m.bestFor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Plan Your Shopping CTA */}
      <section className="w-full bg-background py-14 sm:py-18 text-center px-4">
        <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-white border border-black/[0.08] shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/15 text-saffron text-xs font-bold uppercase tracking-widest">
            <Award size={14} />
            <span>LOCAL ASSISTANCE</span>
          </div>
          <h2 className="font-manrope text-3xl sm:text-4xl font-bold text-[#0B1F2A]">
            Need Chauffeur Cab for Shopping in Srinagar?
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#64748B] max-w-xl mx-auto leading-relaxed">
            Our experienced local drivers know the most authentic artisan quarters in the Old City and Polo View, ensuring you never overpay.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/transport"
              className="bg-saffron hover:bg-opacity-90 text-midnight font-manrope font-bold text-sm px-6 py-3.5 rounded-full transition-all shadow-md inline-flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>Explore Fleet &amp; Taxis</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href={`https://wa.me/${siteConfig.contact.phone.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%20would%20like%20local%20shopping%20and%20taxi%20assistance%20in%20Srinagar`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-black/15 hover:border-black/30 text-[#0B1F2A] font-manrope font-semibold text-sm px-6 py-3.5 rounded-full transition-all hover:bg-black/5"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
