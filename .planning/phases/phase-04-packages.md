# Phase 4: Packages Section (Our Packages — Featured Packages)

## 1. Overview
Implement the centralized **Packages Section** immediately following the Client Photo Gallery on the homepage. 

This section presents The Indian Wings Company's primary commercial offerings: handcrafted Kashmir itineraries tailored for couples, families, adventure seekers, and offbeat explorers.

---

## 2. Section Hierarchy & Layout
- **Centered Eyebrow**: `OUR PACKAGES` with saffron accent divider lines.
- **Main Heading**: `Featured Packages` (`font-playfair`, centered, `text-midnight`).
- **Narrative Subtitle**: Clear, human-written editorial subtext emphasizing private transfers, verified boutique stays, and 24/7 on-ground assistance.
- **Cards Grid**: Total 6 package cards with 100% dimensional consistency and uniform alignment.
- **Pagination & View All**:
  - Interactive pagination controls (Page 1 / Page 2, Prev / Next).
  - Centered "View All Packages →" luxury button.

---

## 3. Package Dataset (6 Featured Packages)
1. **Kashmir Classic Odyssey (Srinagar, Gulmarg, Pahalgam)** — 6D / 5N — ₹18,500 / person
2. **Winter Wonderland & Powder Snow (Gulmarg Focused)** — 5D / 4N — ₹22,000 / person
3. **Romantic Kashmir Honeymoon & Heritage Houseboat** — 6D / 5N — ₹26,500 / couple
4. **Untouched Valleys: Doodhpathri & Gurez Expedition** — 7D / 6N — ₹24,500 / person
5. **Grand Kashmir Discovery (All Valleys & Glaciers)** — 8D / 7N — ₹29,000 / person
6. **Scenic Weekend Escape (Srinagar & Gulmarg Highlights)** — 4D / 3N — ₹14,500 / person

---

## 4. Card Design Specifications (Industry Standard)
- **Top Image Portion**: Uniform aspect ratio (`aspect-[16/10]`), high-resolution Kashmir photography, duration badge (`6D / 5N`), and category badge (`Best Seller`).
- **Card Body**:
  - Star rating & verified review count (`★ 4.9 (148)`).
  - Package title (`font-playfair`, semibold).
  - Key destinations trail (`Srinagar → Gulmarg → Pahalgam`).
  - Key amenity icons (`Hotels`, `Private Cab`, `Meals`, `Guide`).
  - Price block with clear starting tag (`Starting at ₹18,500 / person`).
  - Primary Action Button: *"Enquire Now"* / *"View Details"* (triggers the existing Enquiry modal with package preselected).

---

## 5. Design System Compliance
- **Typography**: `Playfair Display` (headings) and `Manrope` (body, prices, tags).
- **Colors**:
  - Accent: `--color-saffron` (`#F97316`)
  - Deep Navy: `--color-midnight` (`#0B1F2A`)
  - Warm Surfaces: `--color-warm-sand` (`#F4EFE6`) & `--color-warm-white` (`#F8F6F0`)
- **Zero AI Clutter**: No generic random gradients or misaligned cards. Strict structural consistency.
