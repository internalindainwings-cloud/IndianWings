import { getActiveBrands } from '@/lib/brands-service';
import BrandsMarqueeRow from './BrandsMarqueeRow';

export async function BrandsSection() {
  const partners = await getActiveBrands();

  if (!partners || partners.length === 0) return null;
  return (
    <section
      id="brands"
      aria-label="Trusted Partners"
      className="w-full bg-white py-6 sm:py-8 overflow-hidden border-t border-black/6"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 mb-3">
        <p className="text-center font-manrope font-bold text-[11px] sm:text-xs text-[#64748B] uppercase tracking-[0.2em]">
          Trusted Travel &amp; Hospitality Partners
        </p>
      </div>

      {/* Single Sleek Marquee Row */}
      <BrandsMarqueeRow
        brands={partners}
        direction="ltr"
        rowAriaLabel="Trusted travel partners"
      />
    </section>
  );
}

export default BrandsSection;
