# CI/CD Setup Guide

## Overview

This project uses a standard CI/CD pipeline with:
- **Parallel testing** (unit, E2E, linting)
- **Preview deployments** for pull requests
- **Automatic PR comments** with deployment URLs
- **Cross-browser E2E testing**
- **Coverage reporting**

## Required Secrets

Add these secrets to your GitHub repository (Settings → Secrets → Actions):

### Cloudflare Secrets (Required for Preview Deployments)
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
  - Create at: https://dash.cloudflare.com/profile/api-tokens
  - Required permissions: `Account:Cloudflare Workers Scripts:Edit`
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
  - Find in: Cloudflare Dashboard → Right sidebar

### Optional Secrets
- `CODECOV_TOKEN`: For coverage reporting (get from codecov.io)

## Pipeline Stages

### 1. Quick Checks (Parallel)
- **Lint & Format**: ESLint and Prettier checks
- **Type Check**: TypeScript compilation

### 2. Testing (Parallel)
- **Unit Tests**: Vitest with coverage
- **Build**: Production build verification

### 3. E2E Testing
- Runs after build succeeds
- Tests on Chrome, Firefox, and Safari
- Uploads test reports as artifacts

### 4. Preview Deployment (PR only)
- Deploys to Cloudflare Workers preview environment
- Comments on PR with deployment URL
- Updates GitHub deployment status

## Preview Deployments

Pull requests automatically get:
- A unique preview URL: `https://pr-{number}-web-app-starter-pack.workers.dev`
- Automatic updates on new commits
- Comment with deployment status
- Separate preview database (configure in wrangler.toml)

## Local Testing

Before pushing, run locally:
```bash
npm run lint        # Check linting
npm run type-check  # TypeScript check
npm test           # Unit tests
npm run test:e2e   # E2E tests
npm run build      # Build check
```

## Workflow Features

### Concurrency Control
- Cancels in-progress runs when new commits are pushed
- Saves CI minutes and provides faster feedback

### Matrix Testing
- E2E tests run on multiple browsers in parallel
- Each browser gets its own test report

### Smart Dependencies
- Build only starts after lint/type checks pass
- E2E only runs after successful build
- Preview deployment waits for build and unit tests

## Customization

### Adjust Test Browsers
Edit the matrix in `.github/workflows/ci.yml`:
```yaml
matrix:
  browser: [chromium, firefox, webkit, edge]
```

### Change Preview URL Pattern
Edit the deployment URL in the workflow:
```yaml
environment-url: https://pr-${{ github.event.pull_request.number }}-yourapp.workers.dev
```

### Add More Environments
Add to `wrangler.toml`:
```toml
[env.your-env]
name = "app-your-env"
vars = { NODE_ENV = "your-env" }
```

## Troubleshooting

### Preview Deployment Fails
1. Check Cloudflare API token permissions
2. Verify account ID is correct
3. Ensure wrangler.toml has preview environment

### E2E Tests Fail
1. Check if app builds correctly
2. Verify Playwright browsers are installed
3. Review test reports in GitHub artifacts

### Coverage Not Showing
1. Ensure CODECOV_TOKEN is set (optional but recommended)
2. Check that tests generate lcov.info file
3. Verify coverage command runs correctly