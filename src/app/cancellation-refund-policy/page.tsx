import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, CreditCard, RotateCcw, AlertTriangle, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/config/site-config';
import { HeroActionBar } from '@/components/trust/HeroActionBar';

export const metadata: Metadata = {
  title: 'Cancellation and Refund Policy | The Indian Wings Company',
  description: 'Official Cancellation and Refund Policy of The Indian Wings Company outlining transparent cancellation timelines and refund slabs for Kashmir holiday packages.',
  keywords: [
    'Kashmir tour package cancellation policy',
    'The Indian Wings Company refund policy',
    'GoI compliant tour cancellation rules',
    'Gulmarg Gondola refund policy',
    'Kashmir travel refund timeline'
  ],
  alternates: {
    canonical: '/cancellation-refund-policy',
  },
};

const CANCELLATION_SLABS = [
  {
    timeline: '30 or more days before tour departure',
    deduction: '10% of total package cost',
    refund: '90% of total package cost refunded',
    status: 'Standard Processing Fee Deduction'
  },
  {
    timeline: '15 to 29 days before tour departure',
    deduction: '30% of total package cost',
    refund: '70% of total package cost refunded',
    status: 'Hotel & Transport Holding Charge'
  },
  {
    timeline: '07 to 14 days before tour departure',
    deduction: '50% of total package cost',
    refund: '50% of total package cost refunded',
    status: 'Peak Season Non-Recoverable Block'
  },
  {
    timeline: 'Less than 07 days or No-Show on arrival',
    deduction: '100% of total package cost',
    refund: '0% (Non-refundable)',
    status: 'Full Lock by Hoteliers & Transporters'
  }
];

export default function CancellationRefundPolicyPage() {
  return (
    <main className="w-full min-h-screen bg-background text-[#1A1A1A] flex flex-col">
      {/* 1. Standardized Hero Header */}
      <section className="relative w-screen max-w-full h-[calc(100dvh-115px)] sm:h-[calc(100dvh-110px)] min-h-[435px] max-h-[545px] min-[1140px]:h-[calc(100dvh-150px)] min-[1140px]:min-h-[465px] min-[1140px]:max-h-[575px] flex flex-col justify-between overflow-hidden bg-midnight">
        {/* 1. Background Image with Light Scrim */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery/gulmarg-snow.jpg"
            alt="Cancellation and Refund Policy - The Indian Wings Company"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-midnight/40 via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />
        </div>

        {/* 2. Hero Content Container - Left 50% — shifted slightly above */}
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
                    <span className="text-saffron font-semibold">Cancellation &amp; Refund</span>
                  </li>
                </ol>
              </nav>

              {/* Major Heading - Single Line */}
              <h1 className="font-manrope text-[18px] min-[360px]:text-[20px] min-[400px]:text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[44px] font-extrabold text-saffron leading-tight tracking-tight whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-3 sm:mb-4">
                Cancellation &amp; Refund Policy
              </h1>

              {/* Action Buttons: Small size directly here */}
              <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <a
                  href="#slabs"
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-saffron text-midnight font-manrope font-bold text-xs shadow-md hover:shadow-saffron/30 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>View Refund Slabs</span>
                  <span aria-hidden="true">&darr;</span>
                </a>
                <Link
                  href="/terms-and-conditions"
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-warm-white border border-white/20 backdrop-blur-md font-manrope font-semibold text-xs transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Terms &amp; Conditions</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Hero Bottom Action Bar - Docked right at bottom edge */}
        <div className="relative z-20 w-full shrink-0">
          <HeroActionBar />
        </div>
      </section>

      {/* 2. Cancellation & Refund Content Body */}
      <div className="w-full bg-background py-14 sm:py-20 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 font-manrope">
          
          {/* Statutory Header Notice */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-black/10 mb-10 space-y-3">
            <div className="flex items-center gap-2 text-saffron font-bold text-xs uppercase tracking-wider">
              <RotateCcw size={16} />
              <span>Consumer Protection (E-Commerce) Rules 2020 &amp; RBI Compliance</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              In full accordance with Rule 5(3) and Rule 6(5) of the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, this document provides complete transparency regarding cancellation charges, non-refundable components, force majeure weather rescheduling, and statutory refund timelines back to the original payment source.
            </p>
            <p className="text-[11px] text-slate-500">
              Last Updated: September 2026 | Governing Law: Laws of India | Jurisdiction: Srinagar, J&amp;K
            </p>
          </div>

          <div className="space-y-10 text-sm sm:text-base text-slate-800 leading-relaxed">
            
            {/* Section 1: Cancellation Slabs Table */}
            <section id="slabs" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                1. Standard Itinerary Cancellation Slabs
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Cancellation requests must be communicated in writing from the registered email address used during booking. The applicable cancellation charge is determined by the date on which written intimation is received:
              </p>

              <div className="overflow-x-auto rounded-2xl border border-black/10 shadow-xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-midnight font-bold border-b border-black/10">
                      <th className="p-3.5 sm:p-4">Cancellation Notice Timeline</th>
                      <th className="p-3.5 sm:p-4">Deduction / Fee</th>
                      <th className="p-3.5 sm:p-4">Refund Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 bg-white">
                    {CANCELLATION_SLABS.map((slab, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 sm:p-4 font-semibold text-midnight">
                          {slab.timeline}
                        </td>
                        <td className="p-3.5 sm:p-4 text-rose-600 font-bold">
                          {slab.deduction}
                        </td>
                        <td className="p-3.5 sm:p-4 text-emerald-700 font-bold">
                          {slab.refund}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 2: Non-Refundable Items */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                2. Explicit Non-Refundable Components
              </h2>
              <p>
                Certain third-party service elements are governed by strict non-refundable statutory policies:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  <strong>Gulmarg Gondola Phase 1 &amp; Phase 2 Tickets:</strong> Issued directly by the Jammu &amp; Kashmir Cable Car Corporation (JKCCC) with personalized Aadhaar / Passport details. As per official government policy, these tickets are 100% non-refundable and non-transferable under all circumstances.
                </li>
                <li>
                  <strong>Flight Airfares:</strong> Airline cancellations are governed entirely by Directorate General of Civil Aviation (DGCA) airline fare rules.
                </li>
                <li>
                  <strong>Peak Festive Hotel Locks:</strong> During peak periods (Tulip Festival, Christmas/New Year, and peak snowfall weeks), hotels enforce 100% non-refundable retention once vouchers are generated.
                </li>
              </ul>
            </section>

            {/* Section 3: Weather & Natural Calamity Force Majeure */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                3. Weather Stoppages &amp; Trip Rescheduling Policy
              </h2>
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-amber-800 text-sm uppercase tracking-wide">
                  <AlertTriangle size={17} />
                  <span>Landslides, Snow Road Blockades &amp; Highway Closures</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  If National Highway NH-44 is blocked due to landslides, or if severe snowfall temporarily closes roads to Gulmarg, Sonamarg, or Pahalgam:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
                  <li>Our 24/7 ground operations desk will immediately arrange safe rerouting or alternative day itineraries in Srinagar (e.g. Mughal Gardens, Old City heritage tours, Dal Lake Shikara).</li>
                  <li>In the event of complete inability to travel due to official district administrative curbs, <strong>we issue a 100% Value Travel Credit Voucher</strong> valid for 12 months, allowing travelers to reschedule their holiday without financial forfeiture.</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Refund Processing Mechanism (RBI Guidelines) */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                4. Refund Processing Timelines (RBI Directive Compliance)
              </h2>
              <p>
                In strict compliance with Reserve Bank of India (RBI) directives on electronic merchant payments:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  <strong>Mode of Refund:</strong> All approved refunds are credited back strictly to the <strong>original source of payment</strong> (same bank account, debit/credit card, or UPI VPA used during booking). Cash refunds are strictly prohibited under anti-money laundering and tax guidelines.
                </li>
                <li>
                  <strong>Statutory Timeline:</strong> Refunds are initiated within <strong>48 to 72 hours</strong> of written cancellation verification and typically reflect in the traveler&apos;s account within <strong>7 to 10 banking business days</strong>, depending on the issuing bank&apos;s NEFT/IMPS settlement cycles.
                </li>
              </ul>
            </section>

            {/* Section 5: Statutory Redressal Officer */}
            <section className="p-6 rounded-2xl bg-white border border-black/10 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-midnight font-bold text-base sm:text-lg">
                <Building2 size={20} className="text-saffron" />
                <span>Statutory Refund &amp; Cancellation Helpdesk</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                For cancellation requests, refund status tracking, or disputes regarding deductions, contact our dedicated compliance officer:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-2 text-slate-700">
                <div>
                  <span className="font-bold text-midnight block">Desk:</span>
                  <span>Refunds &amp; Cancellations, The Indian Wings Company</span>
                </div>
                <div>
                  <span className="font-bold text-midnight block">Address:</span>
                  <span>The Indian Wings Travels, Sheikh Palace, 2nd Floor, Kanyar Chowk, Srinagar, J&amp;K, India</span>
                </div>
                <div>
                  <span className="font-bold text-midnight block">Official Email:</span>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-saffron underline">
                    {siteConfig.contact.email}
                  </a>
                </div>
                <div>
                  <span className="font-bold text-midnight block">Support Helpline:</span>
                  <span>{siteConfig.contact.displayPhone}</span>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
