# Phase 2C — Lead & Enquiry Form (Inline Section + Global Modal)

## 1. Objective
Implement a high-converting, mobile-first Lead & Enquiry Form for The Indian Wings Company featuring two synchronized touchpoints:
1. **Inline Homepage Section**: Rendered immediately after the Hero section and immediately before the *Why Travel With Us* section with anchor `id="quote"`.
2. **Global Popup Modal**: Accessible from any page via the Navbar "Plan Your Trip →" button or on-demand triggers.

---

## 2. Architecture & Design

### Reusable Core Component
- **Component**: [`src/components/forms/EnquiryForm.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/forms/EnquiryForm.tsx)
- Contains all input fields, state validation, and submit logic.
- Fields:
  - **Full Name** (required)
  - **WhatsApp / Phone Number** (required)
  - **Travel Month / Date** (required)
  - **Number of Guests** (1–2, 3–4, 5–8, 8+)
  - **Trip Style / Package Preference** (Kashmir Classic, Honeymoon Special, Family Vacations, Adventure & Trekking)
  - **Special Requirements / Notes** (optional)
- **Submission Action**:
  - Automatically formats the inquiry into a WhatsApp text message and opens the official WhatsApp link (`siteConfig.contact.whatsappUrl`).
  - Displays an instant in-form confirmation banner.

### Inline Homepage Section
- **Component**: [`src/components/forms/LeadFormSection.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/forms/LeadFormSection.tsx)
- Placed in homepage hierarchy:
  ```
  Navbar
  ↓
  Hero
  ↓
  LeadFormSection (Inline Form id="quote")
  ↓
  WhyTravelWithUsSection
  ```
- Uses brand styling: Warm Sand (`#F4EFE6`) section backdrop, Midnight Navy accents, Playfair Display heading ("Plan Your Kashmir Journey"), trust highlights, and the embedded form.

### Global Popup Modal
- **Component**: [`src/components/forms/EnquiryModal.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/forms/EnquiryModal.tsx)
- Controlled via [`src/context/EnquiryModalContext.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/context/EnquiryModalContext.tsx).
- Rendered in root layout [`src/app/layout.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/app/layout.tsx).
- Triggered by:
  - Desktop Navbar "Plan Your Trip →" button
  - Mobile Menu "Plan Your Trip →" button
- Includes backdrop blur, click-outside to close, `Esc` key listener, and accessible focus management.

---

## 3. Brand & Editorial Design Checklist
- Colors strictly respect Indian Wings guidelines:
  - Midnight Navy: `#0B1F2A`
  - Saffron Orange: `#F97316` (Global Accent from official wings logo)
  - Warm Sand: `#F4EFE6`
  - Warm White: `#F8F6F0`
- Architectural form surface with refined `rounded-lg` / `rounded-xl` borders (zero AI pill shapes).
- Trust points rendered as understated editorial statements without circular icon badges or card floating effects.
- Direct uppercase labels above inputs with subtle borders and `#F97316` focus states.
- CTA button: refined `rounded-lg` with `#F97316` background and Midnight Navy typography.
- Zero external libraries or npm dependencies installed.
