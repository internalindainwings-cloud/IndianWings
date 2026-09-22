# Project Documentation

## 1. Project Overview
- **Project name**: The Indian Wings Company
- **Purpose**: Luxury travel agency and destination management platform specializing in the Kashmir Valley. Delivers a cinematic, mobile-first booking experience tailored for high-intent domestic and international travelers.
- **Main website**: https://theindianwings.com
- **Current project status**: Production Release Ready (v2.0)
- **Repository/project structure overview**: Monorepo structure with Next.js App Router for frontend/admin UI and a standalone Express Node.js application in `backend/` for the REST API.

## Feature Inventory
For a comprehensive, up-to-date inventory of all implemented features across the public website, admin panel, SEO systems, and performance optimizations, please refer to the dedicated feature document:
- **[Feature Documentation](FEATURES.md)**

## 2. Technology Stack
**Frontend**:
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 3.4
- Framer Motion
- Lucide React
- React Hook Form
- Zod

**Backend**:
- Node.js 22
- Express 4.21
- TypeScript
- Prisma ORM 7.10
- PostgreSQL 16 (Neon Serverless)
- Redis / Upstash (Distributed rate limiting)
- Cloudinary CDN (Media delivery)
- Resend / Nodemailer (Email services)

## 3. System Architecture
```
                          [ GoDaddy DNS ]
                         theindianwings.com
                                 │
                ┌────────────────┴────────────────┐
                ▼                                 ▼
          [ Vercel ]                        [ Render ]
       Next.js 16 App Router             Express Node.js REST API
   (https://theindianwings.com)        (https://tiwc-api.onrender.com)
                │                                 │
                │                         ┌───────┴───────┐
                ▼                         ▼               ▼
      [ Next.js Edge Cache ]        [ Neon DB ]    [ Upstash Redis ]
     Server-Side Rendering (SSR)   PostgreSQL 16    Distributed Rate
    Static Generation / ISR Cache  Pooled (pgbouncer)   Limiting
```
- Botpress AI Chatbot integrated securely via Webhook to the Render Backend.

## 4. Repository Structure
- `src/app/`: Next.js App Router pages, global layouts, and frontend API routes.
- `src/components/`: Shared UI elements (forms, cards, navigations, hero blocks).
- `src/lib/`: Frontend utilities, API client (with `credentials: 'include'`), and telemetry.
- `backend/`: Standalone Express REST API codebase (controllers, services, routes).
- `prisma/`: Prisma schema defining PostgreSQL database structure.
- `docs/`: The single documentation directory (this file).

## 5. Frontend Architecture
- **App Router**: Utilizes React Server Components (RSC) for SEO optimization and rapid page loads.
- **Shared Components**: Glassmorphic app bars, interactive MakeMyTrip (MMT) style bottom sheets, dynamic badges.
- **Forms**: Zero-loss lead engine using `react-hook-form` + `zod` with offline IndexedDB queueing.
- **Global Layout**: Applies theme variables, Microsoft Clarity, GA4, and strict CSP nonce injection.
- **Admin/Frontend Boundary**: Strict isolation of `/admin` routes. Admin uses standard Next.js pages but fetches data securely from Render API using cross-origin cookies.

## 6. Backend/API Architecture
- **API Structure**: Express REST API exposing 29+ endpoints across `enquiries`, `itinerary`, `telemetry`, `admin`, and `integrations`.
- **Authentication**: Admin auth via HMAC-SHA256 HttpOnly cookies with `SameSite=None; Secure`. No customer auth exists.
- **Security Boundaries**: Helmet, CORS, strict origin verification for CSRF defense, and 15KB request size limits.
- **Rate Limiting**: Sliding-window Upstash Redis implementation.
- **Integrations**: Botpress webhook endpoint protected by `x-bp-secret` and timing-safe equal comparison.
- **Error Handling**: Standardized JSON error responses.

## 7. Database
- **Provider**: Neon PostgreSQL 16 (Serverless with `pgbouncer` pooling).
- **ORM**: Prisma 7.10.
- **Models**:
  - `Enquiry`: Captures customer leads, UTM tracking, and status lifecycle.
  - `UserSession` & `SessionEvent`: Visitor journeys and conversion telemetry.
  - `Package` & `PackageCategory`: Travel listings with JSON itineraries.
  - `Destination` & `Activity`: Kashmir locations and specialized activities.
  - `TransportVehicle` & `TransportRoute`: Fleet and transfer details.
  - `CustomerReview`: Verified ratings and testimonials.
  - `SiteSetting`: Global configuration and JSON hero settings.
- *(Note: Blog models are PLANNED and not currently in production schema).*

## 8. Cache / Redis
- **Next.js Caching**: Vercel Edge caching and ISR (Incremental Static Regeneration).
- **Invalidation**: On-demand revalidation utilizing `VERCEL_REVALIDATE_TOKEN` from the Render backend.
- **Upstash Redis Usage**: Used strictly for distributed rate limiting across Vercel and Render environments.
  - Enquiries: 5 req / 10 min
  - Admin Login: 5 req / 15 min
  - Itinerary Download: 3 req / 15 min
  - Telemetry: 60 req / 1 min

## 9. Media / Cloudinary
- **Cloudinary Usage**: Centralized global media CDN.
- **Image/Video Architecture**: High-bitrate MP4 backgrounds (`f_auto,q_auto,ac_none`). Preloaded WebP/AVIF poster stills for rapid FCP.
- **Supported formats**: Auto-formatted to WebP/AVIF for images. MP4 for video.
- **REQUIRED Guidelines**:
  - Hero videos must use Cloudinary.
  - Alt text is mandatory for all SEO-critical images.
  - Use `next-cloudinary` components for automated responsive breakpoints.

## 10. Design System
- **Colors**:
  - Midnight Navy (`#0B1F2A`): Primary luxury background.
  - Kashmiri Saffron (`#F97316` / `#EA580C`): High-converting primary CTAs.
  - Warm Sand (`#F4EFE6`): Soft neutral foundation.
  - Forest Alpine Emerald (`#064E3B` / `#059669`): Trust indicators and verified badges.
- **Typography**: Playfair Display (Headings) and Manrope (Body).
- **Visual Direction**: Glassmorphism, smooth micro-animations (Framer Motion), mobile-first MMT style drawers.

## 11. Performance
- **COMPLETED**:
  - Phase 3: Hero LCP optimization with `so_0` preloaded poster stills.
  - Phase 4: Next.js App Router caching strategy implementation.
  - Phase 5: Media optimization via Cloudinary auto-format integration.
  - Phase 6: Core Web Vitals stabilization (dynamic imports for heavy components).
- **REMAINING / MONITORING**:
  - Continuous monitoring of TBT (Total Blocking Time) when third-party scripts (GA4/Clarity) execute.

## 12. Security
- **VERIFIED**:
  - Admin authentication via secure, timing-safe HttpOnly cookies.
  - API Origin Guard / CSRF protection on the Render backend.
  - Rate limiting via Upstash Redis with `x-real-ip` trust extraction.
  - Content Security Policy (CSP): Cryptographically strong per-request nonces injected into `script-src`. `'unsafe-inline'` strictly removed in production.
  - Localhost / `127.0.0.1` origins stripped from production `connect-src` CSP.
  - JSON-LD sanitization to prevent tag-breakout XSS.
  - Botpress Webhook protected by 32-character secret and `crypto.timingSafeEqual`.
- **KNOWN LIMITATION**:
  - `style-src` retains `'unsafe-inline'` to support Framer Motion and Next.js dynamic styling (acceptable tradeoff).

## 13. Admin Panel
- **Access**: Securely isolated at `https://theindianwings.com/admin/login`.
- **Authentication**: Password-protected, yielding an HMAC-SHA256 session cookie.
- **Capabilities**:
  - Overview metrics (Leads today, Conversion rates).
  - Inbound Leads inbox (NEW → CONTACTED → WON).
  - Full CRUD for Tour Packages, Destinations, Activities, Transport, and Reviews.
  - Homepage Hero Editor (persisted to database).
  - SEO Hub (edit site titles, metadata, robots.txt).

## 14. Blog System
- **Status**: PLANNED (Not currently implemented in the database or UI).
- **Architecture**: Will utilize PostgreSQL for storage, support rich text/markdown extraction, and automatic JSON-LD BlogPosting schema generation.

## 15. SEO
- **Current Technical SEO**:
  - Single `<h1>` tag enforcement.
  - Dynamic `sitemap.xml` mapping active DB packages/destinations.
  - Dynamic `robots.txt` served from `SiteSetting`.
  - Automated `TouristTrip` and `Product` JSON-LD structured data on package pages.
  - OpenGraph & Twitter metadata configuration.
- **Post-Production SEO (DEFERRED)**:
  - Google Search Console submission and real query analysis.
  - CTR optimization and search-performance analysis.
  - Internal link silo structure building.

## 16. Production / Deployment
- **Domain**: `theindianwings.com` (GoDaddy DNS -> Vercel Anycast IP).
- **Vercel**: Next.js App Router hosting, connecting to the Render backend via `NEXT_PUBLIC_BACKEND_URL`.
- **Render**: Node.js Express API hosting, running `npm start`.
- **Neon & Upstash**: Pooled serverless DB and distributed cache.
- **Verification**: Ensure all origin guards and webhook secrets are correctly populated.

## 17. Environment Variables
**Frontend (Vercel)**:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_BACKEND_URL`
- `DATABASE_URL` (For SSR fallback)
- `NEXT_PUBLIC_BOTPRESS_CLIENT_ID`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_CLARITY_ID`

**Backend (Render)**:
- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `ADMIN_PASSWORD`
- `ADMIN_SECRET_KEY`
- `ADMIN_API_SECRET`
- `FRONTEND_ORIGIN`
- `BOTPRESS_WEBHOOK_SECRET`
- `VERCEL_REVALIDATE_TOKEN`
- `RESEND_API_KEY`
- `RESEND_FROM`

## 18. Development & Testing
- Start local frontend: `npm run dev`
- Build frontend: `npm run build`
- Start local backend (in `backend/`): `npm run dev`
- Type checking: `npx tsc --noEmit`
- Linting: `npm run lint`
- Prisma migrations: `npx prisma migrate dev` or `npx prisma db push`

## 19. Completed Project Phases
| Phase | Area | Status | Important Result |
|---|---|---|---|
| 01 | Foundation | Complete | Next.js App Router, Tailwind setup |
| 02 | Hero & UI | Complete | Video backgrounds, glassmorphic nav |
| 03 | Destinations | Complete | Detailed destination routing and UI |
| 04 | Packages | Complete | Dynamic tour itineraries and pricing |
| 07 | UX Widgets | Complete | Floating contact buttons, WhatsApp CTA |
| 09 | Database | Complete | Neon PostgreSQL & Prisma integration |
| 10 | Lead Engine | Complete | Zero-Loss Offline Queue & MMT Bottom Sheets |
| 11 | Admin Portal | Complete | Secure CRUD dashboard for business management |
| 12 | SEO & SEO Hub | Complete | Dynamic XML sitemaps, JSON-LD, SEO management |
| 13 | Backend Splitting | Complete | Standalone Render Express API migration |
| 14 | Security | Complete | Redis rate limiting, CSP Noncing, IP hardening |
| 15 | AI Integration | Complete | Botpress webhook lead ingestion |

## 20. Current Known Limitations
- Vercel filesystem is read-only. (Resolved by migrating Hero Config to PostgreSQL).
- `'unsafe-inline'` remains in `style-src` CSP directive due to Framer Motion constraints.
- Customer authentication is not implemented (System is admin-only).

## 21. Deferred / Future Work
- Blog System implementation and database modeling.
- Google Search Console integration and query CTR analysis.
- Post-production performance indexing.

## 22. Operational Checklists
### New Media Checklist
- Correct placement (Hero vs Package Gallery).
- Appropriate resolution (4K for hero, 1080p for galleries).
- Appropriate file size (Utilize Cloudinary `q_auto,f_auto`).
- Preview desktop and mobile responsiveness.

### Production Verification Checklist
- Environment variables populated on Vercel and Render.
- GoDaddy DNS accurately pointing to Vercel.
- HTTPS certificates active.
- Admin login succeeds.
- Test Enquiry form submits successfully (Verify rate limit).
- Botpress webhook accepts leads.
- Robots.txt and Sitemap.xml resolve.
- CSP headers present in browser DevTools.

## 23. Change Management
**Rule**: AUDIT → FIX ONLY CONFIRMED ISSUES → TEST → VERIFY → DOCUMENT → STOP.
- For future phases, do not make theoretical changes or unnecessary refactors.
