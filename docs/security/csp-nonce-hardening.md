# Content Security Policy (CSP) Nonce Hardening Specification

**Project:** The Indian Wings Company  
**Target:** Next.js 16.3.4 (App Router) + React 19.2.8  
**Document Version:** 1.0.0  
**Status:** In Progress (Audit & Architecture Phase)  

---

## 1. Current CSP Implementation

Prior to this hardening phase, the Content Security Policy was statically configured in `next.config.ts` via the `headers()` async hook:

```text
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://cdn.botpress.cloud https://files.bpcontent.cloud https://*.botpress.cloud;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.botpress.cloud;
  img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://www.clarity.ms https://*.clarity.ms https://*.google-analytics.com https://*.botpress.cloud https://files.bpcontent.cloud;
  font-src 'self' https://fonts.gstatic.com data:;
  media-src 'self' blob: https://res.cloudinary.com;
  connect-src 'self' https://*.onrender.com http://localhost:3001 http://127.0.0.1:3001 https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://www.clarity.ms https://*.clarity.ms https://res.cloudinary.com https://*.botpress.cloud https://files.bpcontent.cloud wss://*.botpress.cloud;
  frame-src 'self' https://*.botpress.cloud;
  frame-ancestors 'self';
  form-action 'self';
  base-uri 'self';
```

---

## 2. Why `'unsafe-inline'` Currently Exists

The `'unsafe-inline'` directive in `script-src` was present because:
1. **Next.js App Router Hydration:** Next.js injects inline bootstrap scripts (such as chunk loaders and state scripts) during SSR. Without either a nonce or `'unsafe-inline'`, the browser blocks Next.js hydration.
2. **Inline Analytics Scripts:** `AnalyticsScripts.tsx` renders inline script bodies via `next/script` for Google Analytics initialization (`window.dataLayer = ...; gtag(...)`) and Microsoft Clarity tracking snippet `(function(c,l,a,r,i,t,y){ ... })(window, document, "clarity", ...)`.
3. **Static Config Limitation:** Because `next.config.ts` runs at build time, it cannot generate a cryptographically random, per-request nonce. Setting CSP solely in `next.config.ts` forced the use of `'unsafe-inline'`.

---

## 3. Discovered Inline Scripts and Styles

| File | Type | Tag / Directive | Purpose | Nonce Required? |
| :--- | :--- | :--- | :--- | :--- |
| `src/components/analytics/AnalyticsScripts.tsx` | Inline Script | `<Script id="google-analytics">` | Initializes GA4 `dataLayer` and `gtag('config')` | **Yes (`nonce={nonce}`)** |
| `src/components/analytics/AnalyticsScripts.tsx` | Inline Script | `<Script id="microsoft-clarity">` | Inlines Clarity loader bootstrap function | **Yes (`nonce={nonce}`)** |
| `src/components/chat/BotpressChatbot.tsx` | Dynamic Script | `document.createElement('script')` | Loads Botpress Webchat config JS from CDN | **Yes (attach `nonce`)** |
| `src/app/page.tsx` | JSON-LD Script | `<script type="application/ld+json">` | Schema.org organization & website metadata | **Yes (`nonce={nonce}`)** |
| `src/app/packages/[slug]/page.tsx` | JSON-LD Script | `<script type="application/ld+json">` | Tour package schema | **Yes (`nonce={nonce}`)** |
| `src/app/destinations/[slug]/page.tsx` | JSON-LD Script | `<script type="application/ld+json">` | Destination guide schema | **Yes (`nonce={nonce}`)** |
| `src/app/blog/page.tsx` | JSON-LD Script | `<script type="application/ld+json">` | Blog collection schema | **Yes (`nonce={nonce}`)** |
| `src/app/blog/[slug]/page.tsx` | JSON-LD Script | `<script type="application/ld+json">` | Blog posting schema | **Yes (`nonce={nonce}`)** |
| `src/app/about-us/page.tsx` | JSON-LD Script | `<script type="application/ld+json">` | About Us / local business schema | **Yes (`nonce={nonce}`)** |
| `src/components/chat/BotpressChatbot.tsx` | Inline Style | `<style dangerouslySetInnerHTML=...>` | Overrides Botpress floating widget bottom/right position | Governed by `style-src` |
| `src/app/layout.tsx` | Inline Style Attribute | `<html style={{ '--color-midnight': ... }}>` | Applies core brand CSS custom properties | Governed by `style-src` |
| Framer Motion components | Dynamic Style Attribute | `style={{ transform: ... }}` | Interactive animations & transitions | Governed by `style-src` |

---

## 4. Third-Party Integrations Dependency Map

| Integration | Script / Style Origin | Current CSP Directive | Nonce Handling Strategy |
| :--- | :--- | :--- | :--- |
| **Next.js 16 Runtime** | `self`, `_next/static/chunks/*.js` | `script-src 'self' 'unsafe-inline'` | Next.js automatically detects `'nonce-{nonce}'` in `Content-Security-Policy` and `x-nonce` request header, applying it to all internal scripts and chunks. |
| **Google Tag Manager / GA4** | `https://www.googletagmanager.com`, `https://www.google-analytics.com` | `script-src ... https://www.googletagmanager.com` | External loader `<Script src="..." nonce={nonce}>` + inline config `<Script id="google-analytics" nonce={nonce}>`. |
| **Microsoft Clarity** | `https://www.clarity.ms`, `https://*.clarity.ms` | `script-src ... https://www.clarity.ms https://*.clarity.ms` | Inline loader `<Script id="microsoft-clarity" nonce={nonce}>` executes and appends script; origin is in `script-src`. |
| **Botpress Webchat v5.0** | `https://cdn.botpress.cloud`, `https://files.bpcontent.cloud`, `https://*.botpress.cloud` | `script-src ... https://cdn.botpress.cloud https://files.bpcontent.cloud https://*.botpress.cloud` | Loader script `<Script id="botpress-webchat-inject" nonce={nonce}>` loads; child config script appended in `onLoad` receives `nonce`. |
| **Google Fonts** | `https://fonts.googleapis.com`, `https://fonts.gstatic.com` | `style-src ... https://fonts.googleapis.com`, `font-src ... https://fonts.gstatic.com` | Standard CDN stylesheet and font fetch; unchanged. |
| **Cloudinary** | `https://res.cloudinary.com` | `img-src ... https://res.cloudinary.com`, `media-src ... https://res.cloudinary.com` | Media/Image assets; no script execution. |
| **Render API** | `https://*.onrender.com` | `connect-src ... https://*.onrender.com` | REST API connectivity; no script execution. |

---

## 5. Nonce Strategy

1. **Cryptographic Randomness:** The nonce is generated using Node.js / Web Crypto API:
   ```ts
   const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
   ```
   This generates a 128-bit cryptographically strong, URL-safe base64 string that is statistically impossible to predict.
2. **Per-Request Freshness:** A new nonce is generated on **every single incoming HTTP request**. Nonces are never cached, persisted, reused, or shared across requests.
3. **No Static Fallback:** If a request arrives without a nonce, middleware creates one immediately. No static or hardcoded fallback token is ever accepted.
4. **Removal of `'unsafe-inline'`:** In production, `script-src` contains:
   `'self' 'nonce-${nonce}' <trusted-domains>`
   and **omits `'unsafe-inline'` completely**.

---

## 6. Middleware and Request Lifecycle

```text
[ Incoming Request ]
         │
         ▼
[ src/middleware.ts ]
   1. Generate unique nonce: Buffer.from(crypto.randomUUID()).toString('base64')
   2. Determine environment (process.env.NODE_ENV === 'development')
   3. Construct dynamic Content-Security-Policy header with 'nonce-${nonce}'
   4. Set request header: requestHeaders.set('x-nonce', nonce)
   5. Set request header: requestHeaders.set('Content-Security-Policy', csp)
   6. Check Admin subdomain / session auth (existing security logic preserved)
   7. Invoke NextResponse.next({ request: { headers: requestHeaders } })
   8. Set response header: response.headers.set('Content-Security-Policy', csp)
         │
         ▼
[ Next.js SSR / Server Components ]
   - Next.js detects CSP nonce from x-nonce / Content-Security-Policy
   - Next.js stamps nonce on all <script> chunks and inline hydration scripts
   - RootLayout reads (await headers()).get('x-nonce')
         │
         ▼
[ RootLayout / Components ]
   - Passes nonce to <AnalyticsScripts nonce={nonce} />
   - Passes nonce to <PublicShell nonce={nonce} /> -> <BotpressChatbot nonce={nonce} />
   - Pages pass nonce to <script type="application/ld+json" nonce={nonce}>
         │
         ▼
[ Browser Execution ]
   - Browser enforces Content-Security-Policy:
     - Scripts with matching nonce execute.
     - Whitelisted external origins execute.
     - Un-nonced inline scripts (including injected XSS payloads) are BLOCKED.
```

---

## 7. How the Nonce Reaches Next.js Components

In Next.js App Router (Next.js 16 / React 19):
1. In `src/middleware.ts`, the nonce is forwarded on the request headers: `requestHeaders.set('x-nonce', nonce)`.
2. In Server Components, `next/headers` provides asynchronous access to incoming request headers:
   ```tsx
   import { headers } from 'next/headers';

   export default async function RootLayout({ children }: { children: React.ReactNode }) {
     const headersList = await headers();
     const nonce = headersList.get('x-nonce') ?? undefined;
     ...
   }
   ```
3. `RootLayout` passes `nonce` via standard React props to client shells and script containers:
   - `<AnalyticsScripts nonce={nonce} />`
   - `<PublicShell nonce={nonce}>` -> `<BotpressChatbot nonce={nonce} />`
4. Individual page Server Components (`src/app/page.tsx`, `packages/[slug]`, etc.) similarly read `x-nonce` and pass it to `<script type="application/ld+json" nonce={nonce}>`.

---

## 8. How Nonce is Applied to Inline Scripts

Next.js `next/script` accepts a `nonce` attribute. When passed:
```tsx
<Script id="google-analytics" strategy="afterInteractive" nonce={nonce}>
  {`...`}
</Script>
```
Next.js outputs `<script id="google-analytics" nonce="<REQUEST_NONCE>">` into the rendered HTML DOM. The browser validates that the tag's `nonce` attribute matches the `Content-Security-Policy` header and permits execution.

---

## 9. How Third-Party Scripts are Handled

External scripts from whitelisted origins:
- `https://www.googletagmanager.com`
- `https://www.google-analytics.com`
- `https://www.clarity.ms`
- `https://cdn.botpress.cloud`
- `https://files.bpcontent.cloud`
- `https://*.botpress.cloud`

Because `script-src` includes these explicit domain origins:
1. When loaded via `<Script src="https://..." nonce={nonce}>`, both domain whitelisting and the nonce permit loading.
2. When Microsoft Clarity or Botpress dynamically append `<script src="...">` elements pointing to their whitelisted CDN hosts, browsers evaluate the host origin against `script-src` and permit the request.

---

## 10. How JSON-LD Scripts are Handled

1. **Retained XSS Sanitization:** `safeJsonLd()` from `src/lib/utilities/safe-json-ld.ts` remains active on all pages, replacing `<`, `>`, `&`, `\u2028`, and `\u2029` with unicode escape sequences.
2. **Nonce Attachment:** Although `<script type="application/ld+json">` is data and not executable JavaScript in standard browsers, strict CSP evaluators and future browser implementations benefit from explicit noncing. The tag is updated to:
   ```tsx
   <script
     type="application/ld+json"
     nonce={nonce}
     dangerouslySetInnerHTML={{ __html: safeJsonLd(schemaData) }}
   />
   ```
   This guarantees compliance across all strict CSP parsers while eliminating any possibility of tag-breakout XSS.

---

## 11. Development Behavior

In local development (`process.env.NODE_ENV === 'development'`):
- React 19 / Next.js Fast Refresh relies on `eval()` to reconstruct server-side error call stacks. Therefore, `'unsafe-eval'` is conditionally enabled ONLY when `NODE_ENV === 'development'`.
- Local loopback connections (`http://localhost:3001` and `http://127.0.0.1:3001`) are conditionally enabled in `connect-src` to allow local Express backend testing.

---

## 12. Production Behavior

In production (`process.env.NODE_ENV === 'production'`):
- `'unsafe-inline'` is **completely removed** from `script-src`.
- `'unsafe-eval'` is **completely omitted**.
- `localhost` and `127.0.0.1` are **completely omitted** from all directives.
- Every HTML response receives a unique `nonce` in the `Content-Security-Policy` header.

---

## 13. Style CSP Strategy

`style-src` is intentionally maintained with `'unsafe-inline'`:
```text
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.botpress.cloud
```
**Rationale:**
1. In W3C CSP Level 2 and Level 3, introducing `'nonce-...'` into `style-src` causes browsers to **ignore** `'unsafe-inline'` for style tags.
2. Inline `style="..."` attributes (used extensively by React 19, Framer Motion animations, dynamic root theme CSS variables in `layout.tsx`, and Botpress Webchat popup containers) CANNOT be nonced in HTML5.
3. Attempting to enforce a nonce on `style-src` would completely break Framer Motion layout animations, modal transitions, and dynamic branding.
4. CSS injection cannot execute arbitrary scripts, whereas script execution is completely blocked by the nonce in `script-src`.

---

## 14. CSP Fallback / Rollback Strategy

1. If any downstream service fails to load due to CSP restrictions, `middleware.ts` centralizes all policy declarations, allowing surgical domain additions without touching component code.
2. `next.config.ts` will no longer duplicate `Content-Security-Policy`, preventing header collision and policy conflicts. Other security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, etc.) remain intact in `next.config.ts`.
3. If an emergency rollback is ever required, `next.config.ts` can be temporarily restored, but our testing ensures clean operation with nonces.

---

## 15. Testing & Verification Plan

1. **Compilation & Type Checking:** Run `npx tsc --noEmit` to verify type safety of async `headers()` and `nonce` prop passing.
2. **Linting:** Run `npm run lint` to confirm zero ESLint violations.
3. **Production Build:** Run `npm run build` to confirm Next.js build succeeds with dynamic rendering and nonces.
4. **Header Verification:** Inspect HTTP response headers via curl / automated tests:
   - Verify `Content-Security-Policy` header is present.
   - Verify `script-src` includes `'nonce-<RANDOM_STRING>'`.
   - Verify `script-src` does NOT contain `'unsafe-inline'`.
   - Verify production CSP does NOT contain `localhost` or `127.0.0.1`.
   - Verify consecutive requests yield different, unique nonces.
5. **Runtime QA:**
   - Verify Homepage, Packages, Destinations, Blog, About, Contact/Enquiry modal.
   - Verify Botpress Webchat loads, displays widget, and opens conversation.
   - Verify no CSP console errors or hydration mismatches.

---

## 16. Acceptance Criteria

- [ ] `script-src` no longer contains `'unsafe-inline'` in production.
- [ ] Production requests receive a unique, unguessable nonce on every request.
- [ ] Next.js framework scripts and hydration bundles execute cleanly.
- [ ] Botpress Webchat v5.0 initializes and operates properly.
- [ ] Google Analytics and Microsoft Clarity scripts load cleanly when configured.
- [ ] JSON-LD structured data remains protected by `safeJsonLd()`.
- [ ] Local development continues to function with local backend origins.
- [ ] Local loopback origins (`localhost`, `127.0.0.1`) are absent from production CSP.
- [ ] `npx tsc --noEmit`, `npm run lint`, and `npm run build` pass with 0 errors.
- [ ] Browser QA passes without CSP violations or hydration failures.
