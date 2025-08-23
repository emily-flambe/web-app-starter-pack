# Setup Guide

This guide walks through setting up the Web App Starter Pack with Cloudflare Workers and D1.

## Table of Contents
- [Quick Setup](#quick-setup)
- [Detailed Setup](#detailed-setup)
- [Troubleshooting](#troubleshooting)
- [Common Issues](#common-issues)

## Quick Setup

For the fastest setup, run our interactive script:

```bash
./setup.sh
```

This will guide you through the entire process step-by-step.

## Detailed Setup

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js 20.11.0+** (use nvm: `nvm install 20.11.0`)
- **npm 9+** (comes with Node.js)
- **Git** (for version control)

### 2. Clone the Repository

```bash
git clone https://github.com/your-org/web-app-starter-pack.git
cd web-app-starter-pack
```

### 3. Install Dependencies

```bash
# Use the correct Node version
nvm use

# Install project dependencies
npm install

# Install Wrangler globally (optional)
npm install -g wrangler
```

### 4. Configure Environment

```bash
# Copy environment templates
cp .env.example .env.local
cp .dev.vars.example .dev.vars

# Edit .env.local if needed (default values work for development)
# VITE_API_URL=http://localhost:8787
```

### 5. Authenticate with Cloudflare

```bash
# Login to your Cloudflare account
wrangler login

# This opens a browser window - click "Allow" to authenticate
```

### 6. Create D1 Database

```bash
# Create a new D1 database
wrangler d1 create app-database

# Output will show:
# ✅ Successfully created DB 'app-database'
# 
# [[d1_databases]]
# binding = "DB"
# database_name = "app-database"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the `database_id` and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "app-database"
database_id = "YOUR_DATABASE_ID_HERE"  # <- Replace with your ID
```

### 7. Initialize Database

```bash
# Create tables in local database
wrangler d1 execute app-database --local --file=./db/schema.sql

# Add sample data (optional)
wrangler d1 execute app-database --local --file=./db/seed.sql

# For remote database (production)
wrangler d1 execute app-database --remote --file=./db/schema.sql
```

### 8. Build Frontend

```bash
npm run build
```

### 9. Start Development Servers

```bash
# Start both frontend and backend
make dev

# Or run separately:
npm run dev              # Frontend on http://localhost:5173
wrangler dev            # Backend on http://localhost:8787
```

### 10. Verify Setup

1. Open http://localhost:5173 in your browser
2. You should see the Todo app
3. Try adding, completing, and deleting todos
4. Check the console for any errors

## Troubleshooting

### Wrangler Not Found

```bash
# If wrangler command not found, use npx:
npx wrangler login
npx wrangler d1 create app-database
npx wrangler dev

# Or install globally:
npm install -g wrangler
```

### Database Connection Issues

If you see "Failed to load todos" in the app:

1. **Check backend is running**: Ensure `wrangler dev` is running on port 8787
2. **Check database ID**: Verify the database_id in wrangler.toml is correct
3. **Initialize database**: Run schema.sql to create tables:
   ```bash
   wrangler d1 execute app-database --local --file=./db/schema.sql
   ```

### Port Already in Use

If port 5173 or 8787 is already in use:

```bash
# Kill processes on specific ports
lsof -ti:5173 | xargs kill -9  # Frontend port
lsof -ti:8787 | xargs kill -9  # Backend port

# Or change ports in configuration:
# Frontend: vite.config.ts → server.port
# Backend: wrangler dev --port 8788
```

### Authentication Issues

If `wrangler login` fails:

1. **Clear credentials**: `wrangler logout` then `wrangler login` again
2. **Use API token**: Create at https://dash.cloudflare.com/profile/api-tokens
   ```bash
   export CLOUDFLARE_API_TOKEN=your_token_here
   ```
3. **Check network**: Ensure you can access cloudflare.com

### Build Failures

If `npm run build` fails:

1. **Clear cache**: 
   ```bash
   rm -rf node_modules dist
   npm ci
   npm run build
   ```
2. **Check Node version**: Ensure you're using Node 20.11.0+
   ```bash
   node --version  # Should be v20.11.0 or higher
   nvm use 20.11.0
   ```

### Database Migration Issues

If database queries fail after schema changes:

1. **Reset local database**:
   ```bash
   # Delete local D1 database
   rm -rf .wrangler/state/v3/d1
   
   # Recreate schema
   wrangler d1 execute app-database --local --file=./db/schema.sql
   ```

2. **Check SQL syntax**: D1 uses SQLite syntax, not PostgreSQL

## Common Issues

### Issue: "Module not found" errors

**Solution**: Install dependencies
```bash
npm ci
```

### Issue: TypeScript errors

**Solution**: Check TypeScript version and run type check
```bash
npm run type-check
```

### Issue: CORS errors in browser

**Solution**: Ensure backend CORS configuration includes frontend URL
```typescript
// worker/index.ts
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
```

### Issue: "Database not found"

**Solution**: Create and configure database
```bash
wrangler d1 create app-database
# Update wrangler.toml with the database_id
```

### Issue: Changes not reflecting

**Solution**: Clear caches and rebuild
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build

# Restart dev servers
make dev
```

## Getting Help

If you encounter issues not covered here:

1. Check the [project documentation](.project/README.md)
2. Review [migration guides](.project/docs/migration-guides/)
3. Search for similar issues on GitHub
4. Open a new issue with:
   - Error messages
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)

## Next Steps

Once setup is complete:

1. **Explore the code**: Check `src/App.tsx` and `worker/index.ts`
2. **Modify the todo app**: Add new features to learn the stack
3. **Run tests**: `npm test` and `npm run test:e2e`
4. **Deploy**: When ready, run `wrangler deploy`

Happy coding!