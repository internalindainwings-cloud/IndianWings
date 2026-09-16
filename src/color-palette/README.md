# The Indian Wings Company — Color Palette Studio (Archived for Future Use)

This directory contains the **Interactive 1-Click Theme & Palette Studio** component (`PaletteTester.tsx`), saved for future design exploration or client theme switching.

## Client Chosen Official Brand Colors:
- **Base / Navbar Tone**: `#0F4C54` (*High Alpine Cyan Shadow*, Category: Teal)
  - Meaning: Electric mineral spring water glowing at dawn.
- **Accent Color**: `#F59E0B` (*Mughal Marigold*)
  - Meaning: Warm Kashmiri hospitality and royal marigold saffron.

## How to Re-enable in Future:
To temporarily or permanently re-enable the floating studio in the development environment:
1. Open `src/components/layout/PublicShell.tsx`
2. Import `PaletteTester`:
   ```tsx
   import { PaletteTester } from '@/color-palette/PaletteTester';
   ```
3. Add `<PaletteTester />` inside `<EnquiryModalProvider>`.
