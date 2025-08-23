# Web App Starter Pack

A production-ready starter template for building modern web applications with React, TypeScript, and Cloudflare Workers.

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/your-org/web-app-starter-pack.git
cd web-app-starter-pack
npm install

# Set up environment variables
cp .env.example .env.local
cp .dev.vars.example .dev.vars

# Set up Cloudflare Workers (see detailed instructions below)
npm install -g wrangler
wrangler login
wrangler d1 create app-database

# Start development (3 terminals)
npm run dev              # Terminal 1: Frontend (http://localhost:5173)
wrangler dev             # Terminal 2: Backend (http://localhost:8787)
npx drizzle-kit studio   # Terminal 3: Database GUI (optional)
```

## 📋 Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or pnpm 8+
- [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier available)
- Wrangler CLI: `npm install -g wrangler`

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
npm run test           # Run unit tests
npm run test:e2e       # Run E2E tests
npm run test:coverage  # Generate coverage report

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
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-audience
```

#### Backend (.dev.vars)
```bash
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_API_AUDIENCE=your-audience
AUTH0_API_CLIENT_SECRET=your-secret
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

3. **Set production secrets:**
```bash
wrangler secret put AUTH0_API_CLIENT_SECRET
```

### Deploy to Other Platforms

The architecture is designed for portability. To deploy to Vercel, Netlify, or other platforms:

1. Update the API client to use the appropriate endpoints
2. Configure platform-specific environment variables
3. Follow the platform's deployment guide

## 📚 Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Cloudflare Workers, Hono framework
- **Database**: Cloudflare D1 (SQLite), Drizzle ORM
- **Testing**: Vitest, React Testing Library, Playwright
- **Auth**: Auth0
- **Mocking**: Mock Service Worker (MSW)

## 🔒 Security

- Environment variables for secrets
- Auth0 integration ready
- CORS configuration
- Input validation
- SQL injection prevention via ORM

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Getting Help

- Check [.project/guidelines/troubleshooting.md](.project/guidelines/troubleshooting.md) for common issues
- Review the [.project/](.project/) directory for detailed documentation
- Open an issue on GitHub for bugs or feature requests

---

Built with ❤️ for modern web development