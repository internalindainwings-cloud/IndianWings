# Phase 09: Backend Lead Engine, PostgreSQL Database, Zero-Loss Resilience & Attribution Tracking

## Phase Status: Completed ✅

## 1. Overview & Objective
Build a fault-tolerant, high-conversion lead capture engine with local PostgreSQL database persistence, a 3-layer zero-loss lead resilience mechanism (LocalStorage ➔ PostgreSQL ➔ WhatsApp), and full UTM/Ad campaign attribution tracking.

## 2. Key Capabilities Implemented

### A. Database Layer
- **PostgreSQL**: Local database `the_indian_wings` on port 5432.
- **Prisma ORM**: Prisma 7 configured with `@prisma/adapter-pg`.
- **Enquiry Model**: Indexes on `phone`, `status`, and `createdAt` with fields for lead data, travel details, and ad attribution (`utmSource`, `utmMedium`, `utmCampaign`, `utmTerm`, `utmContent`, `gclid`, `fbclid`, `referrer`, `ipAddress`, `userAgent`).

### B. 3-Layer Zero-Loss Lead Resilience
1. **Layer 1 (LocalStorage Buffer)**: Synchronously saves every lead into `localStorage` (`tiwc_pending_leads`) before any network call.
2. **Layer 2 (PostgreSQL API)**: Fast POST to `/api/enquiries` with 4-second timeout (`AbortController`).
3. **Layer 3 (Direct WhatsApp Fallback)**: If offline or on slow 2G/3G in Kashmir, automatically opens WhatsApp with pre-composed inquiry to destination specialists.
4. **Background Re-Sync**: `window.addEventListener('online')` flushes pending leads from `localStorage` once connection restores.

### C. Traffic & Ad Attribution Tracking ("Trackage System")
- **File**: `src/lib/utilities/attribution.ts`
- **Session Capture**: Preserves `utm_*`, `gclid`, `fbclid`, and referrer in `sessionStorage` across multi-page browsing.
- **Lead Association**: Automatically attaches captured marketing tags to the database record upon form submission.
- **Analytics Scripts**: Google Analytics 4 (GA4) and Microsoft Clarity integrated in `src/components/analytics/AnalyticsScripts.tsx`.

### D. Multi-Tier Security Perimeter
- **IP Rate Limiter**: 5 requests per 10 minutes per IP (`src/lib/security/rate-limit.ts`).
- **Honeypot Bot Trap**: Invisible `hpField` silently absorbs bot spam with zero DB write.
- **Sanitization**: XSS HTML stripping, control character removal, and strict phone number normalization.

## 3. Related Deep-Dive Technical Blueprints
- Detailed Architecture & Diagrams: [lead_resilience_and_db.md](../technical-architecture/lead_resilience_and_db.md)
