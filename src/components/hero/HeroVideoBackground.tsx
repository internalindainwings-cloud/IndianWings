import React from 'react';
import Image from 'next/image';

interface HeroVideoBackgroundProps {
  src?: string;
  mobileSrc?: string;
  poster?: string;
  mobilePoster?: string;
}

const DEFAULT_DESKTOP_IMAGE = '/images/hero-panoramic.jpg';
const DEFAULT_MOBILE_VIDEO = 'https://res.cloudinary.com/dcmoseix9/video/upload/f_auto,q_auto,ac_none/v1789317861/Final_Video_rdc5nd.mp4';
const DEFAULT_MOBILE_POSTER = 'https://res.cloudinary.com/dcmoseix9/video/upload/so_0,f_auto,q_auto/v1789317861/Final_Video_rdc5nd.jpg';

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({ 
  src, 
  mobileSrc = DEFAULT_MOBILE_VIDEO,
  poster,
  mobilePoster = DEFAULT_MOBILE_POSTER
}) => {
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

      {/* 2. Desktop View: Cinematic Ultra-Wide Panoramic Visual */}
      <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src={DEFAULT_DESKTOP_IMAGE}
          alt="Shree Vaishnodevi & Himalayan Panoramic Sacred Valley"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.02] transition-transform duration-1000"
        />
      </div>
      
      {/* Subtle uniform tint for contrast */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      {/* Subtle bottom gradient to blend with Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-midnight/60 to-transparent pointer-events-none" />
    </div>
  );
};
