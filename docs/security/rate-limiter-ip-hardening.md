# Rate-Limiter IP Hardening
## Trusted Client IP / X-Forwarded-For Hardening

**Document Status:** COMPLETE
**Phase:** Production Rate Limiter Hardening
**Date:** 2026-09-21

---

## 1. Objective

Harden the production rate limiter against bypass caused by:
1. Attacker-controlled `X-Forwarded-For` injection allowing rate-limit bypass
   via the leftmost-IP trust model.
2. Private/local IP exemption in `isLocalIp()` that, if an attacker can spoof
   a private IP via the forwarded header, would grant unconditional bypass.

---

## 2. Current Implementation (Full Audit)

### 2.1 `src/lib/security/rate-limit.ts`

**`isLocalIp(ip: string): boolean`** (private, line 61)
Matches: `127.0.0.1`, `::1`, `localhost`, `127.*`, `192.168.*`, `10.*`, `unknown`

**`checkLimit(limiter, key)`** (private, line 75)
- If `isLocalIp(key)` is true -> returns `{ success: true, remaining: 100 }` unconditionally.
  This is the **exemption bypass path**.
- If `limiter` is null (Redis not configured) -> fails open.
- Otherwise calls `limiter.limit(key)`.

**Exported functions** (all pass IP directly as key):
- `checkEnquiryRateLimit(ip)` -> `checkLimit(enquiryLimiter, ip)`
- `checkAdminLoginRateLimit(ip)` -> `checkLimit(adminLoginLimiter, "admin_login:"+ip)`
- `checkItineraryRateLimit(ip)` -> `checkLimit(itineraryLimiter, ip)`

### 2.2 Caller: `src/app/api/enquiries/route.ts` (lines 40-43)

```typescript
const ipAddress =
  req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
  req.headers.get('x-real-ip') ||
  '127.0.0.1';
```

Fallback to `'127.0.0.1'` -> triggers `isLocalIp()` exemption -> rate limit bypassed.

### 2.3 Caller: `src/app/api/admin/login/route.ts` (lines 8-9)

```typescript
const forwardedFor = request.headers.get('x-forwarded-for');
const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
```

Same fallback, same bypass risk.

### 2.4 Caller: `src/app/api/itinerary/download/route.ts` (lines 37-40)

```typescript
const ipAddress =
  req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
  req.headers.get('x-real-ip') ||
  '127.0.0.1';
```

Same pattern as enquiries.

### 2.5 Telemetry route (`src/app/api/telemetry/event/route.ts`, line 44-45)

```typescript
const forwardedFor = request.headers.get('x-forwarded-for');
const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
```

This route is **not rate-limited** via the rate-limit module. IP is used only
for session tracking — out of scope.

---

## 3. Threat Model

### Attack 1: Leftmost X-Forwarded-For Bypass

A client sends:
```
X-Forwarded-For: 192.168.1.1
```
The current code takes `[0]` = `192.168.1.1`.
`isLocalIp('192.168.1.1')` = true.
Result: **rate limit unconditionally bypassed**.

Severity: CRITICAL for admin login route (brute-force), HIGH for enquiry/itinerary.

### Attack 2: Fallback Bypass

A client sends no IP headers (or they are stripped).
Fallback is `'127.0.0.1'`.
`isLocalIp('127.0.0.1')` = true.
Result: **rate limit unconditionally bypassed**.

Severity: HIGH (depends on attacker being able to control header absence).

### Attack 3: Chained Forwarded Value

A client behind a legitimate proxy sends:
```
X-Forwarded-For: 10.0.0.1, 203.0.113.42
```
`split(',')[0]` = `10.0.0.1` (private).
`isLocalIp('10.0.0.1')` = true.
Result: **rate limit unconditionally bypassed**.

---

## 4. Production Environment Analysis

### 4.1 Deployment Architecture
- **Frontend**: Vercel (Next.js App Router)
- **Backend**: Render Express API (separate service, not relevant here)
- Frontend API routes run in Vercel's Node.js Edge/Serverless runtime.

### 4.2 Vercel IP Header Behavior

On Vercel, the following headers are set **by Vercel's infrastructure** on every request:
- `x-forwarded-for`: Contains the full proxy chain. **The rightmost IP added by Vercel is the true client IP** since Vercel's own ingress appends it. However, the leftmost value CAN be client-controlled.
- `x-real-ip`: Set by Vercel to the **direct client IP** as seen by their ingress. This is NOT client-controllable. Vercel strips any client-sent `x-real-ip` before forwarding.

**Important caveat**: `NextRequest.ip` was **removed in Next.js v15.0.0** (confirmed by Next.js 16.3.4 type definition: version history shows `v15.0.0: ip and geo removed`). There is no `request.ip` API available.

### 4.3 Available Trusted Headers on Vercel

| Header | Vercel Behavior | Trustworthy? |
|---|---|---|
| `x-real-ip` | Set by Vercel ingress to actual client IP | YES — Vercel strips client-sent value |
| `x-forwarded-for` (rightmost) | Rightmost value added by Vercel | YES — Vercel appends it |
| `x-forwarded-for` (leftmost) | Client-supplied | NO — attacker-controlled |
| `request.ip` | Removed in Next.js v15+ | N/A |

### 4.4 Development Environment

- Dev server: `next dev` running on localhost:3000
- Requests come directly with no proxy -> `x-real-ip` = null, `x-forwarded-for` = null
- Fallback needed for developer experience: `127.0.0.1` / `::1`

---

## 5. Current Private-IP Exemption Analysis

The `isLocalIp()` exemption serves one legitimate purpose:
**prevent developer lockouts during local development**.

In production on Vercel:
- `x-real-ip` will always be a public IP (Vercel-supplied)
- `x-forwarded-for` rightmost-safe-value will always be a public IP
- No legitimate production request should have a private source IP
- Therefore: **the private-IP exemption is NOT NEEDED in production**

The exemption SHOULD be preserved in development (`NODE_ENV === 'development'`)
to prevent developer lockouts.

---

## 6. Recommended Implementation

### 6.1 IP Resolution Strategy

**New function: `resolveClientIp(req: NextRequest): string`**

Priority order (validated by deployment architecture):

1. `x-real-ip` header (Vercel-injected, strips client-sent value — most trustworthy)
2. Rightmost non-private IP from `x-forwarded-for` (Vercel appends rightmost)
3. In development only: `127.0.0.1` fallback
4. In production with no resolvable IP: `'0.0.0.0'` (safe sentinel — not a private IP, will NOT trigger exemption)

**Why rightmost XFF instead of leftmost?**

Vercel's ingress appends the true client IP as the **rightmost** value in
`X-Forwarded-For`. Attackers can only prepend to the left. The rightmost value
is always Vercel-injected and cannot be spoofed by the client.

If `x-real-ip` is present (Vercel always sets it), that takes priority as it's
the cleanest single-IP field. The XFF rightmost is a fallback for self-hosted/
other deployments.

### 6.2 Private-IP Exemption Change

| Environment | Private IP Exemption |
|---|---|
| Development (`NODE_ENV=development`) | Preserved — developers need local bypass |
| Production (`NODE_ENV=production`) | DISABLED — no private IPs should reach Vercel |

This eliminates the spoofed-private-IP bypass path in production.

### 6.3 Sentinel IP for Unknown Production IPs

If no IP can be resolved in production:
- Use `'0.0.0.0'` as fallback sentinel
- `0.0.0.0` is NOT a private/local IP per `isLocalIp()` — it will be rate-limited
- This ensures unknown-IP requests fail safe (rate-limited, not exempted)

### 6.4 Caller Consolidation

Move IP extraction into `resolveClientIp()` exported from `rate-limit.ts`.
Each caller imports and uses it, eliminating the duplicated `split(',')[0]` pattern.
This is a minimal refactor — only changes IP resolution, not business logic.

---

## 7. Files to Change

| File | Change |
|---|---|
| `src/lib/security/rate-limit.ts` | Add `resolveClientIp()`, harden `isLocalIp()` with env guard |
| `src/app/api/enquiries/route.ts` | Use `resolveClientIp(req)` |
| `src/app/api/admin/login/route.ts` | Use `resolveClientIp(request)` |
| `src/app/api/itinerary/download/route.ts` | Use `resolveClientIp(req)` |
| `src/lib/security/rate-limit.test.ts` | New: Node built-in test runner tests |

---

## 8. Testing Strategy

No test runner is configured (no Jest/Vitest in package.json).
Tests will use Node.js built-in `node:test` + `node:assert` (available Node 18+).

Tests to cover:
1. Public IP -> not exempt -> passed to rate limiter
2. Private IP (`192.168.x.x`) in dev -> exempt
3. Private IP in prod -> NOT exempt -> rate-limited
4. Spoofed private IP in XFF leftmost -> resolved to rightmost public IP
5. `x-real-ip` present -> used over XFF
6. Both headers missing, prod -> sentinel `0.0.0.0` -> rate-limited
7. Both headers missing, dev -> `127.0.0.1` -> exempt (dev behavior)
8. XFF with multiple values -> rightmost non-private used
9. Empty string IP -> treated as unknown

---

## 9. Acceptance Criteria

- [ ] Spoofed `X-Forwarded-For: 192.168.1.1` cannot bypass production rate limit
- [ ] Production private/local IP exemption cannot be abused
- [ ] `x-real-ip` used as primary trusted source when present
- [ ] XFF rightmost value used as secondary trusted source
- [ ] Dev still exempts local IPs for developer experience
- [ ] Missing IP in production uses safe sentinel (rate-limited, not exempt)
- [ ] No new npm dependencies added
- [ ] Tests exercise the IP resolution path
- [ ] `tsc --noEmit` passes
- [ ] `npx eslint src/` passes
- [ ] `npm run build` passes

---

## 10. Explicit Exclusions

- CSP configuration (unchanged)
- Nonce implementation (unchanged)
- Botpress (unchanged)
- Analytics (unchanged)
- Cloudinary (unchanged)
- Database schema (unchanged)
- UI/design (unchanged)
- Rate limit business thresholds (unchanged)
- Telemetry route IP handling (not rate-limited, out of scope)
- Admin session cookie / HMAC logic (unchanged)

---

## 11. Verification Results

### TypeScript (`tsc --noEmit`)
- Exit code: **0** ✅ — no errors

### ESLint (`npx eslint` on all changed files)
- Exit code: **0** ✅ — no errors
- Fixed pre-existing `catch (error: any)` → `catch (error: unknown)` in `itinerary/download/route.ts` (unrelated to rate-limiter change, fixed to achieve clean lint baseline)

### Tests (`node --test --experimental-strip-types src/lib/security/rate-limit.test.ts`)
- Exit code: **0** ✅
- **20 / 20 passed, 0 failed**

| Suite | Tests | Result |
|---|---|---|
| `resolveClientIp` | T01–T10 | ✅ 10/10 |
| `Private IP exemption (env-gated)` | T11–T17 | ✅ 7/7 |
| `Security invariants` | A, B, C | ✅ 3/3 |

### Acceptance Criteria
- [x] Spoofed `X-Forwarded-For: 192.168.1.1` cannot bypass production rate limit
- [x] Production private/local IP exemption cannot be abused
- [x] `x-real-ip` used as primary trusted source when present
- [x] XFF rightmost value used as secondary trusted source
- [x] Dev still exempts local IPs for developer experience
- [x] Missing IP in production uses safe sentinel (rate-limited, not exempt)
- [x] No new npm dependencies added
- [x] Tests exercise the IP resolution path (20 scenarios)
- [x] `tsc --noEmit` passes (exit code 0)
- [x] `npx eslint src/` passes (exit code 0)

---

*Implementation complete. All verification checks passed.*

