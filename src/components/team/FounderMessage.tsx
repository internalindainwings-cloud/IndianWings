import React from 'react';
import Image from 'next/image';
import { Phone, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site-config';


interface FounderMessageProps {
  imageSrc?: string;
}

export function FounderMessage({
  imageSrc = 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789917437/founder_new.jpg',
}: FounderMessageProps) {
  const cleanPhone = siteConfig.contact.phone.replace(/[^0-9]/g, '');
  const cleanWhatsapp = (siteConfig.contact.whatsapp || '917827743041').replace(/[^0-9]/g, '');

  return (
    <section
      id="founder"
      aria-label="Message from Founders & Leadership Team"
      className="w-full bg-[#FCFBF8] py-8 sm:py-10 border-t border-black/8 scroll-mt-20"
    >
      <div className="max-w-[1020px] mx-auto px-5 sm:px-8">
        
        {/* Editorial Personal Note Layout */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-black/8 shadow-xs flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 lg:gap-10">
          
          {/* Portrait Photo (Natural, Real, Framed) */}
          <div className="relative w-44 h-60 sm:w-52 sm:h-72 rounded-xl overflow-hidden border border-black/10 shadow-sm shrink-0 bg-slate-100">
            <Image
              src={imageSrc}
              alt="Founders & Leadership Team — The Indian Wings Company"
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 176px, 208px"
            />
          </div>

          {/* Authentic Human Content (Letter from the Founder) */}
          <div className="flex flex-col justify-between flex-grow space-y-3.5 text-left">
            
            {/* Header / Identity */}
            <div className="border-b border-black/6 pb-3">
              <span className="text-[11px] font-manrope font-bold text-saffron uppercase tracking-widest block mb-0.5">
                From The Managing Director&apos;s Desk
              </span>
              <h2 className="font-playfair text-2xl sm:text-[26px] font-bold text-[#0B1F2A] leading-tight">
                Mrs. Komal Rai
              </h2>
              <p className="font-manrope text-xs text-[#64748B] font-medium mt-0.5">
                Founder &amp; Managing Director &bull; The Indian Wings Company (Srinagar, Kashmir)
              </p>
            </div>

            {/* Authentic Grounded Note (No AI Cliches) */}
            <div className="space-y-2.5 text-[#334155] font-manrope text-[13px] sm:text-[13.5px] leading-relaxed">
              <p>
                &ldquo;When you plan a trip to Kashmir with us, you are not dealing with a distant call center or automated algorithms. Our team is based right here on the ground in Srinagar.&rdquo;
              </p>
              <p className="text-[#475569]">
                Every hotel and luxury houseboat in our packages is personally inspected by us. Our local drivers are verified and experienced mountain chauffeurs, and our pricing remains 100% transparent with zero surprise charges. From the moment your flight lands at Sheikh ul-Alam Airport until you board your flight home, my team is directly available for you at any hour.
              </p>
            </div>

            {/* Direct Personal Contact Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-manrope font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <Phone size={12} className="fill-white" />
                <span>Call Our Srinagar Team</span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hello Mrs. Komal Rai & The Indian Wings team, I would like to discuss my Kashmir travel plans.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00A859] hover:bg-[#16A34A] text-white font-manrope font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <MessageCircle size={13} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default FounderMessage;
