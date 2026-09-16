# Phase 08 — Brands Section (Trusted Partners & Hotel Collaborators)

## Goal
Build a premium, auto-scrolling **infinite marquee / logo ticker** section that showcases two categories of collaborators:

1. **Travel & Media Partners** — OTAs, review platforms, media features (e.g. TripAdvisor, MakeMyTrip, Travel+Leisure India).
2. **Hotel & Stay Partners** — Boutique hotels, houseboats, and resorts that The Indian Wings Company books for its guests.

The section acts as a final **credibility closer** on the homepage, placed immediately before the Footer.

---

## Design Spec

### Layout
- **Background**: Midnight Navy (`#0B1F2A`) — dark, premium contrast.
- **Section padding**: `py-14 sm:py-18 lg:py-20`.
- **Max-width container**: `max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12` for the header block only; the marquee tracks run **full-width** (edge-to-edge) for a cinematic feel.

### Header Block (centered)
- Eyebrow tag: `TRUSTED PARTNERS` — saffron (`#F97316`), Manrope Bold, uppercase, tracking-widest, flanked by saffron horizontal rules (same pattern as PackagesSection).
- `<h2>` heading: **"Our Trusted Partners"** — Playfair Display, `text-3xl sm:text-4xl lg:text-5xl`, `text-warm-white`.
- Subtitle: `font-manrope text-sm sm:text-base text-warm-white/60` — *"Curated stays, trusted platforms, and media partners who share our commitment to premium Kashmir travel."*

### Marquee Track — Two Rows

| Row | Content | Direction | Speed |
|-----|---------|-----------|-------|
| Row 1 | Travel & Media Partners | Left → Right (LTR) | `30s` |
| Row 2 | Hotel & Stay Partners | Right → Left (RTL) | `38s` |

Each row contains the logo items duplicated (×2) to produce a seamless infinite CSS loop.

### Gradient Fade Edges
Applied via CSS mask on each row wrapper:
```css
mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
-webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
```

### Logo Pill Style
Each logo is displayed inside a **frosted pill card**:
- Background: `bg-white/8 hover:bg-white/14`
- Border: `border border-white/10`
- Rounded: `rounded-xl`
- Padding: `px-6 py-3`
- `transition-colors duration-300`
- Logo image: `h-8 sm:h-10` with `object-contain`, rendered with `next/image` (explicit width/height for LCP optimization).
- Below the logo: tiny label `text-[10px] text-warm-white/40 font-manrope tracking-widest uppercase` (e.g. "MEDIA PARTNER" or "STAY PARTNER") — adds premium editorial feel.

### Animation (Pure CSS — no Framer Motion)
```css
@keyframes marquee-ltr {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes marquee-rtl {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}
```

Hover pause: `hover:[animation-play-state:paused]` on the inner track `<div>`.

`prefers-reduced-motion: reduce` → animation is disabled.

---

## Component Architecture

### Files to Create

```
src/
  components/
    brands/
      BrandsSection.tsx       ← Server Component — top-level section
      BrandsMarqueeRow.tsx    ← Server Component — one scrolling row
      BrandLogoCard.tsx       ← Server Component — individual pill card
  data/
    brands.ts                 ← Static data arrays
```

### BrandsSection.tsx
- Top-level `<section>` with Midnight Navy background.
- Renders centered header block.
- Renders `<BrandsMarqueeRow>` twice:
  - `direction="ltr"` with `travelMediaPartners` data.
  - `direction="rtl"` with `hotelStayPartners` data.

### BrandsMarqueeRow.tsx
Props: `brands: Brand[]`, `direction: 'ltr' | 'rtl'`, `rowLabel: string`

- Duplicates the array (`[...brands, ...brands]`) for seamless loop.
- Wraps in a div with gradient mask.
- Inner track div gets `animate-marquee-ltr` or `animate-marquee-rtl` class + `hover:[animation-play-state:paused]`.

### BrandLogoCard.tsx
Props: `brand: Brand`

- Renders frosted pill card with logo image and type label.
- For text-badge partners (no accessible logo): renders brand name in Playfair Display inside the pill.

### brands.ts
```ts
export type Brand = {
  id: string;
  name: string;
  logoSrc?: string;         // undefined → text badge fallback
  altText: string;
  type: 'media' | 'hotel';
  typeLabel: string;        // e.g. 'MEDIA PARTNER' | 'STAY PARTNER'
};

export const travelMediaPartners: Brand[] = [...];
export const hotelStayPartners: Brand[] = [...];
```

---

## Data Plan (Initial Seed)

### Travel & Media Partners (Row 1 — LTR)
| Name | Logo | Label |
|------|------|-------|
| TripAdvisor | SVG | REVIEW PLATFORM |
| MakeMyTrip | SVG | BOOKING PARTNER |
| Holidify | PNG | TRAVEL GUIDE |
| Thrillophilia | PNG | ADVENTURE PARTNER |
| Travel+Leisure India | Text badge | MEDIA |
| Outlook Traveller | Text badge | MEDIA |
| J&K Tourism | Official | GOVERNMENT PARTNER |

### Hotel & Stay Partners (Row 2 — RTL)
| Name | Label |
|------|-------|
| The Lalit Grand Palace, Srinagar | LUXURY HOTEL |
| Heritage Houseboat Srinagar | STAY PARTNER |
| Hotel Pahalgam | STAY PARTNER |
| Gulmarg Ski Resort | RESORT PARTNER |
| The Khyber Himalayan Resort | LUXURY RESORT |
| WelcomHotel Dal View | HOTEL PARTNER |
| Country Inn & Suites Srinagar | HOTEL PARTNER |

> **Note**: For any partner without an accessible public logo, we render a text-badge pill (brand name in Playfair Display, properly sized). This maintains a premium look without broken images and is consistent with editorial travel design.

---

## CSS & Tailwind Changes

### `src/app/globals.css` — add keyframes:
```css
@keyframes marquee-ltr {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes marquee-rtl {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee-ltr,
  .animate-marquee-rtl {
    animation: none;
  }
}
```

### `tailwind.config.ts` — extend animations:
```ts
animation: {
  'marquee-ltr': 'marquee-ltr 30s linear infinite',
  'marquee-rtl': 'marquee-rtl 38s linear infinite',
}
```

---

## Homepage Integration

In `src/app/page.tsx`, add **after** `<DestinationsSection />`:

```tsx
import { BrandsSection } from "@/components/brands/BrandsSection";

// Inside <main>:
<DestinationsSection />
<BrandsSection />
{/* Footer renders from layout.tsx or placed here */}
```

---

## Accessibility & SEO

- `<section aria-label="Our Trusted Partners">` for screen readers.
- Each logo has a descriptive `alt` attribute.
- `<h2>` provides proper heading hierarchy.
- Marquee inner tracks: `aria-hidden="true"` (decorative animation).
- Consider a visually-hidden `<ul>` listing all partner names for full SR accessibility (optional enhancement).

---

## Verification Checklist
- [ ] Row 1 scrolls **left → right** seamlessly with no jump at the 50% mark.
- [ ] Row 2 scrolls **right → left** seamlessly with no jump.
- [ ] Gradient fade edges are visible on both rows (transparent → opaque → transparent).
- [ ] Hovering over a marquee row **pauses** the animation.
- [ ] Background transitions cleanly from the section above it (light Warm Sand → dark Midnight Navy).
- [ ] Logo pills render correctly on mobile (360px), tablet (768px), desktop (1280px).
- [ ] Text-badge fallback renders correctly for partners without logos.
- [ ] No CLS from logo images (width/height explicit on `next/image`).
- [ ] `prefers-reduced-motion` disables animation.
- [ ] Screen reader can identify the section via `aria-label`.
