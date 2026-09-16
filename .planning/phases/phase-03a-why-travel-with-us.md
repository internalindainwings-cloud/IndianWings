# Phase 3A: Why Travel With Us Section

## 1. Phase Objective
Implement the "Why Travel With Us" section immediately following the Lead / Get Your Free Quote Form on the homepage, strictly following the reference website flow (https://tourpackageskashmir.com/) for WHAT content/sections are required, and the Indian Wings design system for HOW it looks.

## 2. Position in Homepage Flow
The homepage section hierarchy:
1. Navbar (LOCKED)
2. Hero Section (LOCKED)
3. Lead / Get Your Free Quote Form (Position reserved directly before this section)
4. **Why Travel With Us** (THIS PHASE)
5. Next reference-website section (Destinations, etc. — Out of Scope for Phase 3A)

*Note: Destinations, Packages, Client Stories, or any other section must NOT be inserted between the Lead Form and Why Travel With Us. Client Stories will not be rendered inside this section.*

## 3. Content Requirements
Strict adherence to approved copy:
- **Eyebrow**: `WHY TRAVEL WITH US`
- **Heading**: `Travel Kashmir With Confidence`
- **Description**: `At The Indian Wings Company, we go beyond ordinary travel. With deep local knowledge, personalized planning, and a passion for authentic experiences, we ensure your journey through Kashmir is safe, seamless and truly unforgettable.`
- **Four Trust Features**:
  1. `Local Kashmir Experts`
  2. `Personalized Travel Planning`
  3. `Safe & Hassle-Free Travel`
  4. `Curated & Authentic Experiences`
- **Editorial Closing Line**: `More than a trip, a meaningful journey.`
- **Right-Side Editorial Content**:
  - Quote / Headline: `Real People. Real Journeys. Real Kashmir.`
  - Thin Saffron Divider
  - Navy Editorial Treatment:
    - `Kashmir`
    - `A FEELING BEYOND PLACES`

## 4. Design System & Style Tokens (LOCKED)
Reuse existing global tokens without introducing new fonts or outside palettes:
- **Typography**:
  - Headings: `Playfair Display`
  - Body & UI: `Manrope`
- **Palette**:
  - Midnight Navy: `#0B1F2A` (Primary dark surface)
  - Warm Sand: `#F4EFE6` (Section background)
  - Warm White: `#F8F6F0` (Card/Pill surfaces)
  - Saffron Gold: `#D4A24C` / `#DA9116` (5% Accent color)
  - Slate Blue: `#64748B` (Secondary text)
  - Charcoal: `#222222` (High-contrast neutral)
- **Design Philosophy**:
  - 80% navy/neutral surfaces, 15% sand/white, 5% saffron accent.
  - **Explicitly Forbidden**: No faded saffron overlays, no faded mountain image/background at the bottom, no synthetic gradients over photography. Natural photography remains natural.

## 5. Visual Structure & Height Rules
- **Content-Driven Layout**:
  - **NO** `min-h-screen`, `h-screen`, `h-[100vh]`, or `h-[100dvh]`.
  - Section height must be dictated purely by its content with natural, compact padding.
  - No giant blank gaps after the Lead Form.
- **Desktop (Two-Column Editorial Composition)**:
  - **Left Column**:
    - Eyebrow with saffron accents
    - Large Playfair Display heading (`Travel Kashmir With Confidence`)
    - Supporting description in Manrope
    - 4 compact trust features in a 2x2 grid or clean vertical hierarchy with refined Lucide line icons
    - Editorial closing italic line
  - **Right Column**:
    - Tall portrait Kashmir traveller image (`/images/Reviewimage.png`)
    - Editorial card/quote framing: `Real People. Real Journeys. Real Kashmir.`
    - Saffron accent divider
    - Navy editorial badge/block: `Kashmir` (Playfair Display) + `A FEELING BEYOND PLACES` (Manrope uppercase tracking)
- **Image Asset**:
  - Approved project asset: `/images/Reviewimage.png` (2.2 MB natural Kashmir portrait).
  - No random Unsplash placeholders, no broken paths, no plain navy rectangle fallback.

## 6. Mobile-First Responsive Behavior
Mobile is the primary design source of truth.
- **Mobile Viewports (320px – 430px)**:
  - Single-column layout.
  - Natural visual stacking: Eyebrow → Heading → Description → 4 Trust Features → Editorial Line → Portrait Image with "A FEELING BEYOND PLACES" badge.
  - Padding inline: `px-5` to `px-6` (20px–24px).
  - No horizontal scrolling or edge collisions at 320px, 360px, 375px, 390px, 414px, 430px.
  - Image scales responsively without dominating or pushing the section into an infinite scroll.
- **Progressive Enhancement (Tablet & Desktop)**:
  - Tablet (768px – 1024px): Balanced spacing, scaled typography, two columns where space permits.
  - Desktop (1280px – 1920px): Max container width `1280px`, spacious editorial rhythm with aligned tops.

## 7. Component Architecture
Modular, clean structure under `src/components/trust/`:
```
src/components/trust/
├── WhyTravelWithUsSection.tsx      (Main section container, manages section spacing & layout)
├── TrustFeatureGrid.tsx            (Maps the 4 trust features cleanly)
└── TrustEditorialCard.tsx          (Right-side portrait image + navy editorial treatment)
```
- Decouple static text into `src/data/trust-features.ts` for clean maintainability.

## 8. Accessibility & SEO
- Semantic HTML: `<section>`, `<header>`, `<h2>` for section title, `<h3>` for trust features.
- Zero extra `<h1>` elements (Hero retains the single H1).
- Meaningful image `alt` attributes (`alt="Traveller looking at Kashmir mountain landscape"`).
- WCAG AA contrast compliance for text against Warm Sand (`#F4EFE6`) and Midnight Navy (`#0B1F2A`).
- Icons accompanied by `aria-hidden="true"`.

## 9. Performance
- Server Component by default where no local state is required.
- Next.js `<Image>` optimization with responsive `sizes` prop and `priority` if in near-fold view.
- Zero external client-heavy scripts or new npm dependencies.

## 10. Files Expected to Change
- `docs/phases/phase-03a-why-travel-with-us.md`: Phase specification and completion log.
- `src/components/trust/WhyTravelWithUsSection.tsx`: Update section composition to isolate Why Travel With Us without bottom mountain footers or Client Stories.
- `src/components/trust/TrustIntro.tsx` / `TrustEditorialCard.tsx`: Ensure right image and editorial badge strictly match approved requirements.
- `src/data/trust-features.ts`: Standardize 4 trust pillars.

## 11. Explicit Exclusions
- Do NOT modify the locked Hero or Navbar components.
- Do NOT modify the Lead Form.
- Do NOT insert Client Stories or Reviews in this component (reserved for dedicated section per reference flow).
- Do NOT add faded mountain background images at the bottom.
- Do NOT add new dependencies (`npm install` is strictly prohibited).

## 12. Acceptance Criteria & Checklist
- [ ] Phase documentation created and reviewed BEFORE development.
- [ ] Section position established immediately after Lead Form.
- [ ] No Client Stories or unrelated sections inside Why Travel With Us.
- [ ] Existing approved `/images/Reviewimage.png` is used and renders cleanly.
- [ ] Main heading uses Playfair Display ("Travel Kashmir With Confidence").
- [ ] Body/UI uses Manrope.
- [ ] 4 trust features present with icons and clear hierarchy.
- [ ] Editorial lines present ("More than a trip, a meaningful journey." and "Real People. Real Journeys. Real Kashmir." + "Kashmir — A FEELING BEYOND PLACES").
- [ ] Content-driven height (NO `min-h-screen` or `h-screen`).
- [ ] 320px–430px mobile viewports render flawlessly with zero horizontal scroll.
- [ ] Tablet and desktop progressively enhanced.
- [ ] Zero TypeScript errors (`npx tsc --noEmit`).
- [ ] Zero ESLint errors (`npm run lint`).
- [ ] Production build passes (`npm run build`).


## 13. Global Floating Contact & Social Actions (Implemented)
- **Component**: `src/components/common/FloatingContactActions.tsx` mounted globally in `src/app/layout.tsx`.
- **Actions in strict order**:
  1. **Instagram**: Links to official Instagram profile (`siteConfig.contact.instagramUrl`) with camera SVG.
  2. **Phone**: Direct `tel:` link (`tel:${siteConfig.contact.phone}`) with Lucide `Phone` icon and Saffron Gold styling.
  3. **WhatsApp**: Direct chat link (`siteConfig.contact.whatsappUrl`) with official WhatsApp SVG.
- **Positioning**: Fixed to bottom-right viewport (`fixed right-3.5 sm:right-6 bottom-6 sm:bottom-8 z-40`).
- **Styling**: Indian Wings brand palette (`#0B1F2A`, `#D4A24C`, `#F8F6F0`), circular touch-friendly buttons (`44px+`), centered icons, accessible labels.
- **Status**: Tested and verified across all viewports (320px–1920px).

---
STATUS: DOCUMENTED — AWAITING REVIEW & LOCK
