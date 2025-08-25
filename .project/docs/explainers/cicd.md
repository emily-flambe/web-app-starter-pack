# CI/CD Pipeline Explained

## Overview

Our CI/CD pipeline is designed to catch issues early and deploy with confidence. It follows a logical progression from quick checks to more expensive operations, ensuring we don't waste time on builds that would fail basic tests.

## Pipeline Flow

The pipeline runs automatically on:
- Every push to the `main` branch
- Every pull request (new or updated)

## Order of Operations

### Step 1: Parallel Quick Checks
**Lint & Format Check** and **TypeScript Check** run simultaneously. These are fast checks that catch basic issues:
- **Linting** ensures code follows our style guidelines
- **TypeScript** verifies all types are correct

If either fails, the pipeline stops here. No point building broken code.

### Step 2: Unit Tests
Once the code passes basic checks, we run unit tests. These test individual functions and components in isolation. They're fast because they don't need a full build - they test the source code directly.

If tests fail, we stop here. No point building code with broken logic.

### Step 3: Build
Now that we know the code is valid and the logic works, we build the application. This:
- Bundles all the JavaScript/TypeScript
- Processes CSS with Tailwind
- Optimizes everything for production
- Creates the `dist/` folder with the final app

The build artifacts are saved so later steps can reuse them.

### Step 4: E2E Tests
With a built application, we run end-to-end tests using Playwright. These:
- Start a real browser (Chromium)
- Load the actual app
- Click buttons, fill forms, and verify everything works
- Test the app exactly as a user would experience it

These tests use the build from Step 3, so we don't build twice.

### Step 5: Deploy
Only after everything passes do we deploy:
- **Main branch**: Deploys to production at `web-app-starter-pack.workers.dev`
- **Pull requests**: Creates preview deployments at `[hash]-web-app-starter-pack.workers.dev`

The deployment uses the same build artifacts from Step 3, ensuring what we tested is exactly what gets deployed.

## Why This Order?

This is called the "hybrid approach" and it's optimal because:

1. **Fail fast on cheap operations**: Linting and type-checking are nearly instant. If these fail, we know immediately without wasting time on builds or tests.

2. **Test logic before building**: Unit tests run on source code without needing a build. If the logic is broken, why waste time bundling it?

3. **Build once, use everywhere**: We build the app once and reuse those artifacts for both E2E tests and deployment. This ensures consistency and saves time.

4. **Test what you deploy**: E2E tests run on the exact build that will be deployed, not on development code. This catches bundling issues, optimization problems, or environment-specific bugs.

5. **Deploy with confidence**: By the time we deploy, we know:
   - The code is properly formatted
   - All types are correct
   - The business logic works (unit tests)
   - The app builds successfully
   - Users can actually use it (E2E tests)

## Configuration

The pipeline is defined in `.github/workflows/ci.yml`. It uses GitHub Actions and runs on Ubuntu Linux with Node.js 20.19+.

## Local Testing

You can run the same checks locally before pushing:

```bash
# Quick checks
npm run lint
npm run type-check

# Tests
npm run test          # Unit tests
npm run test:e2e      # E2E tests (starts dev server automatically)

# Build
npm run build

# Everything at once
npm run lint && npm run type-check && npm run test && npm run build && npm run test:e2e
```

## Time Expectations

Typical pipeline duration:
- Lint & TypeScript: ~30 seconds (parallel)
- Unit tests: ~15 seconds
- Build: ~20 seconds
- E2E tests: ~45 seconds
- Deploy: ~30 seconds

Total: ~2-3 minutes from push to deployment

## Key Benefits

1. **Early feedback**: Know within 30 seconds if there are basic issues
2. **No wasted compute**: Don't build or deploy broken code
3. **Consistent deployments**: What you test is what you deploy
4. **Preview deployments**: Every PR gets its own URL for testing
5. **Confidence**: Multiple layers of testing before production