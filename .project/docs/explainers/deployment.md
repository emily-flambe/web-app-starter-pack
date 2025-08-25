# Simple Deployment Guide

## Overview

This guide outlines a basic deployment strategy using a single Cloudflare Worker with automatic preview environments.

## Environments

**Production**
- **URL**: `web-app-starter-pack.workers.dev` (or custom domain)
- **Worker**: `web-app-starter-pack`
- **Branch**: `main`
- **Deployment**: Automatic on push to `main`

**Preview**
- **URL**: `[hash]-web-app-starter-pack.workers.dev`
- **Worker**: Same worker, preview versions
- **Branch**: Any feature branch
- **Deployment**: Automatic on PR creation/update

## Development Flow

1. Create feature branch from `main`
2. Push changes → automatic preview URL
3. Test at preview URL
4. Merge PR to `main`
5. Automatic deployment to production

## Configuration

### wrangler.toml
```toml
name = "web-app-starter-pack"
main = "worker/index.ts"
compatibility_date = "2025-08-15"

# Serve the frontend build as static assets
[assets]
directory = "./dist"
not_found_handling = "single-page-application"

# Production bindings
[[d1_databases]]
binding = "DB"
database_name = "web-app-starter-pack-db"
database_id = "your_production_db_id"

# Optional: KV namespace for caching
# [[kv_namespaces]]
# binding = "KV"
# id = "production_kv_id"
```

### GitHub Actions

**.github/workflows/deploy.yml**
```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: |
            if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
              deploy --minify
            else
              versions upload
            fi
```

## URL Structure

| Environment | URL | Trigger |
|------------|-----|---------|
| Production | `web-app-starter-pack.workers.dev` | Push to `main` |
| Preview | `[hash]-web-app-starter-pack.workers.dev` | Pull request opened/updated |

## Database Strategy

- **Production**: Uses production D1 database
- **Preview**: Uses the same production D1 database (read/write access)
- **Important**: Must initialize production database before first deployment:
  ```bash
  # Run these once after creating the D1 database
  npx wrangler d1 execute web-app-starter-pack-db --file=./db/schema.sql --remote
  npx wrangler d1 execute web-app-starter-pack-db --file=./db/seed.sql --remote
  ```

## Authentication

- Use environment variables for API keys
- Store secrets in GitHub Secrets
- Auth0 or similar can use wildcard matching for preview URLs: `*.workers.dev`

## Quick Start

1. Clone repository
2. Install dependencies: `npm install`
3. Set up Cloudflare account and create Worker
4. Add GitHub secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
5. Push to `main` to deploy to production
6. Create feature branch for preview deployments
