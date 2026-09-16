# The Indian Wings Company 🏔️
> **Premium Kashmir Travel & Tour Booking Platform**  
> High-performance Next.js 16 frontend + standalone Express API backend, powered by Neon PostgreSQL and Upstash Redis.

---

## 🚀 How to Use This Project

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: `v20.0.0` or higher ([Download Node.js](https://nodejs.org))
- **npm**: `v10.0.0` or higher
- **PostgreSQL Database**: Either a local PostgreSQL instance or a free cloud database from [Neon](https://neon.tech).

---

### 2. Installation

1. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

2. **Install Backend Dependencies:**
   ```bash
   npm --prefix backend install
   ```

---

### 3. Environment Variables Setup

#### Frontend Setup
Copy the template file to `.env`:
```bash
cp .env.example .env
```
Fill in your database connection and secrets:
```env
# Database (Neon PostgreSQL connection)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# (Optional) Point to standalone backend on port 3001
# If left commented, the frontend automatically falls back to local Next.js API routes!
# NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"

# Admin Authentication
ADMIN_SECRET_KEY="generate-strong-random-secret-key-for-hmac-sha256"
ADMIN_PASSWORD="your-secure-admin-password"
ADMIN_API_SECRET="your-internal-api-secret"
```

#### Backend Setup (Optional for Standalone API)
Copy the template file in the `backend/` folder:
```bash
cp backend/.env.example backend/.env
```
Configure:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=your-secure-admin-password
ADMIN_SECRET_KEY=at-least-32-chars-random-secret-key
ADMIN_API_SECRET=your-internal-api-secret
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
FRONTEND_ORIGIN=http://localhost:3000
```

---

### 4. Database Setup (Prisma)

Generate the Prisma client and push the schema to your database:
```bash
npx prisma generate
npx prisma db push
```

*(Optional: To generate Prisma client inside the standalone backend directory as well:)*
```bash
npm --prefix backend run typecheck
```

---

### 5. Running the Application

#### Start the Frontend (Next.js):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Start the Standalone Backend (Express API, optional):
In a separate terminal:
```bash
npm --prefix backend run dev
```
Health check will be available at [http://localhost:3001/health](http://localhost:3001/health).

---

### 6. Admin Panel Access & Management

1. Visit [http://localhost:3000/admin](http://localhost:3000/admin).
2. Enter the admin password configured in your `.env` file (`ADMIN_PASSWORD`).
3. What you can manage inside the Admin Panel:
   - **Leads Inbox**: View, filter, and update status of incoming travel enquiries (`NEW` → `CONTACTED` → `WON`).
   - **Homepage Hero**: Change hero headline, video URL, slides, and trust pills in real time.
   - **Tour Packages**: Create, update, or delete packages with day-by-day itineraries, pricing, and exclusions.
   - **Destinations & Activities**: Manage spots (Gulmarg, Pahalgam, Dal Lake) and adventures (Skiing, Shikara).
   - **Transport Fleet**: Manage vehicle fleet details and route transfer pricing.
   - **Customer Reviews**: Curate verified reviews and customer testimonials.
   - **SEO & Settings**: Configure global site title, meta description, contact numbers, and `robots.txt`.

---

### 7. Key Website Routes

| Route | Page Description |
|---|---|
| `/` | Cinematic Homepage with Hero Video, MakeMyTrip Quick Quote & Floating WhatsApp |
| `/packages` | Kashmir Holiday Packages with category filtering (Featured, Honeymoon, Family) |
| `/destinations` | Valley Destination guides (Gulmarg, Pahalgam, Dal Lake, Sonamarg, Doodhpathri) |
| `/activities` | Kashmir Adventure Activities (Skiing, Shikara, Rafting, Paragliding, Pony Trekking) |
| `/transport` | Chauffeured Fleet & Intercity Route Transfers (Innova Crysta, Tempo, Urbania) |
| `/admin` | Isolated Administration Dashboard & Lead Telemetry |
| `/sitemap.xml` | Dynamic real-time Google search sitemap |
| `/robots.txt` | Dynamic search engine crawler instructions |

---

### 8. Production Deployment

- **Frontend (Vercel)**: Connect Git repository to [Vercel](https://vercel.com). Deploy with Next.js preset.
- **Backend API (Render)**: Deploy `backend/` directory to [Render](https://render.com) as a Web Service.
- **Database (Neon)**: Serverless PostgreSQL with connection pooling.
- **Rate Limiting (Upstash)**: Distributed Redis rate limiting for DDoS and spam defense.
- **DNS (GoDaddy)**: Point Apex `@` to `76.76.21.21` and `www` CNAME to `cname.vercel-dns.com`.

---

## 📖 Complete Documentation

For the comprehensive engineering manual, schema diagrams, zero-loss lead engine specifications, and phase history, open:
- **PDF Manual**: [`.planning/Project_Documentation.pdf`](.planning/Project_Documentation.pdf)
- **Markdown Specification**: [`.planning/Project_Documentation.md`](.planning/Project_Documentation.md)
- **Deployment Runbook**: [`docs/production/production-deployment-runbook.md`](docs/production/production-deployment-runbook.md)
