-- Create todos table for the example app
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Add some example todos
INSERT INTO todos (text, completed, created_at, updated_at) VALUES 
  ('Check out the frontend code in src/App.tsx', 0, strftime('%s', 'now'), strftime('%s', 'now')),
  ('Look at the backend API in worker/index.ts', 0, strftime('%s', 'now'), strftime('%s', 'now')),
  ('Explore the database schema in drizzle/schema.ts', 0, strftime('%s', 'now'), strftime('%s', 'now')),
  ('Try adding a new todo above', 0, strftime('%s', 'now'), strftime('%s', 'now')),
  ('Deploy to Cloudflare Workers when ready', 0, strftime('%s', 'now'), strftime('%s', 'now'));