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

If either fails, the pipeline continues but the final status check will fail.

### Step 2: Build
Once the code passes basic checks, we build the application. This:
- Bundles all the JavaScript/TypeScript
- Processes CSS with Tailwind
- Optimizes everything for production
- Creates the `dist/` folder with the final app

The build artifacts are saved so later steps can reuse them.

### Step 3: Parallel Testing and Deployment
After the build completes, three things happen simultaneously:

**Unit Tests** - Test individual functions and components in isolation. They run on the source code directly.

**E2E Tests** - Run end-to-end tests using Playwright:
- Start a real browser (Chromium)
- Load the actual app from the build
- Click buttons, fill forms, and verify everything works
- Test the app exactly as a user would experience it

**Deploy** - Deploy the application immediately:
- **Main branch**: Deploys to production at `web-app-starter-pack.workers.dev`
- **Pull requests**: Creates preview deployments at unique URLs like `[version-id]-web-app-starter-pack.workers.dev`

All three run in parallel to maximize speed. The deployment uses the same build artifacts, ensuring consistency.

### Step 4: Final Status Check
After all jobs complete (pass or fail), a final status check runs. This job:
- Checks the result of every previous job
- Fails if ANY job failed
- This is what blocks PR merging - you can't merge if this check fails

This ensures that even though we deploy before tests complete, we can't merge broken code to main.

## Why This Order?

This approach prioritizes speed and developer experience:

1. **Fail fast on cheap operations**: Linting and type-checking are nearly instant. These run first to catch obvious issues.

2. **Build early**: We build right after basic checks pass. This gives us artifacts that all subsequent steps can use.

3. **Maximum parallelization**: Tests and deployment run simultaneously, not sequentially. This dramatically reduces total pipeline time.

4. **Immediate preview deployments**: Developers get a preview URL as fast as possible, without waiting for tests. This enables:
   - Quick manual testing
   - Sharing with stakeholders
   - Visual verification
   - Real-world testing

5. **Safety through final check**: The final status check ensures we can't merge broken code, even though we deployed before tests finished. If tests fail, the PR is blocked from merging.

6. **Best of both worlds**: We get the speed of immediate deployment with the safety of comprehensive testing. Preview deployments can be "broken" temporarily, but main branch is always protected.

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