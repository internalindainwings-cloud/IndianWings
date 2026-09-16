import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Lock, Eye, Server, UserCheck, Building2 } from 'lucide-react';
import { siteConfig } from '@/config/site-config';
import { HeroActionBar } from '@/components/trust/HeroActionBar';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Indian Wings Company',
  description: 'Official Privacy Policy of The Indian Wings Company detailing data collection, processing purposes, traveler rights, security safeguards, and grievance redressal.',
  keywords: [
    'Privacy Policy Kashmir travel',
    'The Indian Wings Company data protection',
    'DPDP Act 2023 compliant travel policy',
    'IT Act 2000 privacy policy',
    'Kashmir tour booking data security'
  ],
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full min-h-screen bg-background text-[#1A1A1A] flex flex-col">
      {/* 1. Standardized Hero Header */}
      <section className="relative w-screen max-w-full h-[calc(100dvh-115px)] sm:h-[calc(100dvh-110px)] min-h-[435px] max-h-[545px] min-[1140px]:h-[calc(100dvh-150px)] min-[1140px]:min-h-[465px] min-[1140px]:max-h-[575px] flex flex-col justify-between overflow-hidden bg-midnight">
        {/* 1. Background Image with Light Scrim */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gallery/pahalgam-valley.jpg"
            alt="Privacy Policy - The Indian Wings Company"
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
                    <span className="text-saffron font-semibold">Privacy Policy</span>
                  </li>
                </ol>
              </nav>

              {/* Major Heading - Single Line */}
              <h1 className="font-display text-[18px] min-[360px]:text-[20px] min-[400px]:text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[44px] text-saffron leading-tight tracking-tight whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-3 sm:mb-4">
                Privacy Policy
              </h1>

              {/* Action Buttons: Small size directly here */}
              <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <a
                  href="#privacy-body"
                  className="px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-saffron text-midnight font-manrope font-bold text-xs shadow-md hover:shadow-saffron/30 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Read Privacy Terms</span>
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

      {/* 2. Privacy Content Body */}
      <div id="privacy-body" className="w-full bg-background py-14 sm:py-20 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 font-manrope">
          
          {/* Statutory Header Notice */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-black/10 mb-10 space-y-3">
            <div className="flex items-center gap-2 text-saffron font-bold text-xs uppercase tracking-wider">
              <ShieldCheck size={16} />
              <span>DPDP Act 2023 &amp; IT Act 2000 Compliance</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              This Privacy Policy explains how <strong>The Indian Wings Company</strong> collects, uses, stores, and protects your personal data in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000 (Section 43A)</strong>, and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules)</strong>.
            </p>
            <p className="text-[11px] text-slate-500">
              Last Updated &amp; In Effect: September 2026 | Data Fiduciary: The Indian Wings Company, Srinagar, J&amp;K
            </p>
          </div>

          <div className="space-y-10 text-sm sm:text-base text-slate-800 leading-relaxed">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                1. Data Fiduciary &amp; Purpose of Collection
              </h2>
              <p>
                The Indian Wings Company acts as a Data Fiduciary for the personal data provided by our travelers. We collect only adequate, relevant, and necessary data for lawful purposes directly connected with planning, booking, and executing your Kashmir travel itineraries.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                2. Nature of Personal Data Collected
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  <strong>Contact &amp; Identity Information:</strong> Full legal name, gender, age, residential address, mobile phone number, and email address.
                </li>
                <li>
                  <strong>Statutory Government Identity Documents:</strong> Aadhaar number / copy, Passport details, or Voter ID strictly when required for high-security Jammu &amp; Kashmir Cable Car Corporation (Gulmarg Gondola) bookings, hotel guest register compliance (Form-C for foreign tourists), or inner-line mountain permits.
                </li>
                <li>
                  <strong>Travel &amp; Logistics Details:</strong> Flight arrival/departure numbers, hotel room preferences, dietary requirements, and health/acclimatization disclosures for high-altitude excursions.
                </li>
                <li>
                  <strong>Transactional Data:</strong> Payment transaction references, UPI transaction IDs, or bank payment receipts. <em>Note: We do not store raw credit card numbers or banking passwords on our servers; all digital payments are handled via RBI-authorized, PCI-DSS compliant payment gateways.</em>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                3. Lawful Basis &amp; Sharing with Verified Service Partners
              </h2>
              <p>
                Under Section 4 and Section 7 of the DPDP Act 2023, personal data is processed based on explicit traveler consent and for legitimate travel fulfillment:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  <strong>Hospitality Partners:</strong> Sharing guest names and photo ID copies with reserved 4-star hotels, luxury resorts, and heritage Dal Lake houseboats for mandatory state police guest logbooks.
                </li>
                <li>
                  <strong>Chauffeur &amp; Transport Drivers:</strong> Sharing passenger names and mobile numbers with our assigned private verified drivers for airport meet-and-greet and highway coordination.
                </li>
                <li>
                  <strong>Government Entities:</strong> Submitting verified passenger lists to the Jammu &amp; Kashmir Cable Car Corporation for non-transferable Gondola tickets.
                </li>
                <li>
                  <strong>Zero Commercial Sale:</strong> We strictly maintain zero commercial selling, renting, or trading of traveler contact databases to third-party telemarketers or external advertisers.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                4. Data Security &amp; Retention Standards
              </h2>
              <p>
                In compliance with Rule 8 of the IT (SPDI) Rules 2011, we implement comprehensive technical, administrative, and physical safeguards:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>All website communications are encrypted in transit using 256-bit Transport Layer Security (TLS/SSL).</li>
                <li>Administrative dashboards and booking records are protected behind multi-factor authentication and role-based access controls.</li>
                <li>Identity copies submitted for permits are retained only for the duration mandated by Indian tourism tax and security regulations, after which they are securely purged.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-midnight border-b border-black/10 pb-2">
                5. Rights of the Data Principal (Traveler Rights)
              </h2>
              <p>
                Under Chapter III of the Digital Personal Data Protection Act, 2023, you have the following enforceable rights:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li><strong>Right to Access:</strong> Request a summary of your personal data held by us.</li>
                <li><strong>Right to Correction &amp; Erasure:</strong> Correct outdated contact information or request deletion of data once travel is concluded (subject to statutory audit rules).</li>
                <li><strong>Right to Grievance Redressal:</strong> Direct any privacy concerns to our statutory Data Protection &amp; Grievance Officer.</li>
                <li><strong>Right to Nominate:</strong> Nominate an individual to exercise rights on your behalf in case of incapacity.</li>
              </ul>
            </section>

            {/* Section 6: Statutory Grievance Redressal Officer */}
            <section className="p-6 rounded-2xl bg-white border border-black/10 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-midnight font-bold text-base sm:text-lg">
                <Building2 size={20} className="text-saffron" />
                <span>Statutory Data Protection &amp; Grievance Officer</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Under Section 5(1) of the Information Technology (SPDI) Rules, 2011 and Section 12 of the DPDP Act, 2023, you may contact our Grievance Officer regarding any data protection concerns:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm pt-2 text-slate-700">
                <div>
                  <span className="font-bold text-midnight block">Officer:</span>
                  <span>Data Protection Officer, The Indian Wings Company</span>
                </div>
                <div>
                  <span className="font-bold text-midnight block">Office Address:</span>
                  <span>Boulevard Road, Dal Lake, Srinagar, J&amp;K 190001, India</span>
                </div>
                <div>
                  <span className="font-bold text-midnight block">Email:</span>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-saffron underline">
                    {siteConfig.contact.email}
                  </a>
                </div>
                <div>
                  <span className="font-bold text-midnight block">Helpline:</span>
                  <span>{siteConfig.contact.displayPhone}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-black/5">
                Acknowledgement Timeline: Within 48 hours | Resolution Timeline: Within 30 days as mandated by Government of India rules.
              </p>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
