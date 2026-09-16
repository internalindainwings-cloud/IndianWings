# Phase 2B: Hero Mobile-First Content Integration

## 1. Objective & Principle
The client is primarily viewing the website on **MOBILE**.
Therefore, this Hero content integration MUST be designed and implemented **MOBILE-FIRST**.
Desktop and tablet must progressively enhance from the mobile layout.

- **Primary Source of Truth**: Mobile viewport experience (320px – 430px).
- **Progressive Enhancement**: Tablet (768px – 1024px) & Desktop (1280px – 1920px).

## 2. Locked Elements (Strictly Preserved)
- **Navbar**: LOCKED.
- **Hero visual architecture**: LOCKED (100dvh cinematic container, background video/image strategy, dark overlays).
- **Global Fonts**: LOCKED (Playfair Display for headings, Manrope for body/UI). No external fonts (Inter, etc.) to be introduced.
- **Brand Colors**: LOCKED (Midnight Navy `#0B1F2A`, Saffron Gold `#D4A24C` / `#DA9116`, Warm White `#F8F6F0`).

## 3. Reference Content & Hierarchy (Mobile-First)
Strict order on mobile:
1. **Main Heading**:
   `"Discover the Magic of Kashmir"`
2. **Supporting Description**:
   `"Handcrafted Kashmir holidays with comfortable stays, private transport and unforgettable local experiences."`
3. **Destination Line**:
   `"SRINAGAR • GULMARG • PAHALGAM • SONAMARG • DOODHPATHRI"`
4. **Primary CTA**:
   `"GET FREE QUOTE"` (Saffron Gold background, Midnight Navy text)
5. **Secondary CTA**:
   `"EXPLORE PACKAGES"` (Transparent background, Warm White border & text)
6. **Trust / Features (4 items in compact 2x2 grid on mobile)**:
   - Customised Trips
   - Private Cabs
   - Handpicked Stays
   - Local Support
7. **Supporting Price Information**:
   `"From ₹8,700 per person • on 4 sharing • T&C apply"`

## 4. Typography Specifications
- **Heading**:
  - Font: `Playfair Display`
  - Mobile size: `clamp(34px, 9vw, 50px)`, `leading-[1.05]` to `leading-[1.1]`
  - Layout: 2–3 balanced lines on mobile without awkward word breaks.
- **Description**:
  - Font: `Manrope`
  - Mobile size: 15–16px (`text-[14px] sm:text-[15px] md:text-base`)
  - Max readable width: ~340px on mobile, expanding naturally on desktop.
- **Destination Line**:
  - Font: `Manrope`, font-weight: 600, uppercase
  - Mobile size: 11–12px, moderate letter-spacing (`tracking-wider` / `tracking-[0.15em]`)
  - Natural wrapping allowed on narrow screens (no horizontal clipping or overflow).
- **Buttons (CTAs)**:
  - Font: `Manrope`, font-weight: 600
  - Mobile size: 14–15px, minimum touch target: 44px height.
  - Saffron Gold + Midnight Navy (Primary) & Transparent + Warm White border (Secondary).
- **Trust Features**:
  - Font: `Manrope`, 13–14px, concise text with small Lucide icons (16–18px).
- **Pricing Information**:
  - Font: `Manrope`, 11–12px, subtle Warm White opacity (`text-warm-white/70`).

## 5. Mobile Layout & Spacing
- Container padding: `px-5 sm:px-6 md:px-12` (approx 20px–24px inline padding on mobile).
- Vertical clearance: Adequate top padding (`pt-24 sm:pt-28`) ensuring zero overlap with the fixed Navbar.
- Visual positioning: Content centered within the viewport height, maintaining breathing room above the bottom feature highlights.
- No content touching screen edges.

## 6. CTA & Feature Grid Layout
- **Mobile CTAs**:
  - Stacked or compact side-by-side flex layout with `min-h-[44px]` touch targets.
  - Buttons will not wrap text awkwardly.
- **Mobile Trust Features**:
  - 2x2 compact grid on mobile:
    ```
    Customised Trips    Private Cabs
    Handpicked Stays    Local Support
    ```
  - Small saffron/warm-white icons, refined text, visually subordinate to the primary CTAs.
- **Price Line**:
  - Positioned directly below or adjacent to CTAs/features as a subtle supporting detail.

## 7. Progressive Enhancement (Tablet & Desktop)
- **Tablet (768px – 1024px)**:
  - CTAs sit side-by-side.
  - Headings scale smoothly via `clamp()` to 56px–64px.
  - Trust features transition to a 4-column inline bar or horizontal layout.
- **Desktop (1280px+)**:
  - Spacious luxury composition with generous breathing room.
  - Headings scale up to 72px–80px.
  - Slide indicators and location indicator preserved at the bottom corners.

## 8. Acceptance Criteria (Verified)
- [x] Mobile viewports (320px, 360px, 375px, 390px, 414px, 430px) render flawlessly.
- [x] No horizontal scrolling on any mobile screen.
- [x] No text clipping or awkward word wraps.
- [x] Heading is visually dominant across 2–3 lines ("Discover the Magic of Kashmir").
- [x] Primary ("GET FREE QUOTE") and Secondary ("EXPLORE PACKAGES") CTAs meet 44px min touch target.
- [x] All 4 trust features visible in a compact 2x2 grid on mobile (Customised Trips, Private Cabs, Handpicked Stays, Local Support).
- [x] Price line visible, subtle, and readable ("From ₹8,700 per person • on 4 sharing • T&C apply").
- [x] Zero collisions with the Navbar; appropriate top spacing.
- [x] Client official logo integrated in Navbar from client image asset (`/assets/client_logo.png`).
- [x] TypeScript, lint, and build pass with 0 errors.

## 9. Actual Files Changed
- `docs/phases/phase-02b-hero-mobile-first-content-integration.md`: Created phase documentation.
- `public/assets/client_logo.png`: Saved client's official transparent logo asset.
- `src/components/navigation/Navbar.tsx`: Updated logo path to use the client's official logo.
- `src/components/hero/HeroContent.tsx`: Implemented strict mobile-first content hierarchy (Heading -> Description -> Destinations -> CTAs -> 2x2 Trust Features -> Price Line).
- `src/components/hero/HeroSection.tsx`: Unified layout and removed outdated placeholder bottom bar.

## 10. Deviations
- None. All locked elements (fonts, colors, brand overlays, navbar behavior) and content hierarchy rules were strictly observed.

---
STATUS: COMPLETED

