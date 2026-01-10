# Web App Starter Pack

Full-stack TypeScript monorepo: React frontend + Cloudflare Workers backend + D1 database.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4
- **Backend**: Cloudflare Workers, Hono framework
- **Database**: Cloudflare D1 (SQLite at edge)
- **Testing**: Vitest (unit), Playwright (e2e)
- **Tooling**: ESLint, Prettier, npm

## Project Structure

```
src/                    # React frontend
  components/           # React components (ui/ for primitives)
  lib/                  # Utilities and API client
  __tests__/            # Unit and integration tests
worker/                 # Cloudflare Worker backend
  index.ts              # API routes (Hono)
  middleware/           # Security, rate limiting, validation
  validators/           # Zod schemas
db/                     # D1 database
  schema.sql            # Database schema
  seed.sql              # Seed data
e2e/                    # Playwright tests
```

## Essential Commands

```bash
# Development
make dev                # Start both frontend (5173) and backend (8787)
npm run dev             # Frontend only
npm run dev:api         # Backend only (wrangler dev)

# Testing
npm run test            # Unit tests (vitest)
npm run test:e2e        # E2E tests (playwright)
npm run type-check      # TypeScript check
npm run lint            # ESLint

# Build & Deploy
npm run build           # Build frontend
make deploy             # Build and deploy to Cloudflare

# Database
npm run db:init         # Initialize local D1 database
npm run db:seed         # Seed local database
```

## Verification Checklist

Before committing:
1. `npm run type-check` - TypeScript passes
2. `npm run lint` - No linting errors
3. `npm run test` - Unit tests pass
4. `npm run test:e2e` - E2E tests pass

## Architecture Notes

**API Pattern**: Frontend calls `/api/*` endpoints. In development, frontend (5173) calls backend (8787) via CORS. In production, both served from same Cloudflare Worker.

**API Client**: `src/lib/api/client.ts` handles all backend communication. Uses relative URLs in production, localhost in development.

**Database**: D1 uses raw SQL (no ORM). SQLite integers for booleans (0/1). Schema in `db/schema.sql`.

**Middleware Stack** (worker/middleware/):
- `security.ts` - Security headers
- `rateLimit.ts` - API rate limiting
- `validation.ts` - Request validation via Zod

## Environment Variables

Local development: `.dev.vars` (Cloudflare Workers) and `.env` (Vite)

Required for CI/CD:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Common Tasks

**Add new API endpoint**: Edit `worker/index.ts`, add Zod validator in `worker/validators/`

**Add new React component**: Create in `src/components/`, add unit test in `src/__tests__/unit/`

**Add database table**: Add to `db/schema.sql`, run `npm run db:init`
