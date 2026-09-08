# Design System

## Colors
The currently approved initial design system colors are locked:
- **Primary**: Midnight Navy (`#0B1F2A`)
- **Accent**: Saffron Gold (`#D4A24C`)
- **Background**: Warm Sand (`#F4EFE6`)
- **Secondary**: Slate Blue (`#64748B`)
- **Main Text**: Charcoal (`#222222`)
- **Hero Text**: Warm White (`#F8F6F0`)

*Rule: Content colors can vary naturally; brand UI colors remain consistent.*

## Typography
- **Heading Font**: Playfair Display
  - Used for: Hero headings, major headings, editorial/premium text, package titles.
- **Body/UI Font**: Manrope
  - Used for: Navigation, buttons, body text, labels, forms, UI elements.
- Fonts will be loaded using Next.js `next/font` optimization.

## Button Direction
- Buttons should reflect a premium aesthetic, leveraging the Primary or Accent colors.
- Interactive states (hover/active) should provide clear visual feedback without being overly flashy.

## Spacing Philosophy
- Consistent use of spacing (padding and margins) based on a defined grid system (e.g., Tailwind's default spacing scale).
- Ample whitespace to create a clean, uncluttered, and luxurious feel.

## Responsive Philosophy
- **Mobile-first strictly enforced.** 
- All components must be designed for mobile screens first, then progressively enhanced for Tablet, Laptop, Desktop, and Large Desktop using standard breakpoints.
- Avoid desktop-first designs that simply shrink for mobile.

## Brand Consistency Rules
- Adhere strictly to the defined colors and typography.
- Do not randomly introduce additional brand colors.
