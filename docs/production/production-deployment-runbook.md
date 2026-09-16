# Production Deployment Runbook — The Indian Wings Company

This runbook details the production launch procedure for **The Indian Wings Company** across GoDaddy, Vercel, Render, Neon, and Upstash.

---

## 1. Infrastructure Overview

```
                      [ GoDaddy DNS ]
                       theindianwings.com
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
      [ Vercel ]                        [ Render ]
   Next.js 16 Frontend            Express Node.js REST API
 (https://theindianwings.com)    (https://tiwc-api.onrender.com)
            │                                 │
            │                         ┌───────┴───────┐
            │                         ▼               ▼
            │                   [ Neon DB ]    [ Upstash Redis ]
            │                  PostgreSQL 16    Distributed Rate
            │                  Pooled (pgbouncer)   Limiting
            │                         │
            └─────────────────────────┘
```

---

## 2. Step-by-Step Deployment Guide

### Phase 1: Database Setup (Neon PostgreSQL)
1. Sign in to [Neon Console](https://console.neon.tech).
2. Create project `the-indian-wings-company-prod`.
3. Copy the **Pooled Connection String** (format `postgresql://...@ep-...-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`).
4. Apply the Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Phase 2: Distributed Rate Limiting (Upstash Redis)
1. Sign in to [Upstash Console](https://console.upstash.com).
2. Create a Redis database: `the-indian-wings-redis-prod` in the closest region to your Neon DB.
3. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### Phase 3: Backend API Deployment (Render)
1. Sign in to [Render Console](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect the repository and select the **Root Directory**: `backend`.
4. Configure Build & Start settings:
   - **Environment**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
   - **Auto-Deploy**: Yes (on main branch push)
5. Set the Environment Variables in Render:
   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://... (from Neon)
   UPSTASH_REDIS_REST_URL=https://... (from Upstash)
   UPSTASH_REDIS_REST_TOKEN=... (from Upstash)
   ADMIN_PASSWORD=your-strong-production-admin-password
   ADMIN_SECRET_KEY=at-least-32-chars-cryptographic-random-secret
   ADMIN_API_SECRET=random-internal-bearer-token
   FRONTEND_ORIGIN=https://theindianwings.com
   NEXT_PUBLIC_SITE_URL=https://theindianwings.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=info@theindianwingscompany.com
   SMTP_PASS=your-google-app-password
   SMTP_FROM="The Indian Wings Company" <info@theindianwingscompany.com>
   ```
6. Deploy and verify health check:
   ```bash
   curl -I https://tiwc-api.onrender.com/health
   # Returns: HTTP/2 200 {"status":"ok","db":"connected",...}
   ```

### Phase 4: Frontend Deployment (Vercel)
1. Import repository in [Vercel](https://vercel.com).
2. Select framework preset: **Next.js**.
3. Set the Environment Variables:
   ```env
   NEXT_PUBLIC_SITE_URL=https://theindianwings.com
   NEXT_PUBLIC_BACKEND_URL=https://tiwc-api.onrender.com
   DATABASE_URL=postgresql://... (same Neon connection for fallback/SSR)
   ADMIN_PASSWORD=your-strong-production-admin-password
   ADMIN_SECRET_KEY=at-least-32-chars-cryptographic-random-secret
   ADMIN_API_SECRET=random-internal-bearer-token
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX (optional)
   NEXT_PUBLIC_CLARITY_ID=XXXXXXXXXX (optional)
   ```
4. Deploy project.

### Phase 5: Domain & DNS Configuration (GoDaddy)
1. In GoDaddy DNS Management for `theindianwings.com`:
   - **A Record**:
     - Host: `@`
     - Points to: `76.76.21.21` (Vercel Anycast IP)
     - TTL: `600 seconds`
   - **CNAME Record**:
     - Host: `www`
     - Points to: `cname.vercel-dns.com`
     - TTL: `600 seconds`
2. Optional API Subdomain (Alternative to `.onrender.com`):
   - In Render Web Service settings, add custom domain `api.theindianwings.com`.
   - In GoDaddy:
     - **CNAME Record**:
       - Host: `api`
       - Points to: Render verification target
       - TTL: `600 seconds`

---

## 3. Post-Launch Smoke Test Checklist

- [ ] `https://theindianwings.com` loads with HTTP 200 and SSL certificate
- [ ] Homepage hero video streams smoothly via Cloudinary CDN
- [ ] Tour packages load and filter across categories (Featured, Honeymoon, Family, Winter)
- [ ] Enquiry Modal submits successfully and displays success confirmation
- [ ] Rate limiting triggers HTTP 429 when enquiry submission exceeds 5 requests / 10 min
- [ ] Admin panel login works at `https://theindianwings.com/admin/login`
- [ ] Admin dashboard displays live lead records, session metrics, and campaign conversion rates
- [ ] Dynamic sitemap (`https://theindianwings.com/sitemap.xml`) loads valid XML with live package URLs
- [ ] Dynamic robots.txt (`https://theindianwings.com/robots.txt`) serves proper crawl instructions
