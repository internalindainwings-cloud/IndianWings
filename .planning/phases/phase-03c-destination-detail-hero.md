# Phase 03C: Destination Detail Page — Hero Section

## 1. Objective
Implement **ONLY** the Hero section of the dynamic Destination Detail Page (`/destinations/[slug]`).
When a user clicks any destination card from the Destinations listing, they are routed to that destination's detail page. The detail page displays the existing global Navbar followed immediately by a cinematic, brand-aligned Destination Hero featuring dynamic breadcrumbs, Playfair Display heading (`<h1>`), short destination description, large hero photography, and a compact interactive multi-image slideshow gallery.

Per protocol, **NO** sections below the Hero will be developed in this phase.

---

## 2. Destination Detail Route Structure
- **Dynamic Route**: `src/app/destinations/[slug]/page.tsx`
- **Supported Slugs**:
  - `/destinations/srinagar`
  - `/destinations/gulmarg`
  - `/destinations/pahalgam`
  - `/destinations/sonmarg`
  - `/destinations/doodhpathri`
  - `/destinations/gurez`
  - `/destinations/yusmarg`
  - `/destinations/sinthan-top`
  - `/destinations/bangus`
- **Fallback / 404**: If an invalid slug is requested, invoke Next.js `notFound()`.
- **Linking**: Destination cards in `DestinationCard.tsx` and the compact mobile grid link directly to `/destinations/[slug]`.

---

## 3. Hero Requirements
1. **Existing Global Navbar**: Reused seamlessly without modification or duplicate creation.
2. **Dynamic Breadcrumb**: Accessible navigation trail (`Destinations → Jammu & Kashmir → {Destination Name}`).
3. **Destination Name**: Single `<h1>` in `Playfair Display`, bold, high-contrast, perfectly legible.
4. **Destination Description**: Short, editorial introduction rendered in `Manrope` from approved destination data.
5. **Hero Image**: Large responsive image using `next/image` with natural photography and restrained dark overlay.
6. **Compact Gallery Overlay**: Integrated directly into the Hero composition without becoming an oversized section.
7. **Slideshow Controls**:
   - Automatic cycling with smooth, non-aggressive transitions.
   - Manual next button (`ChevronRight`) using Warm Yellow (`#E6B84A`) accents.
   - Clickable preview thumbnails with active border states.
   - Intelligent pause/reset timer upon manual interaction.

---

## 4. Component Architecture
```
src/
├── app/
│   └── destinations/
│       └── [slug]/
│           └── page.tsx                     # Dynamic Server Component with generateMetadata
├── components/
│   └── destinations/
│       ├── DestinationDetailHero.tsx        # Hero container (client component for slideshow state)
│       ├── DestinationBreadcrumb.tsx        # Accessible breadcrumb trail
│       ├── DestinationHeroGallery.tsx       # Compact multi-image gallery with auto & manual controls
│       ├── DestinationCard.tsx              # Updated to link to /destinations/[slug]
│       └── DestinationsSection.tsx          # Updated card & grid links to dynamic routes
└── data/
    └── destinations.ts                      # Extended schema with slug, region, and gallery images
```

---

## 5. Destination Data Structure
Extend `DestinationItem` in `src/data/destinations.ts` to include:
```typescript
export interface DestinationItem {
  id: string;
  slug: string;                            // e.g. 'gulmarg'
  name: string;                            // e.g. 'Gulmarg'
  region: string;                          // e.g. 'Jammu & Kashmir'
  tagline: string;
  category: 'Iconic' | 'Alpine' | 'Off-Beat';
  imageUrl: string;                        // Primary hero poster
  gallery: string[];                       // Array of local project image assets
  elevation: string;
  bestSeason: string;
  distanceFromSrinagar: string;
  highlights: string[];
  description: string;
  packageCount: number;
}
```
*Assets*: Uses genuine local project assets from `/images/gallery/` and `/images/reviews/` without external stock placeholders.

---

## 6. Global Design System (LOCKED)
- **Typography**:
  - Headings: `Playfair Display` (`font-playfair`)
  - Body / UI: `Manrope` (`font-manrope`)
- **Color Palette**:
  - Midnight Navy: `#0B1F2A`
  - Warm Yellow: `#E6B84A` (Active brand accent — strictly NO deprecated `#D4A24C`)
  - Warm Sand: `#F4EFE6`
  - Warm White: `#F8F6F0`
  - Slate Blue: `#64748B`
  - Charcoal: `#222222`
- **Overlay & Visuals**:
  - Subtle gradient overlay from `#0B1F2A`/85 to transparent to ensure text readability while preserving natural scenery.
  - Zero synthetic neon filters or heavy unnatural color grading.

---

## 7. Responsive & Mobile-First Behavior
- **Mobile (320px – 430px)**:
  - Mobile is the primary source of truth.
  - Natural content-driven height (Strictly **NO** `min-h-screen` or `h-[100dvh]` lockouts).
  - Breadcrumb → Destination Title (`h1`) → Concise description → Cinematic Image with compact gallery controls.
  - Touch-target sizes minimum 44px for arrows and thumbnails.
  - Zero horizontal overflow.
- **Tablet (768px – 1024px)**:
  - Balanced editorial split or layered cinematic layout.
  - Fluid text sizing and thumb previews.
- **Desktop (1280px – 1920px)**:
  - Expansive, luxury cinematic hero with overlay gallery docked neatly in the composition.
  - High-res image display with Next.js responsive `sizes`.

---

## 8. Gallery Behavior & State Management
- **Autoplay Interval**: 5 seconds per slide.
- **Pause on Interaction**: Automatically clears and resets the timer whenever the user clicks next, prev, or a thumbnail.
- **Manual Navigation**:
  - Next chevron button with visible focus ring.
  - Thumbnail track with active indicator in Saffron Orange (`#F97316`).
  - Full keyboard accessibility (`ArrowRight`, `ArrowLeft`).
- **Smooth Transition**: Fading / subtle crossfade without layout shift or page jerk.

---

## 9. Accessibility (a11y)
- Landmark: Single `<main>` wrapper with `<header>` preserved in layout.
- Headings: Single `<h1>` for the destination name.
- Breadcrumb: `<nav aria-label="Breadcrumb">` with `<ol>` and `aria-current="page"`.
- Buttons: Explicit `aria-label` attributes (`"Next destination photo"`, `"Show Gulmarg image 2"`).
- Decorative icons: `aria-hidden="true"`.
- Keyboard support: Enter/Space activation and arrow keys for gallery navigation.

---

## 10. Performance & SEO
- **Next.js Image**: Priority loading for the active Hero image with properly configured `sizes`.
- **Dynamic Metadata**: Server-side `generateMetadata` delivering destination-specific `<title>` and `<meta name="description">`.
- **Canonical Slug**: Direct mapping from slug to metadata and breadcrumb.
- **Bundle Weight**: Zero new npm packages. Built purely with existing React 19, Next.js 16, and Tailwind CSS.

---

## 11. Files Affected
- `docs/phases/phase-03c-destination-detail-hero.md` (THIS SPECIFICATION)
- `src/data/destinations.ts` (Data extension with slug, region, gallery arrays, helper functions)
- `src/components/destinations/DestinationBreadcrumb.tsx` (New component)
- `src/components/destinations/DestinationHeroGallery.tsx` (New component)
- `src/components/destinations/DestinationDetailHero.tsx` (New component)
- `src/app/destinations/[slug]/page.tsx` (New dynamic route)
- `src/components/destinations/DestinationCard.tsx` (Update button/card link to dynamic route)
- `src/components/destinations/DestinationsSection.tsx` (Update mobile grid link to dynamic route)

---

## 12. Explicit Exclusions
Per protocol, the following are strictly out of scope:
- Destination overview section below hero
- Attractions / Things to do section
- Activities & adventure sections
- Best time to visit section
- How to reach section
- Destination packages section
- FAQs & reviews sections
- Related destinations carousel
- Lead / enquiry form section below hero
- Footer redesign

---

## 13. Acceptance Criteria & Checklist
- [ ] Documentation created prior to code changes.
- [ ] Dynamic route `/destinations/[slug]` functional for all 9 destinations.
- [ ] Existing global Navbar appears at top without duplication or redesign.
- [ ] Destination Hero is the sole content on the page (STOP after Hero).
- [ ] Dynamic breadcrumb rendered with correct navigation semantics.
- [ ] Single `<h1>` with Playfair Display.
- [ ] Dynamic description in Manrope.
- [ ] Large Next.js hero image using approved local assets.
- [ ] Compact multi-image gallery with auto-slideshow.
- [ ] Manual Next navigation with ChevronRight and thumbnail selection.
- [ ] Slideshow pauses/resets upon user click.
- [ ] Warm Yellow `#E6B84A` active states applied (no deprecated Saffron Gold `#D4A24C`).
- [ ] Mobile-first verified (320px–430px) with no horizontal scroll or viewport-height hacks.
- [ ] Tablet (768px–1024px) and Desktop (1280px–1920px) verified.
- [ ] Global floating actions intact.
- [ ] Zero new dependencies.
- [ ] `npx tsc --noEmit` passes with 0 errors.
- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` succeeds.
