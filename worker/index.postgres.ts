/**
 * Cloudflare Worker with PostgreSQL (Neon) Example
 * 
 * To use this instead of D1:
 * 1. Sign up for Neon: https://neon.tech
 * 2. Create a database and get your connection string
 * 3. Add to .dev.vars: DATABASE_URL=postgresql://...
 * 4. Install: npm install @neondatabase/serverless drizzle-orm
 * 5. Rename this file to index.ts
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { todos, type Todo, type NewTodo } from '../drizzle/schema.postgres';
import { eq } from 'drizzle-orm';

// Environment bindings for PostgreSQL
type Bindings = {
  DATABASE_URL: string;  // PostgreSQL connection string
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Todo API with PostgreSQL is running'
  });
});

// Get all todos
app.get('/api/todos', async (c) => {
  try {
    // Connect to PostgreSQL via Neon
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);
    
    const allTodos = await db.select().from(todos);
    return c.json(allTodos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return c.json({ error: 'Failed to fetch todos' }, 500);
  }
});

// Create todo
app.post('/api/todos', async (c) => {
  try {
    const body = await c.req.json<{ text: string }>();
    
    if (!body.text || body.text.trim() === '') {
      return c.json({ error: 'Text is required' }, 400);
    }
    
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);
    
    const [created] = await db.insert(todos)
      .values({ text: body.text.trim() })
      .returning();
    
    return c.json(created, 201);
  } catch (error) {
    console.error('Error creating todo:', error);
    return c.json({ error: 'Failed to create todo' }, 500);
  }
});

// Update todo
app.put('/api/todos/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json<{ text?: string; completed?: boolean }>();
    
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);
    
    const [updated] = await db.update(todos)
      .set({
        ...(body.text !== undefined && { text: body.text }),
        ...(body.completed !== undefined && { completed: body.completed }),
        updatedAt: new Date(),
      })
      .where(eq(todos.id, id))
      .returning();
    
    if (!updated) {
      return c.json({ error: 'Todo not found' }, 404);
    }
    
    return c.json(updated);
  } catch (error) {
    console.error('Error updating todo:', error);
    return c.json({ error: 'Failed to update todo' }, 500);
  }
});

// Delete todo
app.delete('/api/todos/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);
    
    const [deleted] = await db.delete(todos)
      .where(eq(todos.id, id))
      .returning();
    
    if (!deleted) {
      return c.json({ error: 'Todo not found' }, 404);
    }
    
    return c.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return c.json({ error: 'Failed to delete todo' }, 500);
  }
});

app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;