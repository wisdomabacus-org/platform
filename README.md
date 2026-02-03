# Wisdom Abacus Platform

This is a Turborepo monorepo powered by [Bun](https://bun.sh).

## Project Structure

```
platform/
├── apps/
│   ├── website/      # Public website (Next.js)
│   ├── exam-portal/  # Exam portal (Vite + React)
│   └── admin/        # Admin dashboard (Vite + React)
├── packages/
│   ├── database/     # Supabase TypeScript types
│   └── ui/           # Shared UI components
├── supabase/
│   ├── functions/    # Edge Functions
│   ├── migrations/   # Database migrations
│   └── seed.sql      # Seed data
└── dist/             # Build output (after `bun run build`)
    ├── admin/        # Static build (deployable to any CDN)
    ├── exam-portal/  # Static build (deployable to any CDN)
    └── website/      # Next.js build (requires Node.js server)
```

## Getting Started

### Install Dependencies

```bash
bun install
```

### Development

```bash
# Run all apps concurrently
bun run dev

# Run individual apps
bun run dev:admin       # Admin panel at http://localhost:5173
bun run dev:web         # Website at http://localhost:3000
bun run dev:exam-portal # Exam portal at http://localhost:5174
```

### Build

```bash
# Build all apps
bun run build

# Build individual apps
bun run build:admin
bun run build:web
bun run build:exam-portal

# Clean build artifacts
bun run clean
bun run clean:dist
```

All build outputs are placed in the `/dist` folder at the monorepo root:

| App | Output Path | Build Type | Hosting |
|-----|-------------|------------|---------|
| Admin | `dist/admin/` | Static SPA | Any CDN (Cloudflare, Netlify, etc.) |
| Exam Portal | `dist/exam-portal/` | Static SPA | Any CDN (Cloudflare, Netlify, etc.) |
| Website | `dist/website/` | Next.js SSR | Vercel, Node.js server, Docker |

### Database (Supabase)

```bash
# Start local Supabase
bun run db:start

# View database status
bun run db:status

# Reset database with seed data
bun run db:reset

# Push migrations
bun run db:push

# Regenerate TypeScript types
bun run db:types

# Stop Supabase
bun run db:stop
```

## Deployment

### Admin & Exam Portal (Static Sites)

Both `admin` and `exam-portal` produce static HTML/JS/CSS bundles that can be deployed to any static hosting:

```bash
# Build
bun run build:admin
bun run build:exam-portal

# Deploy dist/admin and dist/exam-portal to your CDN
```

**Recommended Platforms:**
- Cloudflare Pages
- Netlify
- Vercel (Static)
- AWS S3 + CloudFront

### Website (Next.js with SSR)

The website requires a Node.js runtime for server-side rendering and API routes:

```bash
bun run build:web
```

**Production Server:**
```bash
cd apps/website
bun run start  # or: npx next start
```

**Recommended Platforms:**
- Vercel (recommended, zero-config)
- Docker container
- Node.js server (PM2, etc.)

## Tech Stack

- **Build System:** Turborepo
- **Package Manager:** Bun
- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI / Shadcn
- **State:** Zustand, TanStack Query
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Payments:** Razorpay

## Scripts Reference

| Script | Description |
|--------|-------------|
| `bun run dev` | Start all apps in development mode |
| `bun run build` | Build all apps to `/dist` |
| `bun run lint` | Run ESLint on all packages |
| `bun run clean` | Clean turbo cache and dist folder |
| `bun run clean:dist` | Clean only the dist folder |
| `bun run db:start` | Start local Supabase |
| `bun run db:reset` | Reset database with migrations and seed |
| `bun run db:types` | Regenerate database TypeScript types |

## Environment Variables

Create `.env` files in respective app directories:

```bash
# apps/website/.env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# apps/admin/.env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# apps/exam-portal/.env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```
