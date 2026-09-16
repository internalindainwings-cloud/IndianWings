# Backend Migration Audit — The Indian Wings Company

## Current Architecture

```
GoDaddy DNS
  ↓
Vercel
  ↓
Next.js 16 App Router (monolith)
  ├── Server-rendered Pages (RSC)
  ├── Client Components
  ├── Next.js API Routes (/api/*)
  ├── Middleware (admin auth guard)
  └── Server Services (lib/)
        ├── Prisma ORM → Neon PostgreSQL
        ├── Filesystem (hero-config.json)
        ├── Nodemailer / SMTP
        └── Rate Limiting (in-memory Map - NOT production safe)
```

## Complete API Route Inventory (29 routes)

### Public APIs (No Auth)
| Route | Method | Purpose | DB | Notes |
|---|---|---|---|---|
| GET /api/activities | GET | Fetch active activities | Prisma | Public |
| GET /api/destinations | GET | Fetch active destinations | Prisma | Public |
| GET /api/packages | GET | Fetch packages; ?category= filter | Prisma | Public |
| GET /api/reviews | GET | Fetch reviews; ?type= filter | Prisma | Public |
| GET /api/settings | GET | Site settings (phone, email, etc.) | Prisma | Public; fallback values |
| GET /api/transport | GET | Fetch vehicles + routes | Prisma | Public |
| GET /api/hero | GET | Hero config from filesystem JSON | Filesystem | force-dynamic |

### Lead / Conversion APIs
| Route | Method | Purpose | Auth | Notes |
|---|---|---|---|---|
| POST /api/enquiries | POST | Submit lead | None | Origin check, honeypot, idempotency, rate limit |
| GET /api/enquiries | GET | Fetch enquiries (admin) | Cookie or Bearer | Admin only |
| POST /api/itinerary/download | POST | Gate itinerary email + persist lead | None | Rate limited, SMTP |
| POST /api/telemetry/event | POST | Ingest visitor session + events | None | Best-effort analytics |

### Admin APIs (Require admin session cookie)
| Route | Methods | Purpose |
|---|---|---|
| /api/admin/login | POST | Password verify, issue HttpOnly session |
| /api/admin/logout | POST | Clear session cookie |
| /api/admin/data | GET | Dashboard: leads, sessions, campaigns |
| /api/admin/hero | GET, PUT | Read/write hero config (filesystem) |
| /api/admin/seo | GET, POST | SEO settings + sitemap stats |
| /api/admin/settings | GET, POST | Site settings |
| /api/admin/packages | GET, POST | Package list + create |
| /api/admin/packages/[id] | GET, PUT, DELETE | Package CRUD |
| /api/admin/destinations | GET, POST | Destination list + create |
| /api/admin/destinations/[id] | PUT, DELETE | Destination CRUD |
| /api/admin/activities | GET, POST | Activity list + create |
| /api/admin/activities/[id] | PUT, DELETE | Activity CRUD |
| /api/admin/categories | GET, POST | Package categories |
| /api/admin/reviews | GET, POST | Review list + create |
| /api/admin/reviews/[id] | GET, PUT, DELETE | Review CRUD |
| /api/admin/transport/vehicles | GET, POST | Vehicle list + create |
| /api/admin/transport/vehicles/[id] | PUT, DELETE | Vehicle CRUD |
| /api/admin/transport/routes | GET, POST | Route list + create |
| /api/admin/transport/routes/[id] | PUT, DELETE | Route CRUD |

## Critical Architectural Constraints (MUST READ BEFORE IMPLEMENTING)

### CONSTRAINT 1 - Hero Config Uses Filesystem (BLOCKER)
hero-service.ts reads/writes src/data/hero-config.json via fs/promises.
Vercel filesystem is read-only. Writes already fail silently in production.
REQUIRED: Migrate hero config storage to database (SiteSetting or new HeroConfig table) 
before or during this migration. This is a prerequisite.

### CONSTRAINT 2 - revalidatePath is Next.js-only
PUT /api/admin/hero calls revalidatePath('/') for Next.js ISR cache invalidation.
Cannot exist on a separate Express backend.
SOLUTION: After migration, Express hero update must call Vercel's On-Demand Revalidation API.
Requires VERCEL_REVALIDATE_TOKEN environment variable on the backend.

### CONSTRAINT 3 - Admin Auth Cookie Cross-Origin Problem (CRITICAL)
Current cookie: SameSite=Strict.
Browsers will NOT send this cookie on cross-origin requests (Vercel admin UI -> Render API).
REQUIRED: Change to SameSite=None; Secure for cross-origin cookie auth.
Add credentials: 'include' on all admin fetch calls.
Add CSRF protection since SameSite=None does not prevent CSRF.

### CONSTRAINT 4 - No Customer Authentication
There is no customer login/registration system. Only admin auth exists.
No migration needed. Document as future capability.

### CONSTRAINT 5 - Rate Limiter is In-Memory (CRITICAL)
rate-limit.ts uses Map<string, RateLimitRecord>. Process-local. Must be replaced with Upstash Redis.

## Frontend API Calls (All currently use relative /api/ paths)

| Component | API Call |
|---|---|
| EnquiryForm.tsx | POST /api/enquiries |
| OfflineQueue.ts | POST /api/enquiries (offline sync) |
| DownloadItineraryModal.tsx | POST /api/itinerary/download |
| Telemetry.ts | POST /api/telemetry/event |
| SiteSettingsContext.tsx | GET /api/settings |
| AnnouncementBar.tsx | GET /api/settings |
| PackagesSection.tsx | GET /api/packages?category=featured |
| SeasonalPackagesSection.tsx | GET /api/packages?category=seasonal |
| OffBeatPackagesSection.tsx | GET /api/packages?category=offbeat |
| DestinationsSection.tsx | GET /api/destinations |
| DestinationsPageGrid.tsx | GET /api/destinations |
| VehicleFleetGrid.tsx | GET /api/transport |
| ActivityCardsGrid.tsx | GET /api/activities |
| HeroSection.tsx | GET /api/hero |
| admin/page.tsx | GET /api/admin/data, POST /api/admin/logout |
| admin/login/page.tsx | POST /api/admin/login |
| TabHeroHomepage.tsx | GET/PUT /api/admin/hero |
| TabPackages.tsx | GET /api/admin/packages, /api/admin/categories |
| TabDestinations.tsx | GET /api/admin/destinations |
| TabActivities.tsx | GET /api/admin/activities |
| TabReviews.tsx | GET /api/admin/reviews |
| TabSettings.tsx | GET/POST /api/admin/settings |
| TabTransport.tsx | GET /api/admin/transport/vehicles, routes |
| TabSeo.tsx | GET/POST /api/admin/seo |

## Environment Variables

| Variable | Location | Type | Required |
|---|---|---|---|
| DATABASE_URL | prisma.ts | Server | Yes |
| ADMIN_SECRET_KEY | admin-auth.ts, middleware.ts | Server | Yes |
| ADMIN_PASSWORD | admin-auth.ts | Server | Yes |
| ADMIN_API_SECRET | enquiries GET | Server | Yes |
| NEXT_PUBLIC_SITE_URL | layout, sitemap, pages | Client+Server | Yes |
| NEXT_PUBLIC_GA_MEASUREMENT_ID | AnalyticsScripts.tsx | Client | Optional |
| NEXT_PUBLIC_CLARITY_ID | AnalyticsScripts.tsx | Client | Optional |
| SMTP_HOST | email-service.ts | Server | Optional |
| SMTP_PORT | email-service.ts | Server | Optional |
| SMTP_USER | email-service.ts | Server | Optional |
| SMTP_PASS | email-service.ts | Server | Optional |
| SMTP_FROM | email-service.ts | Server | Optional |

## Missing Variables (Needed After Migration)
- UPSTASH_REDIS_REST_URL (Backend/Server)
- UPSTASH_REDIS_REST_TOKEN (Backend/Server)
- NEXT_PUBLIC_BACKEND_URL (Frontend/Client — Render backend URL)
- FRONTEND_ORIGIN (Backend — allowed CORS origin)
- VERCEL_REVALIDATE_TOKEN (Backend — for on-demand ISR revalidation)

---

## Migration Implementation Status (COMPLETED)

### 1. Database Prerequisite
- [x] Added `heroConfig Json?` column to `SiteSetting` model in Prisma schema
- [x] Migrated `hero-service.ts` to read and persist hero configurations to Neon PostgreSQL (resolving read-only Vercel filesystem limitation)

### 2. Distributed Rate Limiting
- [x] Backend incorporates `@upstash/ratelimit` and `@upstash/redis` with sliding-window limiters:
  - Enquiries: 5 requests / 10 minutes
  - Admin Login: 5 requests / 15 minutes
  - Itinerary: 3 requests / 15 minutes
  - Telemetry: 60 requests / 1 minute

### 3. Standalone Express Backend (`backend/`)
- [x] Complete TypeScript Express REST API structured in `backend/`
- [x] Health probe at `GET /health` querying `SELECT 1` on database
- [x] Full security middleware stack: Helmet, CORS, Origin verification (CSRF defense), and Request size limits
- [x] All 29 API routes implemented across `enquiries`, `itinerary`, `telemetry`, `public/*`, and `admin/*`
- [x] HMAC-SHA256 authenticated admin sessions (`SameSite=None; Secure`) for seamless cross-origin communication between Vercel and Render
- [x] Graceful shutdown handlers for Prisma and HTTP server
- [x] Clean compilation: `tsc --noEmit` and `npm run build` pass with 0 errors

### 4. Frontend Integration
- [x] Unified API Client in `src/lib/api-client.ts` with `credentials: 'include'`
- [x] Zero breaking changes: fallback to Next.js API routes when `NEXT_PUBLIC_BACKEND_URL` is omitted, enabling zero-downtime transition
- [x] CSP updated in `next.config.ts` allowing Render backend domains and dev origins
- [x] Frontend `npx tsc --noEmit` verified with 0 errors

