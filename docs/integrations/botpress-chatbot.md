# Botpress AI Chatbot Integration Architecture & Completion Report

**Project:** The Indian Wings Company (Kashmir Travel Platform)  
**Status:** Completed, Verified, and Locked (v3 FINAL)  
**Version:** 3.0.0 (Production Verified)  
**Architecture:** Vercel (Next.js Frontend & Admin Console) + Render (Express Backend) + Neon PostgreSQL + Upstash Redis  

---

## 1. Objective

Integrate the official **Botpress AI Chatbot** into The Indian Wings Company's production architecture as an external 24/7 intelligent travel assistant. The chatbot answers visitor questions regarding Kashmir destinations, tour packages, seasonal adventures, and travel planning, while qualifying and capturing traveler leads directly into the existing database and Admin Console.

### Strict Architectural Boundaries Followed
- **No Next.js Webhook Route**: The Botpress lead webhook is implemented exclusively on the **Render Express Backend** (`POST /api/integrations/botpress/lead`).
- **Required Production Webhook Secret**: `BOTPRESS_WEBHOOK_SECRET` is **strictly required** with a minimum 32-character length validation in the Render environment schema (`backend/src/config/env.ts`). It exists only on Render and is never placed on Vercel or exposed to the client bundle.
- **Server-to-Server Security (Not CORS)**: The Botpress webhook is a server-to-server HTTP invocation. Security **does not rely on CORS**. Instead, security is strictly enforced through:
  1. Mandatory `x-bp-secret` header verification.
  2. Constant-time cryptographic comparison (`crypto.timingSafeEqual`).
  3. Distributed rate limiting via **Upstash Redis**.
  4. Explicit 15KB request body size limiting.
  5. Strict Zod payload validation and sanitization.
  6. Idempotency protection (2-minute duplicate submission guard).
- **Shared Business Logic**: Chatbot leads use the shared `createEnquiryRecord` backend service, ensuring normal enquiry form leads and chatbot leads follow the identical validation, attribution, telemetry linking, notification, and database persistence rules.
- **No Second Lead Table**: Neon PostgreSQL's existing `enquiries` table remains the sole single source of truth.
- **Locked UI & External Services**: Navbar, Hero, Lead Form, Destination/Package layouts, typography, brand colors, Admin Console design, GoDaddy Google Ads landing page, and DNS/domain records remain completely untouched.

---

## 2. End-to-End Architectural Data Flow

```
[ Visitor on Website (Vercel) ]
         │
         ▼
[ Botpress Webchat Embedded Widget ]
         │ (Websocket / HTTPS to Botpress Cloud)
         ▼
[ Botpress AI Engine (LLM + Kashmiri Tourism Knowledge Base) ]
         │
         ▼ (When visitor requests custom quote / itinerary)
[ Botpress Lead Capture Conversation Flow ]
         │
         ▼ HTTPS POST with Header: 'x-bp-secret: <BOTPRESS_WEBHOOK_SECRET>'
[ Render Express Backend: POST /api/integrations/botpress/lead ]
         │
         ├── 1. Request Size Limiter (Hard 15KB cap via requestSizeLimit)
         ├── 2. Timing-Safe Secret Verification (crypto.timingSafeEqual on 'x-bp-secret')
         ├── 3. Distributed Upstash Redis Rate Limiting (enquiryLimiter)
         ├── 4. Zod Schema Validation (botpressLeadSchema)
         ├── 5. Shared Enquiry Service (createEnquiryRecord)
         │       ├── Idempotency check (2-min window by phone)
         │       ├── Prisma ORM execution
         │       └── Telemetry session conversion linking
         ▼
[ Neon PostgreSQL: 'enquiries' table (source: 'chatbot', utmSource: 'botpress') ]
         │
         ▼
[ Existing Admin Console (Leads / Enquiries View with WhatsApp Quick-Connect) ]
```

---

## 3. Frontend Integration (Vercel)

### Method: Official Hosted Botpress Webchat Embed
The Next.js frontend uses the official Botpress Webchat script injected asynchronously via a dedicated client component:

- **Component Path**: `src/components/chat/BotpressChatbot.tsx`
- **Global Mounting Location**: Mounted in `src/components/layout/PublicShell.tsx` (rendered on all public visitor pages; strictly omitted from the `/admin` portal).
- **Public Environment Variable**:
  ```env
  NEXT_PUBLIC_BOTPRESS_CLIENT_ID="<your-botpress-client-id>"
  NEXT_PUBLIC_SITE_URL="https://theindianwings.com"
  NEXT_PUBLIC_API_URL="https://indianwings.onrender.com"
  ```
- **Zero Exposed Secrets**: No private tokens, webhook secrets, or database URLs are present on Vercel or in browser code.

### Widget Placement & Coexistence
- **Desktop**: Bottom-right corner (`bottom: 24px, right: 24px`).
- **Mobile**: Anchored at bottom-right (`bottom: 84px, right: 16px`), safely floating above the centered Mobile Dock Capsule (`bottom: 14px, max-w-[410px]`) and completely opposite the left-aligned Floating Contact Actions (`fixed left-3.5 bottom-[84px]`).
- **Non-Blocking**: Loads asynchronously after initial page hydration with zero layout shift.
- **Fault-Tolerant**: If Botpress CDN is unreachable or blocked by adblockers, the website operates with 100% functionality.

---

## 4. Backend Lead-Capture Integration (Render Express)

A dedicated controller and router on the **Render Express Backend**:

- **Exact Webhook Route**: `POST /api/integrations/botpress/lead`
- **File**: `backend/src/routes/integrations/botpress.ts`
- **Mount Point**: Registered in `backend/src/app.ts` as:
  ```typescript
  app.use('/api/integrations/botpress', botpressRouter);
  ```

### Request Payload Specification
```json
{
  "fullName": "Aarav Sharma",
  "phone": "+919876543210",
  "email": "aarav.sharma@example.com",
  "travelDate": "2026-12-15",
  "travellers": "4 Guests",
  "destination": "Gulmarg",
  "tripType": "Family Holiday",
  "message": "Interested in 4-star heated stay with Gondola Phase 1 & 2 tickets."
}
```

---

## 5. Security Model & Webhook Authentication

1. **Required Secret & Timing-Safe Verification**:
   - `BOTPRESS_WEBHOOK_SECRET` must be set on the Render backend (validated by `z.string().min(32)`).
   - Inbound request must supply:
     `x-bp-secret: <BOTPRESS_WEBHOOK_SECRET>`
   - Verified via constant-time buffer comparison:
     ```typescript
     const expected = Buffer.from(env.BOTPRESS_WEBHOOK_SECRET);
     const incoming = Buffer.from((req.headers['x-bp-secret'] as string) || '');
     if (expected.length !== incoming.length || !crypto.timingSafeEqual(expected, incoming)) {
       return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid authentication token' });
     }
     ```
2. **Server-to-Server Origin Handling**:
   - The endpoint is exempted from browser `originGuard` (`/api/integrations/*`) because Botpress webhook requests originate server-to-server without a consumer browser origin.
   - CORS is **not** relied upon for webhook security; authentication is strictly cryptographically enforced by `x-bp-secret`.
3. **Explicit 15KB Payload Limit**:
   - Middleware `requestSizeLimit(15 * 1024)` rejects oversized payloads with HTTP 413.
4. **Idempotency Protection**:
   - Duplicate inquiries from the same phone number submitted within 2 minutes are safely deduplicated.

---

## 6. Shared Enquiry Service & Database Mapping

To ensure normal enquiry form leads and chatbot leads follow the identical persistence, validation, and attribution rules, the logic is encapsulated in `backend/src/services/enquiry.ts`:

- Reuses `enquirySchema` validation.
- Maps `fullName` ➔ `name`.
- Maps `travellers` ➔ `guests`.
- Sets `source = "chatbot"` and `utmSource = "botpress"`.
- Persists into Neon PostgreSQL `prisma.enquiry`.
- Links `visitorId` to `prisma.userSession` for conversion telemetry.

---

## 7. Admin Console Visibility

- Leads from Botpress automatically appear in the existing **Enquiries / Leads** section.
- Displays `chatbot` in the Marketing Source column.
- One-click WhatsApp contact action immediately pre-fills a greeting for the traveler.
- Full compatibility with existing Excel / CSV export.

---

## 8. Bot Behavior & Knowledge Baseline

- **Persona**: "The Indian Wings Travel Assistant"
- **Approved Knowledge**: Kashmir destinations (Srinagar, Gulmarg, Pahalgam, Sonamarg, Doodhpathri, Gurez Valley), approved packages, transport services, activities, and seasonal travel advice.
- **Constraints**: Chatbot never confirms bookings or invents live availability/pricing. When quoting, it instructs the user that the Srinagar operations desk will confirm exact reservations.

---

## 9. Environment Variables Summary

### Vercel (Frontend & Admin):
```env
NEXT_PUBLIC_BOTPRESS_CLIENT_ID="<public-botpress-client-id>"
NEXT_PUBLIC_SITE_URL="https://theindianwings.com"
NEXT_PUBLIC_API_URL="https://indianwings.onrender.com"
```

### Render (Express Backend):
```env
BOTPRESS_WEBHOOK_SECRET="<minimum-32-char-cryptographic-secret>"
DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"
UPSTASH_REDIS_REST_URL="https://...upstash.io"
UPSTASH_REDIS_REST_TOKEN="gQ..."
FRONTEND_ORIGIN="https://theindianwings.com"
```

---

## 10. Automated Verification & Test Results

### 1. Webhook Security & Idempotency Test Suite
Ran 9 comprehensive automated test cases against the live Express router:
- **Test 1**: Missing `x-bp-secret` ➔ `HTTP 401 Unauthorized` **[PASSED]**
- **Test 2**: Wrong `x-bp-secret` (length mismatch) ➔ `HTTP 401 Unauthorized` **[PASSED]**
- **Test 3**: Wrong `x-bp-secret` (same length mismatch) ➔ `HTTP 401 Unauthorized` **[PASSED]**
- **Test 4**: Payload > 15KB ➔ `HTTP 413 Payload Too Large` **[PASSED]**
- **Test 5**: Malformed payload (schema invalid) ➔ `HTTP 400 Bad Request` with structured field errors **[PASSED]**
- **Test 6**: Valid payload with correct secret ➔ `HTTP 201 Created` with generated lead ID **[PASSED]**
- **Test 7**: Duplicate submission within 2 mins ➔ `HTTP 200 OK` (idempotent, no duplicate in DB) **[PASSED]**
- **Test 8**: Distributed rate limiter (Upstash Redis sliding window) ➔ `HTTP 429 Too Many Requests` **[PASSED]**
- **Test 9**: Server-to-server request without browser Origin header ➔ `HTTP 201 Created` **[PASSED]**

**Result:** `ALL SECURITY & INTEGRATION TESTS: 9 PASSED, 0 FAILED`.

### 2. Database Record Verification
Queried the live Neon PostgreSQL database:
```json
{
  "id": "7d8a5d1e-f91e-4e39-a65a-2a3b81e03837",
  "name": "No Origin Check",
  "phone": "9916461152",
  "travelDate": "2026-12-01",
  "guests": "2-4 Guests",
  "tripType": "Kashmir Tour",
  "source": "chatbot",
  "utmSource": "botpress",
  "status": "NEW",
  "createdAt": "2026-09-20T17:38:43.002Z"
}
```

### 3. Build & TypeScript Verification
- **Backend Typecheck**: `npm run typecheck` (`tsc --noEmit`) ➔ `Exit code 0`
- **Backend Build**: `npm run build` (`tsc`) ➔ `Exit code 0`
- **Frontend Typecheck**: `npx tsc --noEmit` ➔ `Exit code 0`
- **Frontend ESLint**: `npx eslint src/components/chat/BotpressChatbot.tsx src/components/layout/PublicShell.tsx` ➔ `Exit code 0`
- **Frontend Build**: `npm run build` (`next build`) ➔ `Exit code 0` (all 50 routes compiled)

---

## 11. Files Changed & Intentionally Untouched

### Files Created:
1. `src/components/chat/BotpressChatbot.tsx` — Asynchronous hosted embed component.
2. `backend/src/services/enquiry.ts` — Shared enquiry creation service.
3. `backend/src/routes/integrations/botpress.ts` — Server-to-server webhook endpoint.
4. `backend/src/test-botpress-webhook.ts` — Automated security test suite.

### Files Modified:
1. `src/components/layout/PublicShell.tsx` — Mounted `<BotpressChatbot />` for public pages only.
2. `backend/src/app.ts` — Added route mount and allowedHeaders for `x-bp-secret`.
3. `backend/src/config/env.ts` — Added required `BOTPRESS_WEBHOOK_SECRET` (min 32 chars).
4. `backend/src/middleware/originGuard.ts` — Added exemption for `/api/integrations/*`.
5. `backend/src/routes/enquiries.ts` — Refactored to reuse shared `createEnquiryRecord`.
6. `.env.example` & `backend/.env.example` — Added environment variable templates.
7. `docs/integrations/botpress-chatbot.md` — Complete integration documentation.

### Dependencies Added:
- **NONE** (0 new npm packages).

### Files Intentionally Untouched:
- Navbar (`src/components/navigation/Navbar.tsx`)
- Hero (`src/components/hero/*`)
- Lead/Enquiry Form (`src/components/forms/EnquiryForm.tsx`)
- Destinations & Packages UI (`src/components/destinations/*`, `src/components/packages/*`)
- Floating Contact Actions (`src/components/common/FloatingContactActions.tsx`)
- Admin Console visual design (`src/components/admin/*`)
- GoDaddy Google Ads Landing Page & DNS
