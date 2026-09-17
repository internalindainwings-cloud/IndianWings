import React from 'react';
import Image from 'next/image';

interface HeroVideoBackgroundProps {
  src?: string;
  mobileSrc?: string;
  poster?: string;
  mobilePoster?: string;
}

const DEFAULT_DESKTOP_MEDIA = 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png';
const DEFAULT_MOBILE_VIDEO = 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789317861/Final_Video_rdc5nd.mp4';
const DEFAULT_MOBILE_POSTER = 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789317861/Final_Video_rdc5nd.jpg';

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({ 
  src, 
  mobileSrc,
  poster,
  mobilePoster
}) => {
  // Resolve active media URL from slide props dynamically
  const candidateDesktop = (src && src.trim().length > 0) ? src.trim() : (poster && poster.trim().length > 0) ? poster.trim() : DEFAULT_DESKTOP_MEDIA;
  const candidateMobile = (mobileSrc && mobileSrc.trim().length > 0) ? mobileSrc.trim() : (mobilePoster && mobilePoster.trim().length > 0) ? mobilePoster.trim() : candidateDesktop;

  const activeDesktopSrc = candidateDesktop;
  const activeDesktopPoster = (poster && poster.trim().length > 0) ? poster.trim() : candidateDesktop;

  const isDesktopImage = activeDesktopSrc.match(/\.(jpeg|jpg|png|webp|avif)$/i) || activeDesktopSrc.includes('/image/upload/');
  const isMobileImage = candidateMobile.match(/\.(jpeg|jpg|png|webp|avif)$/i) || candidateMobile.includes('/image/upload/');

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-midnight transition-opacity duration-700">
      {/* 1. Mobile View: Dynamic Carousel Slide Media (Image or Video) */}
      <div className="block md:hidden absolute inset-0 w-full h-full pointer-events-none">
        {isMobileImage ? (
          <Image
            src={candidateMobile}
            alt="Hero Mobile Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={candidateMobile}
            className="absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src={candidateMobile} type="video/mp4" />
          </video>
        )}
      </div>

      {/* 2. Desktop View: Dynamic Carousel Slide Media (Image or Video) */}
      <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
        {isDesktopImage ? (
          <Image
            src={activeDesktopSrc}
            alt="Hero Desktop Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-[1.02] transition-transform duration-1000"
          />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={activeDesktopPoster}
            className="absolute inset-0 w-full h-full object-cover object-top"
          >
            <source src={activeDesktopSrc} type="video/mp4" />
          </video>
        )}
      </div>
      
      {/* Subtle uniform tint */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      {/* Subtle bottom gradient to blend with Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-midnight/60 to-transparent pointer-events-none" />
    </div>
  );
};
