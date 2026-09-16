# Backend Architecture, Zero-Loss Lead Resilience & Security Engine
### The Indian Wings Company — Technical Architecture & Lead Pipeline Documentation

This document outlines the complete architectural design, database data models, zero-loss resilience engine, attribution tracking, multi-layer security defense, and edge-case handling for **The Indian Wings Company**.

---

## 1. System Architecture & High-Level Data Flow

```mermaid
graph TB
    subgraph ClientLayer ["1. Client Layer (Browser & Mobile Devices)"]
        AdTraffic["Google / Meta Ad Traffic (with UTM & Click IDs)"] --> AttributionEngine["Attribution Engine (sessionStorage)"]
        OrganicTraffic["Direct & Organic Search Traffic"] --> AttributionEngine
        AttributionEngine --> MainUI["Next.js Responsive Front-End (Hero, Packages, Modals)"]
        MainUI --> Analytics["User Journey Tracking (GA4 + Microsoft Clarity)"]
        MainUI --> EnquiryForm["Enquiry Form / Lead Capture"]
    end

    subgraph ResilienceLayer ["2. Zero-Loss Resilience Engine (Client-Side)"]
        EnquiryForm -->|Synchronous Save| LocalStorage["Layer 1: LocalStorage Buffer (tiwc_pending_leads)"]
        LocalStorage --> NetworkCheck{"Network State"}
        NetworkCheck -->|Online| APIDispatch["Layer 2: POST /api/enquiries (4s Timeout)"]
        NetworkCheck -->|Offline / Weak 3G| DirectWA["Layer 3: Direct WhatsApp Deep-Link (wa.me)"]
        APIDispatch -->|Timeout / 500 Fail| DirectWA
        OnlineListener["Network Reconnect Listener (window.onLine)"] -->|Background Re-sync| APIDispatch
    end

    subgraph SecurityLayer ["3. Multi-Tier Security Perimeter"]
        APIDispatch --> RateLimiter["Sliding-Window IP Rate Limiter (Max 5/10m)"]
        RateLimiter --> PayloadGuard["Payload Size Ceiling (<15 KB)"]
        PayloadGuard --> HoneypotTrap["Honeypot Bot Trap (Invisible hpField)"]
        HoneypotTrap --> XSSSanitizer["Input Sanitization & Injection Defense"]
    end

    subgraph BackendLayer ["4. Backend & Data Layer"]
        XSSSanitizer --> ZodValidator["Zod Schema Validation (Phone & Types)"]
        ZodValidator --> PrismaORM["Prisma Client Singleton"]
        PrismaORM --> PostgresDB[("PostgreSQL Database (Local Port 5432)")]
        PostgresDB --> LeadsTable["enquiries Table (Leads, Attribution & Metadata)"]
    end

    subgraph ConversionLayer ["5. Human Sales & Conversion"]
        APIDispatch -->|On 201 Success| OpenWA["Open WhatsApp with Pre-filled Lead"]
        DirectWA --> SalesTeam["Srinagar Destination Specialists (Real-time WhatsApp)"]
        OpenWA --> SalesTeam
    end

    style PostgresDB fill:#0B1F2A,stroke:#F97316,stroke-width:2px,color:#fff
    style LocalStorage fill:#F4EFE6,stroke:#0B1F2A,stroke-width:2px,color:#0B1F2A
    style SalesTeam fill:#25D366,stroke:#0B1F2A,stroke-width:2px,color:#fff
    style SecurityLayer fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#78350F
```

---

## 2. The 3-Layer Zero-Loss Lead Resilience Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Customer as 👤 Customer (Mobile / Desktop)
    participant Form as 📝 Enquiry Form
    participant L1 as 💾 Layer 1: LocalStorage Buffer
    participant API as ⚡ Layer 2: Next.js API (/api/enquiries)
    participant DB as 🗄️ PostgreSQL Database
    participant L3 as 🟢 Layer 3: WhatsApp Deep-Link (wa.me)
    actor Agent as 🧑‍💼 Srinagar Destination Specialist

    Customer->>Form: Enters Name, Phone, Travel Dates & Taps Submit
    
    rect rgb(255, 248, 220)
        Note over Form,L1: [Layer 1] Synchronous Local Persistence
        Form->>L1: Save lead + UTM tags + timestamp into 'tiwc_pending_leads'
        L1-->>Form: Confirmed cached on device
    end

    alt Network Healthy (Normal Path)
        Form->>API: [Layer 2] POST /api/enquiries (AbortController with 4s timeout)
        API->>DB: prisma.enquiry.create(...)
        DB-->>API: 201 Created (Lead ID)
        API-->>Form: 201 OK JSON Response
        Form->>L1: Remove synced lead from pending queue
        Form->>L3: Launch WhatsApp with pre-composed trip inquiry
        L3->>Agent: Receives lead notification on WhatsApp with trip details
        Form-->>Customer: Display Booking Confirmation Card
    else Network Drops / Weak 3G / API Timeout / Database Paused
        Form->>API: POST /api/enquiries
        Note over Form,API: Network hangs or times out after 4 seconds
        Form->>L1: Mark lead as 'pending_retry'
        Form->>L3: [Layer 3 Fallback] Immediately launch direct WhatsApp (wa.me)
        L3->>Agent: Receives lead directly on WhatsApp
        Form-->>Customer: "Network slow? Connecting you directly via WhatsApp!"
        Note over L1,API: When browser reconnects ('online' event), background worker flushes queue to DB
    end
```

---

## 3. 🛡️ Multi-Layer Security Architecture (Priority 1)

Security is the primary operational perimeter. Every request undergoes 5 defensive checks before touching PostgreSQL.

```mermaid
graph TD
    IncomingReq["Incoming HTTP Request to /api/enquiries"] --> RateLimitCheck{"1. Rate Limiting Check"}
    
    RateLimitCheck -->|Exceeded >5 in 10m| BlockRateLimit["Return HTTP 429 (Rate Limit Exceeded)"]
    RateLimitCheck -->|Pass| SizeCheck{"2. Payload Size Check"}
    
    SizeCheck -->|>15 KB| BlockSize["Return HTTP 413 (Payload Too Large)"]
    SizeCheck -->|Pass| HoneypotCheck{"3. Honeypot Bot Trap"}
    
    HoneypotCheck -->|hpField Filled by Bot| SilentDiscard["Return HTTP 200 OK (Silent Discard, Zero DB Write)"]
    HoneypotCheck -->|Empty Real Human| XSSFilter["4. XSS & Control Character Sanitization"]
    
    XSSFilter --> ZodValidation{"5. Zod Schema Validation"}
    ZodValidation -->|Malformed Data| BlockValidation["Return HTTP 400 (Validation Error)"]
    ZodValidation -->|Valid| DBWrite["6. Parameterized DB Insert (Zero SQLi Risk)"]
    
    style BlockRateLimit fill:#FEE2E2,stroke:#DC2626,color:#991B1B
    style BlockSize fill:#FEE2E2,stroke:#DC2626,color:#991B1B
    style SilentDiscard fill:#FEF3C7,stroke:#D97706,color:#78350F
    style BlockValidation fill:#FEE2E2,stroke:#DC2626,color:#991B1B
    style DBWrite fill:#D1FAE5,stroke:#059669,color:#065F46
```

### Security Defenses Detailed

| Defense Mechanism | Implementation Detail | Attack Vector Prevented |
| :--- | :--- | :--- |
| **Sliding-Window Rate Limiter** | Max 5 requests per 10 minutes per client IP with automatic stale-memory garbage collection every 10m. | Spam bot form floods, Denial of Service (DoS), and fake lead bombing. |
| **Invisible Honeypot Bot Trap** | Invisible input `hpField` rendered off-screen with `aria-hidden="true" tabIndex={-1}`. Automated crawlers fill all fields; humans do not. | Automated spam bots & scraper tools. |
| **XSS & Injection Sanitization** | Regex-based HTML tag stripping (`/<[^>]*>?/gm`), javascript: protocol elimination, and non-printable control character removal (`[\x00-\x1F\x7F]`). | Cross-Site Scripting (XSS), script injection in CRM dashboards. |
| **Phone Number Normalization** | Strict digit extraction (`/[^\d+]/g`) ensuring clean international standard phone numbers. | Buffer overflow attempts, SQL injection payloads in phone fields. |
| **Payload Size Ceiling** | Request payload verified against 15 KB limit. | Memory exhaustion via oversized JSON blobs. |
| **Information Shielding** | Server-side stack traces logged internally; client receives sanitized error messages (`{ error: 'Database error' }`). | Infrastructure footprinting & information leakage. |

---

## 4. ⚡ Edge Cases & Failure Recovery Matrix

```mermaid
graph TD
    subgraph EdgeCaseScenarios ["Edge Case Scenarios & Automated Resolution"]
        E1["Edge Case 1: Spotty 2G/3G in Kashmir"] --> S1["4-second AbortController triggers direct WhatsApp launch. Lead kept in localStorage."]
        E2["Edge Case 2: Offline on Remote Flight/Road"] --> S2["Lead queued in localStorage. Auto-syncs via window.online event listener."]
        E3["Edge Case 3: Double-Click on Submit"] --> S3["Button immediately disables; isSubmitting state prevents duplicate API calls."]
        E4["Edge Case 4: International Numbers"] --> S4["Regex allows +CountryCode with length 7-20 chars. Cleans formatting dashes/spaces."]
        E5["Edge Case 5: LocalStorage Full or Disabled"] --> S5["Try/catch wraps storage calls. Gracefully falls back directly to API & WhatsApp."]
        E6["Edge Case 6: Local PostgreSQL Stopped"] --> S6["API catches error. Layer 3 immediately routes lead to WhatsApp. Zero loss."]
    end

    style S1 fill:#EFF6FF,stroke:#2563EB,color:#1E40AF
    style S2 fill:#EFF6FF,stroke:#2563EB,color:#1E40AF
    style S3 fill:#EFF6FF,stroke:#2563EB,color:#1E40AF
    style S4 fill:#EFF6FF,stroke:#2563EB,color:#1E40AF
    style S5 fill:#EFF6FF,stroke:#2563EB,color:#1E40AF
    style S6 fill:#EFF6FF,stroke:#2563EB,color:#1E40AF
```

### Complete Edge Cases Matrix

| Edge Case Scenario | Trigger Condition | System Behavior & Mitigation | Result |
| :--- | :--- | :--- | :--- |
| **Slow 3G/2G Network** | Network latency > 4,000 ms | `AbortController` terminates hanging request at 4s. Lead remains in `tiwc_pending_leads`. WhatsApp deep link opens immediately. | **Zero Lead Loss.** Sales team contacted on WhatsApp; DB syncs later. |
| **Total Offline Mode** | `navigator.onLine === false` | Synchronously saves lead to `localStorage`. Bypasses failed fetch attempt. Opens WhatsApp. Registers background `online` event. | **Zero Lead Loss.** Lead flushes to PostgreSQL on reconnect. |
| **Rapid Double Click** | User taps submit button 2+ times in 1s | `isSubmitting` state locks submit button, displays spinner *"Securing Your Enquiry..."*, and rejects duplicate invocations. | **Zero Duplicate Records.** Clean database hygiene. |
| **LocalStorage Inaccessible** | Private browsing mode / quota reached | `try/catch` safety blocks ensure JavaScript execution never halts; form proceeds to API and WhatsApp without interruption. | **Unbreakable UI.** No client-side crashes. |
| **Bot Scraping Campaign** | Automated script posts to `/api/enquiries` | Rate limiter blocks after 5 requests (HTTP 429). Honeypot catches bot submissions and silently returns HTTP 200 without DB writes. | **Clean CRM.** Zero spam leads in database. |
| **Local Database Down** | PostgreSQL service stopped or restarted | API returns HTTP 500. Form error boundary catches response. WhatsApp opens directly with pre-composed inquiry. | **Human Fallback Active.** Lead received by specialist. |

---

## 5. Database Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    ENQUIRY {
        string id PK "UUID"
        string name "Customer Full Name (Sanitized)"
        string phone "WhatsApp / Contact Number (Indexed, Normalized)"
        string email "Optional Email Address"
        string travelDate "Tentative Month / Date"
        string guests "Traveller Count (e.g. 2-4 Guests)"
        string tripType "Kashmir Classic, Honeymoon, Luxury, etc."
        string message "Special Requests or Custom Preferences (Sanitized)"
        string source "Origin: website_inline, global_modal, etc."
        string status "Enum: NEW, CONTACTED, QUOTED, WON, LOST (Indexed)"
        string utmSource "Ad Source (e.g. google_ads, meta, instagram)"
        string utmMedium "Ad Medium (cpc, paid_social, reel)"
        string utmCampaign "Campaign Name (e.g. kashmir_honeymoon_2025)"
        string utmTerm "Search Keyword"
        string utmContent "Ad Creative / Ad ID"
        string gclid "Google Click Identifier"
        string fbclid "Meta Click Identifier"
        string referrer "Original HTTP Referrer URL"
        string ipAddress "Client IP Address (for Abuse Prevention)"
        string userAgent "Client Browser & Device Info"
        datetime createdAt "Timestamp (Indexed)"
        datetime updatedAt "Timestamp"
    }
```

---

## 6. Attribution & UTM Tracking Lifecycle

```mermaid
graph LR
    subgraph AdSources ["1. Paid Campaign Ingress"]
        GAds["Google Search Ads (gclid, utm_source=google)"]
        MAds["Meta / Instagram Ads (fbclid, utm_source=meta)"]
        Direct["Direct / Organic / SEO"]
    end

    subgraph CaptureSession ["2. Ingress & Session Persistence"]
        Landing["User Lands on Any Page"]
        ReadParams["initAttribution() reads URL query string"]
        SessionStore["sessionStorage ('tiwc_attribution')"]
        GAds --> Landing
        MAds --> Landing
        Direct --> Landing
        Landing --> ReadParams
        ReadParams --> SessionStore
    end

    subgraph MultiPage ["3. Multi-Page Exploration"]
        SessionStore --> Page1["Navigates to /packages"]
        Page1 --> Page2["Navigates to /destinations/gulmarg"]
        Page2 --> TriggerForm["Opens Enquiry Modal / Fills Form"]
    end

    subgraph LeadBind ["4. Lead Association"]
        TriggerForm --> ReadAttribution["getAttributionData() retrieves preserved UTM tags"]
        ReadAttribution --> SavePayload["Payload includes original Ad & Keyword tags"]
        SavePayload --> DatabaseRecord[("Stored in PostgreSQL with Full Attribution")]
    end
```

---

## 7. 🧪 Testing & Automated Verification Matrix

```mermaid
graph LR
    subgraph VerificationSuite ["Test Execution Flow"]
        T1["Test 1: Happy Path Lead Ingestion"] --> V1["Verify 201 Created + DB Record"]
        T2["Test 2: Honeypot Bot Trap"] --> V2["Verify 200 OK + Zero DB Write"]
        T3["Test 3: Rate Limiter Threshold"] --> V3["Verify HTTP 429 on 6th Request"]
        T4["Test 4: XSS Tag Stripping"] --> V4["Verify Script Tags Removed from Name"]
        T5["Test 5: Offline Sync Flush"] --> V5["Verify LocalStorage Queue pushes on Online Event"]
    end

    style V1 fill:#D1FAE5,stroke:#059669,color:#065F46
    style V2 fill:#D1FAE5,stroke:#059669,color:#065F46
    style V3 fill:#D1FAE5,stroke:#059669,color:#065F46
    style V4 fill:#D1FAE5,stroke:#059669,color:#065F46
    style V5 fill:#D1FAE5,stroke:#059669,color:#065F46
```

---

## 8. Technical File Mapping

| Component | File Path | Purpose & Security Responsibility |
| :--- | :--- | :--- |
| **Prisma Schema** | [`prisma/schema.prisma`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/prisma/schema.prisma) | PostgreSQL datasource, `Enquiry` model, and `EnquiryStatus` enum. |
| **Prisma Config** | [`prisma.config.ts`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/prisma.config.ts) | Prisma 7 configuration file mapping PostgreSQL datasource URL. |
| **DB Singleton** | [`src/lib/database/prisma.ts`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/lib/database/prisma.ts) | Next.js development-safe PrismaClient preventing pool exhaustion. |
| **Rate Limiter** | [`src/lib/security/rate-limit.ts`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/lib/security/rate-limit.ts) | In-memory sliding window rate limiter (5 req/10 min). |
| **Zod Sanitizer** | [`src/lib/validations/enquiry.ts`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/lib/validations/enquiry.ts) | XSS tag stripping, phone sanitization, and honeypot validation. |
| **Attribution Utility** | [`src/lib/utilities/attribution.ts`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/lib/utilities/attribution.ts) | Extracts UTM, GCLID, FBCLID from URL into `sessionStorage`. |
| **Offline Resilience** | [`src/lib/utilities/offline-queue.ts`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/lib/utilities/offline-queue.ts) | Layer 1 `localStorage` queue + background auto-sync on `window.online`. |
| **Analytics Engine** | [`src/lib/utilities/analytics.ts`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/lib/utilities/analytics.ts) | Custom event tracking for GA4 and Microsoft Clarity. |
| **Analytics Scripts** | [`src/components/analytics/AnalyticsScripts.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/analytics/AnalyticsScripts.tsx) | Script tags for GA4/Clarity + lifecycle event listeners in `layout.tsx`. |
| **API Route** | [`src/app/api/enquiries/route.ts`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/app/api/enquiries/route.ts) | `POST` endpoint with rate limiting, honeypot trap, and PostgreSQL write. |
| **Enquiry Form** | [`src/components/forms/EnquiryForm.tsx`](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/the-indian-wings-company/src/components/forms/EnquiryForm.tsx) | 3-Layer resilience UI, double-click lock, and invisible honeypot field. |
