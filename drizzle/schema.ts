/**
 * Database Schema
 * 
 * TODO: Define your database tables here
 * 
 * Example schema provided below - modify or replace as needed
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Example: Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // Use crypto.randomUUID() for IDs
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Example: Items table (generic resource)
export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  metadata: text('metadata', { mode: 'json' }), // Store JSON data
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// TODO: Add your tables here
// Tips:
// - Use text('id').primaryKey() with crypto.randomUUID() for IDs
// - Use integer('timestamp', { mode: 'timestamp' }) for dates
// - Use text('data', { mode: 'json' }) for JSON columns
// - Use integer('flag', { mode: 'boolean' }) for booleans
// - Add .references(() => table.column) for foreign keys

// Export type helpers for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;