import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Scale, AlertCircle, Building2 } from 'lucide-react';
import { siteConfig } from '@/config/site-config';
import { HeroActionBar } from '@/components/trust/HeroActionBar';

export const metadata: Metadata = {
  title: 'Terms and Conditions | The Indian Wings Company',
  description: 'Official Terms & Conditions of The Indian Wings Company outlining booking agreements, payments, inclusions, and traveler obligations.',
  keywords: [
    'Terms and Conditions Kashmir travel',
    'The Indian Wings Company terms of service',
    'GoI compliant travel agency terms',
    'Kashmir tour booking conditions',
    'Consumer Protection e-commerce rules 2020'
  ],
  alternates: {
    canonical: '/terms-and-conditions',
  },
};

export default function TermsAndConditionsPage() {
  return (
    <main className="w-full min-h-screen bg-background text-[#1A1A1A] flex flex-col">
      {/* 1. Standardized Hero Header */}
      <section className="relative w-screen max-w-full h-[calc(100dvh-115px)] sm:h-[calc(100dvh-110px)] min-h-[435px] max-h-[545px] min-[1140px]:h-[calc(100dvh-150px)] min-[1140px]:min-h-[465px] min-[1140px]:max-h-[575px] flex flex-col justify-between overflow-hidden bg-midnight">
        {/* 1. Background Image with Light Scrim */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery/shikara-dal-lake.jpg"
            alt="Terms and Conditions - The Indian Wings Company"
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
                    <span className="text-saffron font-semibold">Terms &amp; Conditions</span>
                  </li>
                </ol>
              </nav>

              {/* Major Heading - Single Line */}
              <h1 className="font-display text-[18px] min-[360px]:text-[20px] min-[400px]:text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[44px] text-saffron leading-tight tracking-tight whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-3 sm:mb-4">
                Terms &amp; Conditions
              </h1>

              {/* Action Buttons: Small size directly here */}
              <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <a
                  href="#terms-body"
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-saffron text-midnight font-manrope font-bold text-xs shadow-md hover:shadow-saffron/30 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Read Legal Terms</span>
                  <span aria-hidden="true">&darr;</span>
                </a>
                <Link
                  href="/cancellation-refund-policy"
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-warm-white border border-white/20 backdrop-blur-md font-manrope font-semibold text-xs transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Refund Policy</span>
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

      {/* 2. Legal Content Body */}
      <div id="terms-body" className="w-full bg-background py-14 sm:py-20 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 font-manrope">
          
          {/* Statutory Header Notice */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-black/10 mb-10 space-y-3">
            <div className="flex items-center gap-2 text-saffron font-bold text-xs uppercase tracking-wider">
              <Scale size={16} />
              <span>Statutory Compliance Notice</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              These Terms &amp; Conditions are formulated and published in compliance with the <strong>Consumer Protection Act, 2019</strong>, the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong>, the <strong>Information Technology Act, 2000</strong>, and statutory guidelines prescribed by the Department of Tourism, Government of Jammu &amp; Kashmir and the Government of India.
            </p>
            <p className="text-[11px] text-slate-500">
              Last Updated &amp; In Effect: September 2026 | Governing Law: Laws of India | Jurisdiction: Srinagar, J&amp;K
            </p>
          </div>

          <div className="space-y-10 text-sm sm:text-base text-slate-800 leading-relaxed">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                1. Legal Entity &amp; Scope of Services
              </h2>
              <p>
                <strong>The Indian Wings Company</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is a premier destination management company and registered tour operator operating from The Indian Wings Travels, Sheikh Palace, 2nd Floor, Kanyar Chowk, Srinagar, Jammu &amp; Kashmir, India.
              </p>
              <p>
                We provide holiday itinerary planning, verified hotel and heritage houseboat reservations, private sanitized chauffeur transportation, Dal Lake Shikara cruises, adventure activity bookings, and 24/7 ground assistance across Jammu, Kashmir, and Ladakh. By accessing our platform, requesting itineraries, paying a token deposit, or boarding our fleet, the client (&quot;Traveler&quot;, &quot;User&quot;, or &quot;Guest&quot;) enters into a legally binding contract with us governed by these Terms.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                2. Mandatory Government Identification (GoI Directives)
              </h2>
              <p>
                In strict conformity with Ministry of Home Affairs (MHA), Bureau of Civil Aviation Security (BCAS), and Jammu &amp; Kashmir District Administration guidelines:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  Every traveler (including minors and infants) must possess an authentic Government-issued Photo ID card during their entire trip. <strong>Acceptable ID proofs:</strong> Original Aadhaar Card, Valid Indian Passport, Voter ID Card, or Driving License.
                </li>
                <li>
                  <strong>PAN Cards are NOT accepted</strong> as valid proof of identity or address by J&amp;K police checkpoints, high-altitude military checkposts, or Srinagar International Airport.
                </li>
                <li>
                  Foreign nationals, OCI, and NRI guests must possess a valid Passport and Indian Visa / e-Visa. Restricted or Protected Area Permits (RAP/PAP) will be processed through official government portals upon advance passport copy submission.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                3. Booking Confirmation &amp; Payment Schedules
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  <strong>Advance Booking Token:</strong> An itinerary is confirmed only upon receipt of a minimum 30% to 50% advance token deposit of the total package cost.
                </li>
                <li>
                  <strong>Peak Season Policy:</strong> For peak periods (Tulip Festival in March–April, Gulmarg snow ski season from December to February, and Autumn foliage), a 50% non-refundable advance is mandated due to strict hotel and houseboat reservation locks.
                </li>
                <li>
                  <strong>Balance Payment:</strong> The remaining balance must be cleared upon arrival in Srinagar prior to check-in or commencement of internal transfers, payable via UPI, direct NEFT/RTGS bank transfer, or major credit/debit cards.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                4. Local Union Transport &amp; Route Regulations
              </h2>
              <p>
                Guests must note that internal sightseeing in certain sensitive ecological and mountain sectors is regulated by local administrative unions:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  <strong>Pahalgam Sightseeing:</strong> Commercial cabs from Srinagar can drop guests at Pahalgam market. Internal valley sightseeing to Aru Valley, Betaab Valley, and Chandanwari is strictly reserved by order of the local administration for registered local Pahalgam Taxi Union vehicles. We organize seamless union cab interchanges without hassle.
                </li>
                <li>
                  <strong>Gulmarg Snow Mobility:</strong> During heavy winter snowfall, outside vehicles are stopped at Tangmarg by police administration. Tangmarg–Gulmarg hill climbs require certified snow-chain 4x4 vehicles, which are coordinated in our luxury winter itineraries.
                </li>
                <li>
                  <strong>Sonamarg Zero Point:</strong> Sightseeing to Zero Point / Zojila Pass is subject to local Kargil/Sonamarg union vehicles and BRO road clearance.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                5. High Altitude, Weather &amp; Force Majeure
              </h2>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-700 text-xs uppercase tracking-wide">
                  <AlertCircle size={15} />
                  <span>Weather Stoppages &amp; Force Majeure</span>
                </div>
                <p className="text-xs sm:text-sm">
                  Kashmir is an alpine Himalayan territory subject to sudden snowfall, landslides along National Highway NH-44, low-visibility airport suspensions, and extreme wind stoppages of the Gulmarg Gondola. The Indian Wings Company will make all alternative arrangements, but shall not be held liable for compensatory damages arising from Acts of God, road blockades, state security curbs, or official government closures.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                6. Gulmarg Gondola Tickets &amp; Third-Party Services
              </h2>
              <p>
                The Gulmarg Gondola is owned, operated, and regulated entirely by the <strong>Jammu &amp; Kashmir Cable Car Corporation (JKCCC)</strong>. As per official government policy:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>Gondola Phase 1 and Phase 2 tickets are 100% personalized with traveler Aadhaar/Passport numbers.</li>
                <li>Tickets once booked on the government portal are non-transferable, non-refundable, and non-reschedulable by third-party agencies.</li>
                <li>In case of technical failure or weather cancellations by the Cable Car Corporation, refunds are processed directly by JKCCC as per their statutory refund rule.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                7. Dispute Resolution &amp; Exclusive Jurisdiction
              </h2>
              <p>
                In the unlikely event of any legal claim, dispute, or difference arising under or in connection with these Terms, both parties agree to resolve the dispute amicably through good-faith mutual negotiation. If unresolved within 30 days, the dispute shall be referred to arbitration in Srinagar under the Indian Arbitration and Conciliation Act, 1996.
              </p>
              <p>
                <strong>Exclusive Court Jurisdiction:</strong> The competent Courts situated in <strong>Srinagar, Jammu &amp; Kashmir, India</strong> shall have exclusive jurisdiction over any and all legal proceedings arising out of this agreement.
              </p>
            </section>

            {/* Section 8: Statutory Grievance Redressal */}
            <section className="p-6 rounded-2xl bg-white border border-black/10 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-midnight font-bold text-base sm:text-lg">
                <Building2 size={20} className="text-saffron" />
                <span>Statutory Grievance Redressal Officer</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                In compliance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020 and Section 5(1) of the Information Technology (Intermediary Guidelines) Rules, 2011, consumer complaints and grievances may be directed to our designated officer:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-2 text-slate-700">
                <div>
                  <span className="font-bold text-midnight block">Grievance Officer:</span>
                  <span>Legal &amp; Compliance Head, The Indian Wings Company</span>
                </div>
                <div>
                  <span className="font-bold text-midnight block">Registered Office:</span>
                  <span>The Indian Wings Travels, Sheikh Palace, 2nd Floor, Kanyar Chowk, Srinagar, J&amp;K, India</span>
                </div>
                <div>
                  <span className="font-bold text-midnight block">Email:</span>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-saffron underline">
                    {siteConfig.contact.email}
                  </a>
                </div>
                <div>
                  <span className="font-bold text-midnight block">Phone Helpline:</span>
                  <span>{siteConfig.contact.displayPhone}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-black/5">
                Statutory Acknowledgement: Within 48 hours | Statutory Redressal Timeline: Within 30 days of receipt.
              </p>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
