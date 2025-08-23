/**
 * Database Schema for Example Todo App
 * 
 * This demonstrates a simple todo list to show frontend-backend communication
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Todos table - simple example of CRUD operations
export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  text: text('text').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Export type helpers for TypeScript
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;