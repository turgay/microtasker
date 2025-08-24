import { pgTable, text, timestamp, boolean, uuid, pgEnum, json } from 'drizzle-orm/pg-core';

// Enums
export const priorityEnum = pgEnum('priority', ['High', 'Medium', 'Low']);
export const repeatTypeEnum = pgEnum('repeat_type', ['daily', 'weekly', 'custom', 'none']);
export const timeEstimateEnum = pgEnum('time_estimate', ['2-5 min', '5-10 min', '10+ min']);
export const categoryEnum = pgEnum('category', ['Read', 'Write', 'Speak', 'Learn', 'Pray', 'Break', 'Build']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  password_hash: text('password_hash').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  last_login: timestamp('last_login'),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Tasks table
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  category: categoryEnum('category'),
  tags: json('tags').default([]),
  priority: priorityEnum('priority'),
  completed: boolean('completed').default(false).notNull(),
  repeat: repeatTypeEnum('repeat').default('none').notNull(),
  time_estimate: timeEstimateEnum('time_estimate').notNull(),
  due_date: timestamp('due_date'),
  completed_at: timestamp('completed_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
