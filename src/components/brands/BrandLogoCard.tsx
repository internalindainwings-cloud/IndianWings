import Image from 'next/image';
import type { PartnerBrand } from '@prisma/client';

interface BrandLogoCardProps {
  brand: PartnerBrand;
}

export default function BrandLogoCard({ brand }: BrandLogoCardProps) {
  return (
    <div
      className="
        flex-shrink-0
        flex flex-col items-center justify-center gap-2
        px-6 py-3.5
        rounded-xl
        bg-white/80 hover:bg-white
        border border-black/[0.08]
        shadow-sm hover:shadow-md
        transition-all duration-300
        min-w-[140px] sm:min-w-[160px]
        cursor-default
        select-none
      "
      aria-label={brand.altText}
    >
      {/* Logo or Text Badge */}
      {brand.logoUrl ? (
        <div className="relative h-8 sm:h-10 w-24 sm:w-28 flex items-center justify-center">
          <Image
            src={brand.logoUrl}
            alt={brand.altText}
            fill
            className="object-contain"
            sizes="112px"
          />
        </div>
      ) : (
        /* Text-badge fallback for partners without an accessible public logo */
        <span
          className="
            font-playfair font-semibold
            text-sm sm:text-[15px]
            text-midnight
            text-center leading-tight
            whitespace-nowrap
          "
        >
          {brand.name}
        </span>
      )}

      {/* Type Label */}
      <span
        className="
          font-sans font-bold
          text-[9px] sm:text-[10px]
          tracking-[0.2em]
          uppercase
          text-saffron
        "
      >
        {brand.typeLabel}
      </span>
    </div>
  );
}
