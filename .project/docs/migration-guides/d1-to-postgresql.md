# Migrating from D1 (SQLite) to PostgreSQL

This guide covers migrating from Cloudflare D1 to PostgreSQL across different deployment platforms.

## Why Migrate?

**D1 (SQLite) is great for:**
- Edge deployment with Cloudflare Workers
- Simple applications
- Read-heavy workloads
- Zero configuration

**PostgreSQL is better for:**
- Complex queries and relationships
- Concurrent writes
- Advanced features (JSON, full-text search, extensions)
- Legacy application compatibility
- Multi-region replication

## PostgreSQL Provider Options

### 1. Neon (Recommended for Cloudflare Workers)
- **Pros**: Serverless, scales to zero, great Cloudflare Workers support
- **Cons**: Cold starts, connection limits on free tier
- **Pricing**: Free tier with 0.5 GB storage

### 2. Supabase
- **Pros**: Includes auth, realtime, storage
- **Cons**: More complex, overkill for simple apps
- **Pricing**: Free tier with 500 MB database

### 3. PlanetScale (MySQL-compatible)
- **Pros**: Excellent scaling, branching
- **Cons**: MySQL not PostgreSQL
- **Pricing**: Free tier discontinued

### 4. Railway
- **Pros**: Simple setup, good DX
- **Cons**: Can get expensive
- **Pricing**: $5/month + usage

### 5. Render
- **Pros**: Managed PostgreSQL, automatic backups
- **Cons**: Free tier databases deleted after 90 days
- **Pricing**: Free tier available

## Migration Steps by Platform

### Cloudflare Workers + Neon

#### 1. Set up Neon
```bash
# Sign up at https://neon.tech
# Create a new project and database
# Copy your connection string (looks like: postgresql://user:pass@host/db)
```

#### 2. Install Dependencies
```bash
npm install @neondatabase/serverless drizzle-orm
```

#### 3. Update Schema
```typescript
// drizzle/schema.ts
// Change from SQLite imports:
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// To PostgreSQL imports:
import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

// Update table definition:
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),  // serial instead of integer
  text: text('text').notNull(),
  completed: boolean('completed').notNull().default(false),  // boolean instead of integer
  createdAt: timestamp('created_at').notNull().defaultNow(),  // timestamp instead of integer
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

#### 4. Update Worker
```typescript
// worker/index.ts
// Change from D1:
import { drizzle } from 'drizzle-orm/d1';
type Bindings = {
  DB: D1Database;
};
const db = drizzle(c.env.DB);

// To Neon:
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
type Bindings = {
  DATABASE_URL: string;
};
const sql = neon(c.env.DATABASE_URL);
const db = drizzle(sql);
```

#### 5. Update Environment
```bash
# .dev.vars
DATABASE_URL=postgresql://user:password@host.neon.tech/database

# For production, add via Wrangler:
wrangler secret put DATABASE_URL
```

#### 6. Update Drizzle Config
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',  // Changed from 'better-sqlite'
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});
```

#### 7. Generate and Run Migrations
```bash
npm run db:generate
npm run db:push
```

### Vercel + Vercel Postgres

#### 1. Set up Vercel Postgres
```bash
# In Vercel Dashboard:
# 1. Go to Storage tab
# 2. Create PostgreSQL database
# 3. Connect to your project
```

#### 2. Install Dependencies
```bash
npm install @vercel/postgres drizzle-orm
```

#### 3. Update for Vercel
```typescript
// lib/db.ts
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

export const db = drizzle(sql);
```

#### 4. API Routes (Next.js App Router)
```typescript
// app/api/todos/route.ts
import { db } from '@/lib/db';
import { todos } from '@/drizzle/schema';

export async function GET() {
  const allTodos = await db.select().from(todos);
  return Response.json(allTodos);
}

export async function POST(request: Request) {
  const body = await request.json();
  const [newTodo] = await db.insert(todos)
    .values({ text: body.text })
    .returning();
  return Response.json(newTodo, { status: 201 });
}
```

### Netlify + Supabase

#### 1. Set up Supabase
```bash
# Sign up at https://supabase.com
# Create new project
# Go to Settings > Database
# Copy connection string
```

#### 2. Install Dependencies
```bash
npm install @supabase/supabase-js drizzle-orm postgres
```

#### 3. Netlify Functions
```typescript
// netlify/functions/todos.ts
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(process.env.DATABASE_URL!);
const db = drizzle(queryClient);

export const handler = async (event: any) => {
  if (event.httpMethod === 'GET') {
    const todos = await db.select().from(todosTable);
    return {
      statusCode: 200,
      body: JSON.stringify(todos),
    };
  }
  // ... other methods
};
```

### Railway/Render (Traditional Node.js)

#### 1. Standard PostgreSQL Connection
```typescript
// server.ts
import express from 'express';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const db = drizzle(pool);

const app = express();
app.use(express.json());

app.get('/api/todos', async (req, res) => {
  const todos = await db.select().from(todosTable);
  res.json(todos);
});

app.listen(process.env.PORT || 3000);
```

## Data Migration

### Export from D1
```bash
# Export data from D1
wrangler d1 execute YOUR_DATABASE --command "SELECT * FROM todos" > todos_backup.json
```

### Import to PostgreSQL
```sql
-- Create table in PostgreSQL
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Import data (you'll need to transform the JSON)
-- Or use a migration script:
```

```typescript
// migrate-data.ts
import { neon } from '@neondatabase/serverless';
import oldData from './todos_backup.json';

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  for (const todo of oldData) {
    await sql`
      INSERT INTO todos (text, completed, created_at, updated_at)
      VALUES (${todo.text}, ${todo.completed}, ${todo.created_at}, ${todo.updated_at})
    `;
  }
}

migrate();
```

## Performance Considerations

### Connection Pooling

**Cloudflare Workers**: Use HTTP-based drivers (Neon, PlanetScale)
```typescript
// Good for Workers (HTTP-based)
import { neon } from '@neondatabase/serverless';

// Bad for Workers (needs persistent connection)
import { Pool } from 'pg';  // Won't work!
```

**Traditional Servers**: Use connection pooling
```typescript
// Good for Node.js servers
import { Pool } from 'pg';
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Query Optimization

**D1 (SQLite)**:
- Simple queries
- Limited concurrent writes
- No query planner optimization

**PostgreSQL**:
- Use indexes for large tables
- EXPLAIN ANALYZE for query optimization
- Prepared statements for repeated queries

```sql
-- Add indexes for better performance
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
```

## Cost Comparison

| Provider | Free Tier | Paid Starting | Best For |
|----------|-----------|---------------|----------|
| D1 | 5GB, 10M rows | $0.75/GB | Cloudflare Workers only |
| Neon | 0.5GB, 3 databases | $19/month | Serverless, Workers |
| Supabase | 500MB, 2 projects | $25/month | Full-stack apps |
| Vercel Postgres | 256MB | $15/month | Vercel deployments |
| Railway | Trial credits | $5/month | Traditional hosting |

## Rollback Plan

If you need to rollback to D1:

1. Export PostgreSQL data
2. Transform timestamps back to integers
3. Import to D1
4. Revert code changes
5. Update environment variables

```bash
# Keep both schemas during transition
drizzle/
  schema.ts         # Current D1 schema
  schema.pg.ts      # PostgreSQL schema
  
# Switch by changing imports
```

## Common Gotchas

1. **Timestamps**: D1 uses integers, PostgreSQL uses actual timestamps
2. **Booleans**: D1 uses 0/1, PostgreSQL uses true/false
3. **Auto-increment**: D1 uses INTEGER PRIMARY KEY, PostgreSQL uses SERIAL
4. **Connections**: Workers can't maintain persistent connections
5. **Transactions**: Limited in HTTP-based drivers
6. **SSL**: Required in production for most providers

## Testing the Migration

```typescript
// test-connection.ts
import { neon } from '@neondatabase/serverless';

async function testConnection() {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Connected to PostgreSQL:', result);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
```

## Conclusion

Migrating from D1 to PostgreSQL is straightforward with Drizzle ORM. The main considerations are:

1. **Choose the right provider** for your deployment platform
2. **Update schema types** (timestamps, booleans, serial)
3. **Use appropriate connection method** (HTTP for Workers, Pool for servers)
4. **Migrate data carefully** with proper transformations
5. **Test thoroughly** before switching production

The easiest path for Cloudflare Workers is **Neon**, while Vercel deployments should use **Vercel Postgres**, and traditional Node.js hosting works well with **Railway** or **Render**.