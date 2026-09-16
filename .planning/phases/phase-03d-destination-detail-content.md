# Phase 03D — Destination Detail Content: Things To Do + Best Time To Visit + Sticky Sub-Navigation

## 1. Objective
Implement the core content sections for the Destination Detail page (`/destinations/[slug]`):
1. **Destination Sticky Sub-Navigation**: Horizontal navigation bar positioned immediately below the Hero that sticks beneath the global Navbar upon scrolling, featuring links to `Things to Do`, `Best Time To Visit`, `Book Your Trip`, and `Stay`.
2. **Things To See & Do**: Destination-specific showcase featuring dynamic H2, horizontal scrollable category tabs (`Most Loved Places`, `Hills & Mountains`, `Resorts & Stays`, `Foodie Hotspots`, `Adventure`, `Memorable Experience`), and responsive attraction cards (3-column on desktop, compact 2-column with 320px single-column fallback on mobile).
3. **Best Time To Visit**: Destination-specific seasonal guide featuring dynamic H2, season tabs (`Peak Season`, `Moderate Season`, `Off-season`), structured seasonal details (`What To Expect`, `Things You'll Love`), and a dedicated `Festivals & Events` panel.

---

## 2. Destination Detail Section Order
Strictly follows the required flow:
```
Global Navbar (existing, sticky z-50)
  ↓
Destination Detail Hero (existing, preserved untouched)
  ↓
DESTINATION STICKY SUB-NAVIGATION (Things to Do → Best Time To Visit → Book Your Trip → Stay)
  ↓
Things To See & Do (H2, category tabs, attraction cards)
  ↓
Best Time To Visit (H2, season tabs, expectations, highlights, festivals & events)
  ↓
[STOP: Future destination sections reserved for subsequent phases]
```

---

## 3. Sticky Sub-Navigation Behavior
- **Positioning**: Sits immediately below the Hero. When scrolled past, it sticks directly underneath the fixed global Navbar (`sticky top-16 sm:top-20 z-40`).
- **Z-Index**: `z-40` (subordinate to Global Navbar `z-50` and modal `z-[100]`).
- **Items & Fixed Order**:
  1. `Things to Do` &rarr; Smooth scroll to `#things-to-do`
  2. `Best Time To Visit` &rarr; Smooth scroll to `#best-time`
  3. `Book Your Trip` &rarr; Opens existing global `EnquiryModalContext` (no duplicate forms)
  4. `Stay` &rarr; Smooth scroll to `#stay` (ready anchor with graceful fallback)
- **Active State Indicator**: Detects current viewport section via scroll tracking. Underlines/highlights active link with Warm Yellow `#E6B84A`.
- **Mobile Responsive Track**: Controlled single-row horizontal scrolling (`overflow-x-auto scrollbar-none flex-nowrap`) preventing page wrapping and horizontal body overflow.

---

## 4. Things To See & Do Architecture & Behavior
- **Semantic Heading**: Single dynamic `<h2>Things To See & Do in {destination.name}</h2>`.
- **Categories**:
  - `Most Loved Places`
  - `Hills & Mountains`
  - `Resorts & Stays`
  - `Foodie Hotspots`
  - `Adventure`
  - `Memorable Experience`
- **Category Interaction**: Client-side state filtering. Clicking any category immediately updates rendered attraction cards without page refresh.
- **Active Category Indicator**: Warm Yellow `#E6B84A` background with dark text (`bg-[#E6B84A] text-midnight`).

---

## 5. Destination Attraction Card Structure
Each attraction card:
- Aspect-ratio locked image using `next/image` with responsive `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"`.
- Attraction title (`<h3>`).
- Category label / subtitle pill.
- Concise editorial description.
- Suggested duration / time tag (e.g. `2–3 Hours`, `Half Day`).
- Explore action (`Explore Details →`) triggering the enquiry modal.
- **Desktop Grid**: 3 columns (`grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-7`).
- **Mobile Grid**: Compact 2 columns on mobile devices (360px–430px) with clean fallback to 1 column at 320px for optimal readability.

---

## 6. Best Time To Visit Architecture & Behavior
- **Semantic Heading**: Single dynamic `<h2>Best Time To Visit {destination.name}</h2>`.
- **Subheading**: Destination season tagline (e.g. `All year round destination`).
- **Season Tabs**:
  - `Peak Season` (e.g. `DEC - MAR`)
  - `Moderate Season` (e.g. `APR - JUN`)
  - `Off-season` (e.g. `JUL - NOV`)
- **Content Panels**:
  - **What To Expect**: Temperature, climate conditions, atmosphere.
  - **Things You'll Love**: Highlights, activities, scenic features with green check indicators.
  - **Festivals & Events**: Prominent destination events (e.g. `Gulmarg Winter Festival`, `Snow Carnival & Ski Cup`).

---

## 7. Global Design System Tokens
- **Midnight Navy**: `#0B1F2A` (Surface background for detail content)
- **Saffron Orange**: `#F97316` (Active navigation states, active tabs, subtle highlights)
- **Warm Sand**: `#F4EFE6`
- **Warm White**: `#F8F6F0` (Headings, primary typography)
- **Slate Blue**: `#64748B` (Subtitles, secondary text)
- **Charcoal**: `#222222`
- **Typography**: Playfair Display for headings (`font-playfair`), Manrope for UI and body (`font-manrope`).
- **Strict Anti-AI Rules**: Restrained border radii, no excessive glassmorphism, no artificial pill overload.

---

## 8. Data Architecture (`src/data/destination-content.ts`)
```ts
export interface DestinationAttraction {
  id: string;
  name: string;
  category: 'Most Loved Places' | 'Hills & Mountains' | 'Resorts & Stays' | 'Foodie Hotspots' | 'Adventure' | 'Memorable Experience';
  subtitle: string;
  description: string;
  imageUrl: string;
  duration?: string;
}

export interface DestinationSeason {
  id: string;
  period: string; // e.g. 'DEC - MAR'
  label: 'Peak Season' | 'Moderate Season' | 'Off-season';
  whatToExpect: string;
  thingsYoullLove: string[];
}

export interface DestinationFestival {
  name: string;
  month: string;
  description: string;
}

export interface DestinationDetailContent {
  tagline: string;
  attractions: DestinationAttraction[];
  seasons: DestinationSeason[];
  festivals: DestinationFestival[];
}
```

---

## 9. Implementation Summary

### Files Created / Modified:
1. [`src/data/destination-content.ts`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/data/destination-content.ts) &mdash; Structured data for attractions, seasons, and authentic festivals across all destinations.
2. [`src/components/destinations/DestinationSubNavigation.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/destinations/DestinationSubNavigation.tsx) &mdash; Sticky navigation under Navbar with active scrollspy and modal trigger.
3. [`src/components/destinations/ThingsToSeeDoSection.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/destinations/ThingsToSeeDoSection.tsx) &mdash; Category tabs with instant filtering and responsive grid.
4. [`src/components/destinations/DestinationAttractionCard.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/destinations/DestinationAttractionCard.tsx) &mdash; Image-first attraction card layout with duration and modal trigger.
5. [`src/components/destinations/BestTimeToVisitSection.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/destinations/BestTimeToVisitSection.tsx) &mdash; Season tabs, expectations, highlights, and festivals panel.
6. [`src/app/destinations/[slug]/page.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/app/destinations/[slug]/page.tsx) &mdash; Mounted sections in exact sequence below the locked Hero.

---

## 10. Verification Results
- **TypeScript**: `npx tsc --noEmit` &mdash; **0 errors**.
- **ESLint**: `npm run lint` &mdash; **0 errors, 0 warnings**.
- **Responsive Viewports Tested**:
  - Mobile (320px, 360px, 375px, 390px, 414px, 430px) &mdash; No horizontal overflow, compact 2-column cards, single column fallback at 320px, sub-nav scrolls horizontally.
  - Tablet (768px, 834px, 1024px) &mdash; Smooth 2/3 column layout, readable line lengths.
  - Desktop (1280px, 1440px, 1920px) &mdash; 3-column card grid, sticky sub-navigation aligned beneath global navbar.
- **Hero Integrity**: Destination Detail Hero is preserved 100% untouched.
- **Floating Actions**: Phone, WhatsApp, and Instagram remain locked and unregressed.

---

## Status:
**PHASE 03D — COMPLETE / LOCKED**
