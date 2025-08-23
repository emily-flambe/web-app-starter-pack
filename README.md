# Web App Starter Pack

A production-ready monorepo starter for professionals who need a battle-tested stack without the setup overhead. Everything you need, nothing you don't.

## 🚀 Quick Start

```bash
# One-command setup
make setup

# Start everything
make dev
```

Or manually:
```bash
git clone https://github.com/your-org/web-app-starter-pack.git
cd web-app-starter-pack
nvm use
npm install
cp .env.example .env.local
cp .dev.vars.example .dev.vars
```

## 📋 Prerequisites

- **nvm** (Node Version Manager) - [Install guide](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Node.js 20.11.0** - Managed via nvm and `.nvmrc`
- **npm 9+** or **pnpm 8+**
- **[Cloudflare account](https://dash.cloudflare.com/sign-up)** (free tier available)
- **Wrangler CLI**: `npm install -g wrangler`

## 🛠️ Cloudflare Workers Setup

### 1. Create Cloudflare Account
- Sign up at [dash.cloudflare.com](https://dash.cloudflare.com/sign-up)
- Verify your email

### 2. Install and Authenticate Wrangler
```bash
# Install Wrangler CLI globally
npm install -g wrangler

# Login to your Cloudflare account
wrangler login
# This opens a browser - click "Allow" to authenticate
```

### 3. Create D1 Database
```bash
# Create a new D1 database
wrangler d1 create app-database

# Output will look like:
# ✅ Successfully created DB 'app-database' in region ENAM
# Created your new D1 database.
# 
# [[d1_databases]]
# binding = "DB"
# database_name = "app-database"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 4. Update wrangler.toml
Copy the `database_id` from the output above and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "app-database"
database_id = "YOUR_DATABASE_ID_HERE"  # <-- Paste your ID here
```

### 5. Initialize Database Schema
```bash
# Generate initial migration
npx drizzle-kit generate

# Apply to local database
wrangler d1 migrations apply app-database --local

# Apply to remote database (when ready for production)
wrangler d1 migrations apply app-database --remote
```

## 🏗️ Project Structure

```
web-app-starter-pack/
├── src/                      # Frontend React application
│   ├── components/          # Reusable UI components
│   ├── features/           # Feature modules
│   ├── lib/               # Utilities and abstractions
│   │   ├── api/          # API client
│   │   ├── auth/         # Authentication
│   │   └── db/           # Database abstraction layer
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── routes/           # Application routing
├── worker/                   # Cloudflare Worker backend
│   ├── index.ts          # API entry point
│   └── db/               # Database repositories
├── drizzle/                  # Database configuration
│   ├── schema.ts         # Database schema
│   └── migrations/       # Auto-generated migrations
├── .env.example             # Frontend environment template
├── .dev.vars.example        # Backend environment template
├── wrangler.toml           # Cloudflare Workers configuration
└── drizzle.config.ts       # Drizzle ORM configuration
```

## 💻 Local Development Philosophy

We use **native Wrangler development** without Docker containerization for:
- **10x faster startup** than containerized alternatives
- **Sub-second hot reload** for rapid iteration
- **Direct Chrome DevTools access** for debugging
- **Exact production runtime** via `workerd`

See [.project/specs/setup/local-development-strategy.md](.project/specs/setup/local-development-strategy.md) for detailed rationale.

## 🧪 Testing

The starter pack includes two testing frameworks for comprehensive coverage:

### Unit Testing with Jest
- **Platform-agnostic**: Works with any bundler (Vite, Webpack, etc.)
- **Fast and reliable**: Industry-standard testing framework
- **React Testing Library**: For component testing
- **Located in**: `src/**/*.test.tsx` files

```bash
npm run test          # Run all unit tests
npm run test:watch    # Watch mode for development
```

### E2E Testing with Playwright
- **Cross-browser**: Tests in Chrome, Firefox, Safari, and mobile
- **Real browser testing**: Not just simulated
- **Visual debugging**: UI mode for debugging tests
- **Located in**: `e2e/` directory

```bash
npm run test:e2e      # Run all E2E tests
npm run test:e2e:ui   # Open Playwright UI for debugging
npx playwright install  # Install browsers (first time only)
```

## 🎯 Where to Implement Your Code

### Frontend Implementation

#### 1. Features (`src/features/`)
Create your feature modules here. Each feature should be self-contained:

```typescript
// src/features/example/ExampleFeature.tsx
export function ExampleFeature() {
  return (
    <div>
      {/* Your feature implementation */}
    </div>
  );
}
```

#### 2. API Client (`src/lib/api/`)
The API client provides a foundation for backend communication:

```typescript
// src/lib/api/client.ts
// Extend the ApiClient class with your API methods
```

#### 3. Routes (`src/routes/`)
Define your application routing structure:

```typescript
// src/routes/index.tsx
// Add your routes to the router configuration
```

### Backend Implementation

#### 1. Worker API (`worker/index.ts`)
Define your API endpoints using the Hono framework:

```typescript
// Add your API routes here
app.get('/api/your-endpoint', async (c) => {
  // Your implementation
});
```

#### 2. Database Schema (`drizzle/schema.ts`)
Define your database tables using Drizzle ORM:

```typescript
// Define your tables and relationships
```

#### 3. Database Repositories (`worker/db/`)
Implement the repository pattern for clean database access:

```typescript
// Create repository classes for your data models
```

## 🧰 Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server
wrangler dev            # Start Worker dev server
npm run dev:mock        # Start with MSW mocks

# Database
npm run db:generate     # Generate migrations
npm run db:push         # Push schema changes
npm run db:studio       # Open Drizzle Studio

# Testing
npm run test           # Run unit tests with Jest
npm run test:watch     # Run Jest in watch mode
npm run test:e2e       # Run E2E tests with Playwright
npm run test:e2e:ui    # Open Playwright UI mode

# Building
npm run build          # Build for production
npm run preview        # Preview production build

# Deployment
wrangler deploy              # Deploy to Cloudflare
wrangler deploy --env staging # Deploy to staging
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```bash
VITE_API_URL=http://localhost:8787
# Add your environment variables here
```

#### Backend (.dev.vars)
```bash
# Add your Cloudflare Worker secrets here
# Example: DATABASE_URL, API_KEYS, etc.
```

## 🚢 Deployment

### Deploy to Cloudflare Workers

1. **Build the frontend:**
```bash
npm run build
```

2. **Deploy to Cloudflare:**
```bash
wrangler deploy
```

3. **Set production secrets (if any):**
```bash
# Example: wrangler secret put API_SECRET
```

### Deploy to Other Platforms

The architecture is designed for portability. To deploy to Vercel, Netlify, or other platforms:

1. Update the API client to use the appropriate endpoints
2. Configure platform-specific environment variables
3. Follow the platform's deployment guide

## 📚 Technology Stack

### Core
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Cloudflare Workers, Hono framework
- **Database**: Cloudflare D1 (SQLite), Drizzle ORM

### Testing
- **Unit Testing**: Jest, React Testing Library (platform-agnostic)
- **E2E Testing**: Playwright (cross-browser)

### CI/CD & DevOps
- **CI/CD**: GitHub Actions (lint, test, build, deploy)
- **Security**: CodeQL, Gitleaks, npm audit
- **Dependencies**: Dependabot auto-updates
- **Containerization**: Docker & Docker Compose
- **Git Hooks**: Pre-commit checks (optional)

### Pre-installed Libraries

The following commonly-needed libraries are included but not yet configured:
- **React Router DOM**: Client-side routing for multi-page SPAs
- **TanStack Query (React Query)**: Data fetching and server state management

## 🔒 Security

- Environment variables for secrets
- Authentication ready (configure your preferred provider)
- CORS configuration
- Input validation
- SQL injection prevention via ORM

### Generating Secrets

For JWT tokens or other secrets, generate secure random values:

```bash
# Generate a JWT secret
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Set it in your local environment
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .dev.vars
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

**Automatic on every push:**
- `.github/workflows/ci.yml` - Linting, type checking, unit tests, E2E tests
- `.github/workflows/security.yml` - CodeQL analysis, dependency audit, secrets scanning

**Automatic on main branch:**
- `.github/workflows/deploy.yml` - Deploy to Cloudflare Workers

### Required GitHub Secrets
```
CLOUDFLARE_API_TOKEN    # Your Cloudflare API token
CLOUDFLARE_ACCOUNT_ID   # Your Cloudflare account ID
```

### Setting Up Deployment

1. Get your Cloudflare credentials:
   ```bash
   wrangler login
   # Note your account ID from the output
   ```

2. Create an API token at https://dash.cloudflare.com/profile/api-tokens

3. Add secrets to your GitHub repository:
   - Go to Settings → Secrets → Actions
   - Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`

## 🆘 Getting Help

- Check [.project/guidelines/troubleshooting.md](.project/guidelines/troubleshooting.md) for common issues
- Review the [.project/](.project/) directory for detailed documentation
- Open an issue on GitHub for bugs or feature requests

---

Built with ❤️ for modern web development