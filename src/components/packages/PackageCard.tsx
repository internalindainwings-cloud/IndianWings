'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, Heart, Snowflake, Users, Check, ArrowRight, Gift } from 'lucide-react';
import { PackageItem } from '@/data/packages';
import { useEnquiryModal } from '@/context/EnquiryModalContext';
import { generatePackageSlug } from '@/lib/utilities/slug';
import { siteConfig } from '@/config/site-config';

interface PackageCardProps {
  pkg: PackageItem;
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const { openModal } = useEnquiryModal();
  const slug = pkg.slug || generatePackageSlug(pkg.title, pkg.duration);
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 1024px)').matches || window.matchMedia('(hover: none)').matches;
      setIsMobile(mobile);
      return mobile;
    };
    const mobile = checkMobile();

    if (!mobile || !cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.25, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCardClick = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 2400);
  };

  // Dynamic Theme Configuration based on Admin Assigned Animation or Category Fallback
  const animChoice = pkg.cardAnimation || (pkg.tagColor === 'snow' || pkg.tagColor === 'heart' || pkg.tagColor === 'none' ? pkg.tagColor : null);
  const isHoneymoon = animChoice === 'heart' || (!animChoice && (pkg.category === 'honeymoon' || pkg.title.toLowerCase().includes('honeymoon') || pkg.title.toLowerCase().includes('romantic')));
  const isWinter = animChoice === 'snow' || (!animChoice && (pkg.category === 'winter' || pkg.title.toLowerCase().includes('winter') || pkg.title.toLowerCase().includes('snow') || pkg.title.toLowerCase().includes('ski')));

  const theme = isHoneymoon
    ? {
        type: 'honeymoon',
        badgeBg: 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-[0_2px_8px_rgba(244,63,94,0.35)]',
        badgeIcon: <Heart size={10} className="fill-white animate-pulse" />,
        startColor: '#f43f5e',
        midColor: '#ec4899',
        endColor: '#fb7185',
        glowColor: 'rgba(244,63,94,0.85)',
        traceGradient: 'from-rose-500 via-pink-500 to-rose-400',
        cardBorder: 'hover:border-rose-400',
        titleHover: 'group-hover:text-rose-600',
        mapIconColor: 'text-rose-500',
        chevronColor: 'text-[#F43F5E]',
        scrollClass: 'inclusion-scroll-honeymoon',
      }
    : isWinter
    ? {
        type: 'winter',
        badgeBg: 'bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 text-white shadow-[0_2px_8px_rgba(14,165,233,0.35)]',
        badgeIcon: <Snowflake size={10} className="animate-spin" style={{ animationDuration: '8s' }} />,
        startColor: '#38bdf8',
        midColor: '#06b6d4',
        endColor: '#3b82f6',
        glowColor: 'rgba(14,165,233,0.85)',
        traceGradient: 'from-sky-400 via-cyan-400 to-blue-500',
        cardBorder: 'hover:border-sky-400',
        titleHover: 'group-hover:text-sky-600',
        mapIconColor: 'text-sky-500',
        chevronColor: 'text-[#0284C7]',
        scrollClass: 'inclusion-scroll-winter',
      }
    : {
        type: 'family',
        badgeBg: 'bg-gradient-to-r from-amber-500 via-saffron to-amber-600 text-midnight font-bold shadow-[0_2px_8px_rgba(245,166,35,0.35)]',
        badgeIcon: <Users size={10} className="text-midnight" />,
        startColor: '#f59e0b',
        midColor: '#f5a623',
        endColor: '#d97706',
        glowColor: 'rgba(245,166,35,0.85)',
        traceGradient: 'from-amber-400 via-saffron to-amber-500',
        cardBorder: 'hover:border-amber-400',
        titleHover: 'group-hover:text-amber-700',
        mapIconColor: 'text-saffron',
        chevronColor: 'text-[#F59E0B]',
        scrollClass: 'inclusion-scroll-family',
      };

  // Desktop: exact approved hover/click state
  // Mobile: automatic infinite orbit when card is in viewport
  const isDesktopActive = !isMobile && (isHovered || isActive);
  const isMobileActive = isMobile && (isInView || isActive);
  const isEffectiveTrace = isDesktopActive || isMobileActive;

  // Calculate discount savings (as shown in reference screenshot)
  const savings = pkg.originalPrice && pkg.originalPrice > pkg.startingPrice ? pkg.originalPrice - pkg.startingPrice : null;
  const cleanPhone = siteConfig.contact.phone.replace(/[^0-9]/g, '');

  return (
    <div 
      ref={cardRef}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between text-left cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-1.5"
    >
      {/* Outer Glowing Spread Halo */}
      <div 
        className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${theme.traceGradient} ${isEffectiveTrace ? (isMobile ? 'opacity-35' : 'opacity-50') : 'opacity-0'} blur-sm transition-opacity duration-500 pointer-events-none -z-10`} 
      />

      {/* Main Card Container */}
      <div className={`relative bg-white rounded-xl overflow-hidden border border-black/10 ${theme.cardBorder} ${isEffectiveTrace ? 'shadow-md' : 'shadow-xs'} hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full`}>
        
        {/* Seamless Continuous Rounded-Corner Laser Border */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
        >
          <defs>
            <linearGradient id={`trace-grad-${pkg.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.startColor} />
              <stop offset="50%" stopColor={theme.midColor} />
              <stop offset="100%" stopColor={theme.endColor} />
            </linearGradient>
          </defs>

          {isMobile ? (
            /* MOBILE ONLY: Continuous Infinite Smooth Orbit (Slower Speed: 4.8s) when in viewport */
            <rect
              x="1.25"
              y="1.25"
              width="calc(100% - 2.5px)"
              height="calc(100% - 2.5px)"
              rx="12"
              fill="none"
              stroke={`url(#trace-grad-${pkg.id})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength="100"
              className={`transition-opacity duration-500 ${isMobileActive ? 'opacity-100 animate-laser-orbit' : 'opacity-0'}`}
              style={{
                strokeDasharray: '38 62',
                filter: isMobileActive ? `drop-shadow(0 0 6px ${theme.glowColor})` : 'none',
              }}
            />
          ) : (
            /* DESKTOP ONLY: 100% Exact Approved Hover Laser Trace */
            <rect
              x="1.25"
              y="1.25"
              width="calc(100% - 2.5px)"
              height="calc(100% - 2.5px)"
              rx="12"
              fill="none"
              stroke={`url(#trace-grad-${pkg.id})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength="100"
              style={{
                strokeDasharray: 100,
                strokeDashoffset: isDesktopActive ? 0 : 100,
                filter: isDesktopActive ? `drop-shadow(0 0 5px ${theme.glowColor})` : 'none',
                transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.4s ease',
              }}
            />
          )}
        </svg>

        {/* 1. Low-Profile Snug Image (h-[145px] sm:h-[152px]) */}
        <Link href={`/packages/${slug}`} className="block relative w-full h-[145px] sm:h-[152px] overflow-hidden bg-slate-100">
          <Image
            src={pkg.imageUrl}
            alt={pkg.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-106 pointer-events-none"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20 pointer-events-none" />

          {/* Honeymoon Card Gentle Falling Hearts Rain Animation */}
          {isHoneymoon && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
              {[
                { left: '6%', delay: '0s', duration: '3.2s', size: 12 },
                { left: '16%', delay: '1.8s', duration: '3.9s', size: 10 },
                { left: '26%', delay: '0.8s', duration: '3.5s', size: 14 },
                { left: '38%', delay: '2.4s', duration: '3.1s', size: 11 },
                { left: '48%', delay: '0.3s', duration: '4.0s', size: 13 },
                { left: '58%', delay: '1.5s', duration: '3.4s', size: 10 },
                { left: '68%', delay: '2.8s', duration: '3.8s', size: 12 },
                { left: '78%', delay: '0.9s', duration: '3.3s', size: 14 },
                { left: '88%', delay: '2.1s', duration: '4.1s', size: 11 },
                { left: '94%', delay: '1.2s', duration: '3.6s', size: 9 },
                { left: '12%', delay: '2.7s', duration: '3.7s', size: 11 },
                { left: '32%', delay: '1.1s', duration: '4.2s', size: 13 },
                { left: '62%', delay: '0.5s', duration: '3.6s', size: 12 },
                { left: '84%', delay: '2.9s', duration: '3.4s', size: 10 },
                { left: '44%', delay: '3.2s', duration: '3.9s', size: 11 },
              ].map((heart, idx) => (
                <span
                  key={idx}
                  className="absolute -top-4 text-red-500 fill-red-500 drop-shadow-[0_1px_5px_rgba(239,68,68,0.9)] animate-heart-rain pointer-events-none"
                  style={{
                    left: heart.left,
                    animationDelay: heart.delay,
                    animationDuration: heart.duration,
                  }}
                >
                  <svg width={heart.size} height={heart.size} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </span>
              ))}
            </div>
          )}

          {/* Winter Card Gentle Falling Snow Animation */}
          {isWinter && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
              {[
                { left: '5%', delay: '0s', duration: '3.5s', size: 10, anim: 'animate-snow-fall', isFlake: true },
                { left: '14%', delay: '1.6s', duration: '4.2s', size: 6, anim: 'animate-snow-drift', isFlake: false },
                { left: '22%', delay: '0.7s', duration: '3.8s', size: 12, anim: 'animate-snow-fall', isFlake: true },
                { left: '33%', delay: '2.3s', duration: '4.0s', size: 5, anim: 'animate-snow-drift', isFlake: false },
                { left: '42%', delay: '0.4s', duration: '3.3s', size: 11, anim: 'animate-snow-fall', isFlake: true },
                { left: '52%', delay: '1.9s', duration: '4.5s', size: 7, anim: 'animate-snow-drift', isFlake: false },
                { left: '61%', delay: '1.1s', duration: '3.6s', size: 13, anim: 'animate-snow-fall', isFlake: true },
                { left: '71%', delay: '2.8s', duration: '4.1s', size: 6, anim: 'animate-snow-drift', isFlake: false },
                { left: '80%', delay: '0.8s', duration: '3.4s', size: 11, anim: 'animate-snow-fall', isFlake: true },
                { left: '90%', delay: '2.0s', duration: '4.3s', size: 5, anim: 'animate-snow-drift', isFlake: false },
                { left: '96%', delay: '1.3s', duration: '3.7s', size: 10, anim: 'animate-snow-fall', isFlake: true },
                { left: '10%', delay: '2.5s', duration: '3.9s', size: 6, anim: 'animate-snow-drift', isFlake: false },
                { left: '28%', delay: '1.2s', duration: '3.5s', size: 12, anim: 'animate-snow-fall', isFlake: true },
                { left: '47%', delay: '2.7s', duration: '4.4s', size: 5, anim: 'animate-snow-drift', isFlake: false },
                { left: '67%', delay: '0.2s', duration: '3.7s', size: 10, anim: 'animate-snow-fall', isFlake: true },
                { left: '85%', delay: '3.1s', duration: '3.9s', size: 6, anim: 'animate-snow-drift', isFlake: false },
              ].map((snow, idx) => (
                <span
                  key={idx}
                  className={`absolute -top-4 ${snow.anim} pointer-events-none text-white drop-shadow-[0_1px_5px_rgba(255,255,255,0.95)]`}
                  style={{
                    left: snow.left,
                    animationDelay: snow.delay,
                    animationDuration: snow.duration,
                  }}
                >
                  {snow.isFlake ? (
                    <Snowflake size={snow.size} className="text-white/95" />
                  ) : (
                    <span 
                      className="block rounded-full bg-white/95 shadow-[0_0_6px_rgba(255,255,255,0.9)]" 
                      style={{ width: `${snow.size}px`, height: `${snow.size}px` }}
                    />
                  )}
                </span>
              ))}
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${theme.badgeBg} text-[10px] font-manrope font-bold backdrop-blur-md`}>
              {theme.badgeIcon}
              <span>{pkg.tag}</span>
            </span>

            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-midnight/85 backdrop-blur-md text-warm-white text-[9.5px] font-manrope font-semibold border border-white/15 shadow-xs">
              {pkg.duration}
            </span>
          </div>

          {/* Bottom-Left Badge: Free Gift Inside */}
          <div className="absolute bottom-2 left-2 pointer-events-none z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 text-[9.5px] sm:text-[10px] font-manrope font-extrabold shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-white/70 tracking-tight">
              <Gift size={11} className="text-slate-950 stroke-[2.5]" />
              <span>Free Gift Inside</span>
            </span>
          </div>
        </Link>

        {/* 2. Content Body (Matching Reference: Compact Heading + Themed Scrollable Inclusions + Red Price + 3 Buttons) */}
        <div className="p-3 sm:p-3.5 flex flex-col flex-grow justify-between bg-white space-y-2">
          <div className="space-y-1">
            {/* Package Title (Small, Compact & Clean) */}
            <Link href={`/packages/${slug}`} className="block">
              <h3 className="font-sans text-[13.5px] sm:text-[14px] font-bold text-[#0B1F2A] leading-tight hover:text-saffron transition-colors truncate">
                {pkg.title}
              </h3>
            </Link>

            {/* Package Inclusion Container (Polished Micro-Card - Zero Cut-Off Flaw) */}
            <div className="bg-[#F8FAFC] rounded-lg p-2 border border-slate-100 mt-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-manrope font-bold text-[11px] text-[#0B1F2A] tracking-tight">
                  Package Inclusions
                </span>
                <Link
                  href={`/packages/${slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-[9.5px] font-manrope font-extrabold text-[#0B1F2A] hover:text-midnight bg-white hover:bg-saffron/20 px-2 py-0.5 rounded border border-slate-200/90 hover:border-saffron shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer group/view"
                  title={`View details (${pkg.inclusions.length} Highlights)`}
                >
                  <span className="hidden min-[380px]:inline">View Details</span>
                  <span className="min-[380px]:hidden">View</span>
                  <ArrowRight size={10} className="text-saffron transition-transform group-hover/view:translate-x-0.5" />
                </Link>
              </div>

              {/* Scrollable Inclusions List with Card-Themed Scrollbar & Sleek Modern Chevron Icons */}
              <div className={`${theme.scrollClass} h-[58px] overflow-y-auto pr-1 space-y-1.5`}>
                {pkg.inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] font-manrope font-medium leading-none text-[#1E293B]">
                    <Check size={11} className="text-emerald-600 shrink-0 stroke-[2.5]" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Pricing Row (Exact Reference Match: Grey Strikethrough + Bold Red Price + Green Save Badge) */}
          <div className="pt-1.5 border-t border-black/6">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-[#E11D48] text-[15px] font-bold select-none">₹</span>
                {pkg.originalPrice && (
                  <span className="text-slate-400 font-mono text-[11px] line-through">
                    {pkg.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[#E11D48] text-[17px] sm:text-[18px] font-extrabold tracking-tight leading-none ml-0.5">
                  {pkg.startingPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 font-sans ml-0.5">
                  Per Person <span className="text-[#E11D48]">*</span>
                </span>
              </div>

              {savings && (
                <span className="text-[#16A34A] font-extrabold text-[11.5px] tracking-tight shrink-0">
                  Save ₹ {savings.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* 4. Three Action Buttons in Same Colors as Reference (Blue Call Now, Green Whatsapp, Ochre Enquiry) */}
            <div className="grid grid-cols-3 gap-1.5 pt-2">
              {/* Button 1: Call Now (Blue) */}
              <a
                href={`tel:${siteConfig.contact.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="h-8 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-manrope font-bold text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1 shadow-xs hover:shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <Phone size={11} className="fill-white shrink-0" />
                <span>Call Now</span>
              </a>

              {/* Button 2: Whatsapp (Vibrant Green) */}
              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi, I would like to inquire about the ${pkg.title} (${pkg.duration}) package.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="h-8 rounded-lg bg-[#00A859] hover:bg-[#16A34A] text-white font-manrope font-bold text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1 shadow-xs hover:shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <span>Whatsapp</span>
              </a>

              {/* Button 3: Enquiry (Mughal Marigold / Accent) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal({
                    packageTitle: `${pkg.title} (${pkg.duration})`,
                    defaultTripType:
                      isHoneymoon
                        ? 'Honeymoon Special with Luxury Houseboat'
                        : isWinter
                        ? 'Adventure & Snow Sports (Gulmarg Skiing & Treks)'
                        : 'Kashmir Classic (Srinagar, Gulmarg, Pahalgam)',
                    source: `package_card_${pkg.id}`,
                  });
                }}
                className="h-8 rounded-lg bg-saffron hover:brightness-95 text-midnight font-manrope font-extrabold text-[10.5px] sm:text-[11px] flex items-center justify-center gap-1 shadow-xs hover:shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <Mail size={11} className="text-midnight shrink-0 stroke-[2.2]" />
                <span>Enquiry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
