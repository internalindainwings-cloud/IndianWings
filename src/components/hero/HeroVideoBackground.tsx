import React from 'react';
import Image from 'next/image';
import type { HeroSlide, HeroTransitionType } from '@/data/hero-defaults';
import { optimizeCloudinaryUrl } from '@/lib/utilities/cloudinary';

interface HeroVideoBackgroundProps {
  slides?: HeroSlide[];
  currentSlide?: number;
  transitionType?: HeroTransitionType;
  src?: string;
  mobileSrc?: string;
  poster?: string;
  mobilePoster?: string;
}

const DEFAULT_DESKTOP_MEDIA = 'https://res.cloudinary.com/wmwdypan/image/upload/f_auto,q_auto/v1789666008/vishnav_devi.png';

function getTransitionStyles(
  transitionType: HeroTransitionType = 'fade',
  isActive: boolean,
  idx: number,
  currentSlide: number
): { container: string; img: string } {
  switch (transitionType) {
    case 'ken-burns':
      return {
        container: `transition-opacity duration-1000 ease-in-out ${
          isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
        }`,
        img: `transition-transform duration-[6500ms] ease-out ${
          isActive ? 'scale-108' : 'scale-100'
        }`,
      };
    case 'slide':
      return {
        container: `transition-transform duration-700 ease-in-out ${
          isActive
            ? 'translate-x-0 z-10'
            : idx < currentSlide
            ? '-translate-x-full z-0 pointer-events-none'
            : 'translate-x-full z-0 pointer-events-none'
        }`,
        img: 'scale-[1.02]',
      };
    case 'blur-fade':
      return {
        container: `transition-all duration-1000 ease-in-out ${
          isActive
            ? 'opacity-100 blur-0 z-10'
            : 'opacity-0 blur-md z-0 pointer-events-none'
        }`,
        img: 'scale-[1.02]',
      };
    case 'fade':
    default:
      return {
        container: `transition-opacity duration-1000 ease-in-out ${
          isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
        }`,
        img: 'scale-[1.02]',
      };
  }
}

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({ 
  slides,
  currentSlide = 0,
  transitionType = 'fade',
  src, 
  mobileSrc,
  poster,
  mobilePoster
}) => {
  // If slides array is provided, render all slides in a stacked track for silky-smooth transition
  if (slides && slides.length > 0) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-midnight">
        {slides.map((s, idx) => {
          const isActive = idx === currentSlide;
          const rawMediaUrl = (s.videoSrc && s.videoSrc.trim().length > 0)
            ? s.videoSrc.trim()
            : (s.poster && s.poster.trim().length > 0)
            ? s.poster.trim()
            : DEFAULT_DESKTOP_MEDIA;

          // Desktop Media URL
          const mediaUrl = optimizeCloudinaryUrl(rawMediaUrl);
          const isImage = mediaUrl.match(/\.(jpeg|jpg|png|webp|avif)$/i) || mediaUrl.includes('/image/upload/');

          // Mobile Media URL (falls back to desktop if not explicitly set)
          const rawMobileUrl = (s.mobilePoster && s.mobilePoster.trim().length > 0)
            ? s.mobilePoster.trim()
            : (s.mobileVideoSrc && s.mobileVideoSrc.trim().length > 0)
            ? s.mobileVideoSrc.trim()
            : (mobilePoster && mobilePoster.trim().length > 0)
            ? mobilePoster.trim()
            : (mobileSrc && mobileSrc.trim().length > 0)
            ? mobileSrc.trim()
            : rawMediaUrl;
          const mobileMediaUrl = optimizeCloudinaryUrl(rawMobileUrl);
          const isMobileImage = mobileMediaUrl.match(/\.(jpeg|jpg|png|webp|avif)$/i) || mobileMediaUrl.includes('/image/upload/');

          const { container, img } = getTransitionStyles(transitionType, isActive, idx, currentSlide);

          return (
            <div
              key={s.id || idx}
              className={`absolute inset-0 w-full h-full overflow-hidden ${container}`}
            >
              {idx === 0 && (isImage || isMobileImage) ? (
                /* Slide 0 LCP: Native responsive picture element to download ONLY the appropriate viewport asset */
                <picture className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Desktop Source: screens >= 768px */}
                  <source
                    media="(min-width: 768px)"
                    srcSet={`/_next/image?url=${encodeURIComponent(mediaUrl)}&w=750&q=75 750w, /_next/image?url=${encodeURIComponent(mediaUrl)}&w=828&q=75 828w, /_next/image?url=${encodeURIComponent(mediaUrl)}&w=1080&q=75 1080w, /_next/image?url=${encodeURIComponent(mediaUrl)}&w=1200&q=75 1200w, /_next/image?url=${encodeURIComponent(mediaUrl)}&w=1920&q=75 1920w, /_next/image?url=${encodeURIComponent(mediaUrl)}&w=2048&q=75 2048w, /_next/image?url=${encodeURIComponent(mediaUrl)}&w=3840&q=75 3840w`}
                    sizes="100vw"
                  />
                  {/* Mobile Fallback Image: screens < 768px with fetchPriority high */}
                  <img
                    src={`/_next/image?url=${encodeURIComponent(mobileMediaUrl)}&w=1080&q=75`}
                    srcSet={`/_next/image?url=${encodeURIComponent(mobileMediaUrl)}&w=640&q=75 640w, /_next/image?url=${encodeURIComponent(mobileMediaUrl)}&w=750&q=75 750w, /_next/image?url=${encodeURIComponent(mobileMediaUrl)}&w=828&q=75 828w, /_next/image?url=${encodeURIComponent(mobileMediaUrl)}&w=1080&q=75 1080w, /_next/image?url=${encodeURIComponent(mobileMediaUrl)}&w=1200&q=75 1200w`}
                    sizes="100vw"
                    alt={s.title || 'Hero Background'}
                    fetchPriority="high"
                    decoding="async"
                    className={`absolute inset-0 w-full h-full object-cover object-center ${img}`}
                  />
                </picture>
              ) : (
                /* Inactive slides (idx > 0) retain existing lazy loading */
                <>
                  {/* Mobile View */}
                  <div className="block md:hidden absolute inset-0 w-full h-full pointer-events-none">
                    {isMobileImage ? (
                      <Image
                        src={mobileMediaUrl}
                        alt={s.title || 'Hero Mobile Background'}
                        fill
                        loading="lazy"
                        sizes="100vw"
                        className={`object-cover object-center ${img}`}
                      />
                    ) : (
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload={isActive ? 'auto' : 'none'}
                        poster={mobileMediaUrl}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      >
                        <source src={mobileMediaUrl} type="video/mp4" />
                      </video>
                    )}
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
                    {isImage ? (
                      <Image
                        src={mediaUrl}
                        alt={s.title || 'Hero Desktop Background'}
                        fill
                        loading="lazy"
                        sizes="100vw"
                        className={`object-cover object-center ${img}`}
                      />
                    ) : (
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload={isActive ? 'auto' : 'none'}
                        poster={mediaUrl}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                      >
                        <source src={mediaUrl} type="video/mp4" />
                      </video>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Subtle uniform tint */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />
        {/* Subtle bottom gradient to blend with Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-midnight/60 to-transparent pointer-events-none z-10" />
      </div>
    );
  }

  // Fallback single media view
  const candidateDesktop = (src && src.trim().length > 0)
    ? src.trim()
    : (poster && poster.trim().length > 0)
    ? poster.trim()
    : DEFAULT_DESKTOP_MEDIA;
  const optimizedCandidate = optimizeCloudinaryUrl(candidateDesktop);
  const isDesktopImage = optimizedCandidate.match(/\.(jpeg|jpg|png|webp|avif)$/i) || optimizedCandidate.includes('/image/upload/');

  const candidateMobile = (mobileSrc && mobileSrc.trim().length > 0)
    ? mobileSrc.trim()
    : (mobilePoster && mobilePoster.trim().length > 0)
    ? mobilePoster.trim()
    : candidateDesktop;
  const optimizedMobile = optimizeCloudinaryUrl(candidateMobile);
  const isMobileImage = optimizedMobile.match(/\.(jpeg|jpg|png|webp|avif)$/i) || optimizedMobile.includes('/image/upload/');

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-midnight">
      {/* Mobile View */}
      <div className="block md:hidden absolute inset-0 w-full h-full pointer-events-none">
        {isMobileImage ? (
          <Image
            src={optimizedMobile}
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
            poster={optimizedMobile}
            className="absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src={optimizedMobile} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
        {isDesktopImage ? (
          <Image
            src={optimizedCandidate}
            alt="Hero Desktop Background"
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
            poster={optimizedCandidate}
            className="absolute inset-0 w-full h-full object-cover object-top"
          >
            <source src={optimizedCandidate} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-midnight/60 to-transparent pointer-events-none z-10" />
    </div>
  );
};


