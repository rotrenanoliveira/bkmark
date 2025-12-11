import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const folders = pgTable(
  'folders',
  {
    folderId: text().primaryKey().notNull(),
    userId: text().notNull(),
    name: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [index('folders_user_id_idx').on(table.userId)],
)
