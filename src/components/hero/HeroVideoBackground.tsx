import React from 'react';

interface HeroVideoBackgroundProps {
  src?: string;
  mobileSrc?: string;
  poster?: string;
  mobilePoster?: string;
}

const DEFAULT_DESKTOP_VIDEO = 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789371598/final_hero_desktop_ebblmr.mp4';
const DEFAULT_DESKTOP_POSTER = 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789371598/final_hero_desktop_ebblmr.jpg';
const DEFAULT_MOBILE_VIDEO = 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789317861/Final_Video_rdc5nd.mp4';
const DEFAULT_MOBILE_POSTER = 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789317861/Final_Video_rdc5nd.jpg';

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({ 
  src, 
  mobileSrc = DEFAULT_MOBILE_VIDEO,
  poster,
  mobilePoster = DEFAULT_MOBILE_POSTER
}) => {
  const activeDesktopSrc = src || DEFAULT_DESKTOP_VIDEO;
  const activeDesktopPoster = poster || DEFAULT_DESKTOP_POSTER;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-midnight">
      {/* 1. Mobile View: Ultra-Optimized Scenic Video */}
      <div className="block md:hidden absolute inset-0 w-full h-full pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={mobilePoster}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={mobileSrc} type="video/mp4" />
        </video>
      </div>

      {/* 2. Desktop View: High-Performance Desktop Video with Complete Checklist Applied (No Static Image Fallback) */}
      <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={activeDesktopPoster}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src={activeDesktopSrc} type="video/mp4" />
        </video>
      </div>
      
      {/* Subtle uniform tint (removed heavy left-side gradient overlay) */}
      <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-midnight/50 to-transparent pointer-events-none" />
    </div>
  );
};
