import {
    pgTable,
    varchar,
    timestamp,
    integer
} from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const urlTable = pgTable('url', {
    id: varchar('id').$defaultFn(() => createId()).primaryKey(),
    url: varchar('url').notNull().unique(),
    shortCode: varchar('short_code').notNull().unique(),
    accessCount: integer('access_count').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const table = {
    urlTable
} as const

export type Table = typeof table
export type InsertUrl = typeof urlTable.$inferInsert
export type SelectUrl = typeof urlTable.$inferSelect
