/**
 * Cloudflare Worker API
 * 
 * TODO: Add your API endpoints here
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';

// Define your environment bindings
type Bindings = {
  DB: D1Database;
  // TODO: Add other bindings as needed (KV, R2, etc.)
};

// Create Hono app with typed bindings
const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for frontend
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Health check endpoint
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// TODO: Add your API routes here
// Example routes:

/*
// Get all items
app.get('/api/items', async (c) => {
  const db = c.env.DB;
  const result = await db.prepare('SELECT * FROM items').all();
  return c.json(result.results);
});

// Get single item
app.get('/api/items/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;
  const result = await db.prepare('SELECT * FROM items WHERE id = ?').bind(id).first();
  
  if (!result) {
    return c.json({ error: 'Item not found' }, 404);
  }
  
  return c.json(result);
});

// Create item
app.post('/api/items', async (c) => {
  const body = await c.req.json();
  const db = c.env.DB;
  
  // TODO: Add validation
  
  const result = await db.prepare(
    'INSERT INTO items (name, description) VALUES (?, ?)'
  ).bind(body.name, body.description).run();
  
  return c.json({ id: result.meta.last_row_id }, 201);
});

// Update item
app.put('/api/items/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const db = c.env.DB;
  
  // TODO: Add validation
  
  const result = await db.prepare(
    'UPDATE items SET name = ?, description = ? WHERE id = ?'
  ).bind(body.name, body.description, id).run();
  
  if (result.meta.changes === 0) {
    return c.json({ error: 'Item not found' }, 404);
  }
  
  return c.json({ success: true });
});

// Delete item
app.delete('/api/items/:id', async (c) => {
  const id = c.req.param('id');
  const db = c.env.DB;
  
  const result = await db.prepare('DELETE FROM items WHERE id = ?').bind(id).run();
  
  if (result.meta.changes === 0) {
    return c.json({ error: 'Item not found' }, 404);
  }
  
  return c.json({ success: true });
});
*/

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;