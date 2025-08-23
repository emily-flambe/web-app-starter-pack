/**
 * PostgreSQL Schema Option (using Neon)
 * 
 * To use PostgreSQL instead of D1:
 * 1. Sign up for Neon (https://neon.tech) - free tier available
 * 2. Install: npm install @neondatabase/serverless drizzle-orm
 * 3. Add connection string to .dev.vars: DATABASE_URL=postgresql://...
 * 4. Use this schema instead of schema.ts
 */

import { pgTable, text, integer, boolean, timestamp, serial } from 'drizzle-orm/pg-core';

// PostgreSQL version of the todos table
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Type inference for TypeScript (same as SQLite version)
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;