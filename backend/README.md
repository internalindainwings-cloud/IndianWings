# The Indian Wings Company — Express API Backend

This is the standalone Node.js / Express backend API service for **The Indian Wings Company**, designed for zero-config deployment on **Render** (Web Service).

## Architecture

- **Frontend**: Next.js App Router (deployed on Vercel)
- **Backend API**: Node.js / Express REST API (deployed on Render)
- **Database**: Neon PostgreSQL via Prisma ORM + pg driver
- **Rate Limiting**: Upstash Redis (Sliding window rate limiters)
- **Email Dispatch**: Nodemailer with SMTP
- **Security**: Helmet, CORS with origin enforcement, CSRF origin verification, HMAC-SHA256 authenticated admin sessions (`SameSite=None; Secure`).

## Endpoints

### Health & Ingestion
- `GET /health` — Liveness & database connection probe
- `POST /api/enquiries` — Public enquiry submission with rate limiting, honeypot & idempotency
- `POST /api/itinerary` — Instant itinerary download request & lead generation
- `POST /api/telemetry` — Analytics events ingestion

### Public Read
- `GET /api/public/packages` — Active packages and categories
- `GET /api/public/destinations` — Active destinations
- `GET /api/public/activities` — Active valley activities
- `GET /api/public/transport` — Active vehicles and routes
- `GET /api/public/reviews` — Verified customer reviews
- `GET /api/public/settings` — Site settings & contact details
- `GET /api/public/hero` — Live homepage hero video/slides/pills

### Admin (Protected by `tiwc_admin_session` cookie)
- `POST /api/admin/login` — Admin authentication & cookie issuance
- `POST /api/admin/logout` — Admin session invalidation
- `GET /api/admin/data` — Dashboard metrics, leads, sessions & conversion stats
- `GET, PUT /api/admin/hero` — Homepage hero section editor
- `GET, POST /api/admin/seo` — Global SEO titles, descriptions & robots.txt
- `GET, POST /api/admin/settings` — Global contact details & announcements
- `GET, POST, PUT, DELETE /api/admin/packages` — Tour packages management
- `GET, POST, PUT, DELETE /api/admin/destinations` — Destinations management
- `GET, POST, PUT, DELETE /api/admin/activities` — Activities management
- `GET, POST /api/admin/categories` — Package categories management
- `GET, POST, PUT, DELETE /api/admin/reviews` — Reviews management
- `GET, POST, PUT, DELETE /api/admin/transport/vehicles` — Fleet vehicles management
- `GET, POST, PUT, DELETE /api/admin/transport/routes` — Transport routes management

## Render Deployment Settings

1. **Environment**: Node
2. **Build Command**: `npm install && npx prisma generate && npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**: Configure variables listed in `.env.example`.
