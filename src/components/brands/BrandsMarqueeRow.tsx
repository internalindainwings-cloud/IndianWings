import type { Brand } from '@/data/brands';
import BrandLogoCard from './BrandLogoCard';

interface BrandsMarqueeRowProps {
  brands: Brand[];
  direction: 'ltr' | 'rtl';
  rowAriaLabel: string;
}

export default function BrandsMarqueeRow({
  brands,
  direction,
  rowAriaLabel,
}: BrandsMarqueeRowProps) {
  // Duplicate the array 6× so the track always overflows the viewport
  // (with only 3 cards, 2× isn't enough to fill a wide screen)
  const track = [...brands, ...brands, ...brands, ...brands, ...brands, ...brands];

  const animationClass =
    direction === 'ltr' ? 'animate-marquee-ltr' : 'animate-marquee-rtl';

  return (
    <div
      className="relative w-full overflow-hidden"
      aria-label={rowAriaLabel}
      // Gradient mask: fade out edges for cinematic feel
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      {/* Inner scrolling track — hover pauses animation */}
      <div
        className={`flex gap-3 sm:gap-4 w-max ${animationClass} hover:[animation-play-state:paused]`}
        aria-hidden="true"
      >
        {track.map((brand, idx) => (
          <BrandLogoCard
            // Use index suffix to ensure unique keys across duplicated items
            key={`${brand.id}-${idx}`}
            brand={brand}
          />
        ))}
      </div>
    </div>
  );
}
