# Phase 7A — Global Floating Contact & Social Actions

## 1. Objective
Implement persistent, floating contact and social actions fixed to the viewport on the right side of the screen across **every page** of the website. These actions serve as site-level utilities, independent of any individual page section.

---

## 2. Architecture & Implementation

### Component Structure
- **Component**: [`src/components/common/FloatingContactActions.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/common/FloatingContactActions.tsx)
- **Mount Point**: Mounted once inside root layout [`src/app/layout.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/app/layout.tsx), ensuring it automatically appears on Homepage, Destinations, Packages, Transport, and all other current and future routes.
- **Config**: Reuses centralized site configuration from [`src/config/site-config.ts`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/config/site-config.ts).

### Visual Order (Strictly Top to Bottom)
1. **Instagram**: Link to official configured Instagram page (`siteConfig.contact.instagramUrl`)
2. **Phone / Call**: Direct `tel:` protocol link (`tel:${siteConfig.contact.phone}`)
3. **WhatsApp**: Direct chat inquiry link with prepopulated message (`siteConfig.contact.whatsappUrl`)

---

## 3. Brand Styling & Responsive Design

### Colors & Hierarchy (Locked Native Platform Colors)
- **Instagram**: Standard official brand linear gradient (`linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)`) with white icon for immediate universal recognition.
- **Phone**: Indian Wings Midnight Navy (`#0B1F2A`) background with Saffron Gold (`#D4A24C`) icon and border accent (`border-saffron/40 hover:border-saffron`).
- **WhatsApp**: Official standard WhatsApp brand green (`#25D366`) with white icon.
- Exception Rule: Instagram and WhatsApp preserve standard native platform colors for recognizability; Phone utilizes the Indian Wings brand treatment.

### Viewport Positioning & Responsiveness
- Mobile (`320px` to `430px`): `w-11 h-11` (44px touch target) with `right-3.5 bottom-6`, stacked vertically with `gap-2.5`.
- Tablet/Desktop (`640px+`): `w-12 h-12` (48px target) with `right-6 bottom-8`, stacked vertically with `gap-3`.
- Fixed to viewport: `fixed right-... bottom-... z-40`.
- Zero document layout shift, zero horizontal overflow.
- Motion: `motion-reduce:transform-none motion-reduce:transition-none` for reduced-motion accessibility.

---

## 4. Accessibility & Layering
- Accessible labels provided via `aria-label`:
  - `aria-label="Open Instagram"`
  - `aria-label="Call The Indian Wings Company"`
  - `aria-label="Chat on WhatsApp"`
- Icons marked with `aria-hidden="true"`.
- Keyboard navigation: Full visible focus rings with `focus-visible:ring-2 focus-visible:ring-saffron` and `focus-visible:ring-midnight`.
- Z-Index layering: `z-40` floats safely above page content without obstructing modals (`z-[100]`) or navbar drawer (`z-50`).

---

## 5. Verification Checklist

- [x] Instagram button exists
- [x] Phone button exists
- [x] WhatsApp button exists
- [x] Correct order: Instagram → Phone → WhatsApp
- [x] Same component appears on every page (`layout.tsx`)
- [x] Fixed to viewport on right side
- [x] Consistent spacing (`gap-2.5` / `gap-3`)
- [x] Circular buttons (`rounded-full`)
- [x] Icons correctly centered (`flex items-center justify-center`)
- [x] Mobile responsive (tested on 390px, 375px, 320px)
- [x] No horizontal overflow
- [x] No layout shift
- [x] Accessible labels on all buttons
- [x] Keyboard focus visible
- [x] Configured links reused from `site-config.ts`
- [x] Zero new npm dependencies
- [x] Existing Hero, Navbar, and other sections remain intact
