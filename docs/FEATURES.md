# Feature Inventory

This document serves as the complete inventory of features currently implemented in The Indian Wings Company platform. 

**Status Key:**
- ✅ **IMPLEMENTED**: Fully live and active in production.
- 🟡 **PARTIALLY IMPLEMENTED**: Functional but lacking full scope or active backend integration.
- ⏳ **PLANNED**: Explicitly deferred or awaiting database/UI implementation.
- ⚠ **LIMITED / DEVELOPMENT ONLY**: Exists but only suitable for local testing.

---

## 1. Public Website Features

### Navigation
- ✅ **Navbar**: Glassmorphic floating header with scroll detection.
- ✅ **Desktop/Mobile Navigation**: Responsive hamburger menu and structured internal links.
- ✅ **Plan Your Trip CTA**: Persistently triggers the MakeMyTrip-style bottom sheet enquiry modal.

### Hero
- ✅ **Responsive Hero**: High-bitrate 4K MP4 for desktop, optimized MP4 for mobile.
- ✅ **Hero Slides**: Dynamic typography and seasonal badges managed via Admin.
- ✅ **Image Fallback**: Cloudinary `so_0` preloaded WebP/AVIF posters for rapid FCP.
- ✅ **Slide Indicators**: Interactive Framer Motion bullet navigation.

### Enquiry / Lead
- ✅ **Enquiry Form**: React Hook Form with Zod validation.
- ✅ **Enquiry Modal**: Triggered globally via navigation or inline contextual buttons.
- ✅ **Zero-Loss Queue**: IndexedDB offline fallback ensuring leads are dispatched upon network reconnection.
- ✅ **WhatsApp Follow-up**: Success state immediately prompts users to open a pre-filled WhatsApp conversation.

### Floating Contact
- ✅ **Phone & WhatsApp**: Left-aligned floating widget on mobile (`bottom-[84px]`).

### Destinations
- ✅ **Destination Listing**: Grid view of Kashmir hotspots.
- ✅ **Destination Detail**: Dynamic route (`/destinations/[slug]`) with elevation, seasonality, and gallery.
- ✅ **Attraction Categories**: Things To See & Do mapped per destination.

### Packages
- ✅ **Package Listing**: Filterable grid (Featured, Honeymoon, Family).
- ✅ **Package Detail**: Comprehensive dynamic route (`/packages/[slug]`).
- ✅ **Itinerary**: Day-by-day JSON-driven accordion layout.
- ✅ **Pricing & Inclusions**: Integrated into package models.
- 🟡 **PDF Itinerary Generation**: Users can download itineraries, capturing high-intent leads via email gate (PDF styling is partially static).

### Transport
- ✅ **Vehicle Listings**: Innova Crysta, Tempo Traveller, Urbania, etc.
- ✅ **Routes**: Point-to-point transfer listings with pricing.

### Adventure
- ✅ **Activity Listing**: Skiing, Shikara rides, Paragliding, etc., with starting prices.

### Seasonal / Offbeat
- ✅ **Seasonal Filtering**: Packages and destinations categorize and rank based on winter/summer seasonality tags.

### Blog
- ⏳ **Blog System**: PLANNED / NOT IMPLEMENTED. (Database models and Admin UI for dynamic blog posting remain scheduled for a future phase).

### About / Company
- ✅ **About Page**: Founder introduction and brand story.
- ✅ **Client Stories / Reviews**: Video testimonial carousels (with strict singleton playback state) and verified written reviews.
- ✅ **Brands/Partners**: Marquee scroll of trusted Kashmir hospitality partners.

### Search
- ⏳ **Site Search**: PLANNED / NOT IMPLEMENTED.

### Gallery / Media
- ✅ **Hero Media**: Autoplay looping video integration.
- ✅ **Video Reviews**: Modal-based or inline playback enforcing single-video concurrency.

### Chatbot
- ✅ **Botpress AI**: Official v5.0 Webchat embedded securely. Captures leads and answers specific travel FAQs. Server-to-server webhook ingestion to PostgreSQL.

---

## 2. Admin Panel Features

### Authentication
- ✅ **Admin Login/Logout**: Secure HMAC-SHA256 HttpOnly session cookies.
- ✅ **Protected Subdomain**: `/admin/*` protected via Next.js Edge Middleware.
- ✅ **Rate Limiting**: Distributed Upstash Redis (5 attempts / 15 min).

### Content Management
- ✅ **Packages CRUD**: Create, read, update, delete packages and itineraries.
- ✅ **Destinations CRUD**: Manage locations and galleries.
- ✅ **Activities CRUD**: Manage adventure offerings.
- ✅ **Reviews CRUD**: Moderate and publish testimonials.
- ✅ **Transport CRUD**: Manage fleet and routes.
- ✅ **Hero Management**: Live editor for homepage headlines, badges, and video sources (migrated to PostgreSQL).
- ✅ **Settings**: Global site contact variables.
- ⏳ **SEO Hub**: PLANNED (Basic meta edits exist, but algorithmic SEO suggestion hub is deferred).
- ⏳ **Blog Management**: PLANNED / NOT IMPLEMENTED.

---

## 3. Automatic SEO Features
- ✅ **Metadata & Open Graph**: Automatic generation based on dynamic slugs and package titles.
- ✅ **XML Sitemap**: Auto-generated from PostgreSQL listing all active routes.
- ✅ **Robots.txt**: Dynamically served from `SiteSetting` config.
- ✅ **JSON-LD**: Automatic `Product` and `TouristTrip` schema generation injected securely with CSP Nonces.

---

## 4. Performance Features
- ✅ **Responsive Hero Selection**: Conditional rendering of mobile vs desktop media assets.
- ✅ **Hero Preload**: Preloaded poster stills ensuring immediate LCP.
- ✅ **Cloudinary Delivery**: Auto-format (`f_auto,q_auto`) delivery scaling.
- ✅ **Dynamic Imports**: Heavy client components (e.g., Modals, PDF generators) are lazily loaded.
- ✅ **Deferred Botpress**: External scripts loaded non-blocking after hydration.

---

## 5. Security Features
- ✅ **Admin Auth & Authorization**: Cryptographically secure timing-safe session validation.
- ✅ **CSP & Nonce**: Strict Content Security Policy removing `'unsafe-inline'` for scripts, enforcing base64 random nonces.
- ✅ **Rate Limiting**: IP-based Upstash Redis sliding-window throttling.
- ✅ **Origin Verification**: Explicit checking for CSRF defense on REST API.
- ✅ **Size Limits**: 15KB hard limits on webhook ingestion.
- ✅ **JSON-LD Sanitization**: Strict unicode escaping preventing tag breakout XSS.

---

## 6. Integrations

### PostgreSQL / Neon
- **Purpose**: Authoritative ACID data store.
- **Used by**: Render backend, Prisma.
- **Status**: ✅ IMPLEMENTED.

### Upstash Redis
- **Purpose**: Distributed DDoS and spam defense.
- **Used by**: Enquiry, Admin Login, Telemetry routes.
- **Status**: ✅ IMPLEMENTED.

### Cloudinary
- **Purpose**: High-performance CDN for video and imagery.
- **Used by**: Frontend UI, Admin uploads.
- **Status**: ✅ IMPLEMENTED.

### Nodemailer / SMTP
- **Purpose**: Dispatching itineraries and sales lead alerts.
- **Used by**: Lead engine.
- **Status**: ✅ IMPLEMENTED. (Uses verified domain `hello@tourpackageskashmir.com`).

### Botpress
- **Purpose**: AI 24/7 conversational assistance and lead capture.
- **Used by**: Public UI, Backend Webhook.
- **Status**: ✅ IMPLEMENTED.

### Vercel & Render
- **Purpose**: Split hosting (Next.js Edge + Express API).
- **Status**: ✅ IMPLEMENTED.

---

## 7. Feature Matrix

| Feature | Area | Status | User/Admin/System | Notes |
|---------|------|--------|-------------------|-------|
| Hero Video | UI | ✅ IMPLEMENTED | User | Responsive Cloudinary delivery |
| Enquiry Form | UI/API | ✅ IMPLEMENTED | User | Zero-loss offline queue |
| Dynamic Sitemap | SEO | ✅ IMPLEMENTED | System | PostgreSQL driven |
| JSON-LD Schema | SEO | ✅ IMPLEMENTED | System | Automatic `TouristTrip` |
| Admin Auth | Auth | ✅ IMPLEMENTED | Admin | Cross-origin HMAC cookies |
| Tour Packages CRUD | Admin | ✅ IMPLEMENTED | Admin | Full dynamic routing |
| Botpress Chatbot | UI/API | ✅ IMPLEMENTED | User/System | Webhook secured via `x-bp-secret` |
| Blog System | UI/API | ⏳ PLANNED | User/Admin | Explicitly deferred |
| Site Search | UI | ⏳ PLANNED | User | Explicitly deferred |

---

## 8. Feature Dependencies
- **Package** → Database → Enquiry Form → PDF Itinerary → Related Destinations.
- **Hero** → Database (SiteSettings) → Cloudinary (Assets) → LCP Preload.
- **Admin Authentication** → Neon PostgreSQL → Upstash Redis (Rate limiting).

---

## 9. Current Limitations
- **Customer Accounts**: Not implemented. System is Admin-only.
- **Blog Content**: Not implemented.
- **Search Console Data**: GSC analytics unavailable until production domain establishes search history.
- **Framer Motion CSP**: `style-src` retains `'unsafe-inline'` as required by Framer Motion's dynamic inline attribute manipulation.
