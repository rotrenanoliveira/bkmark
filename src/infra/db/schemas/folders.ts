import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { generateNanoId } from '@/lib/nanoid'

export const folders = pgTable(
  'folders',
  {
    folderId: text()
      .primaryKey()
      .notNull()
      .$default(() => generateNanoId()),
    userId: text().notNull(),
    name: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => [index('folders_user_id_idx').on(table.userId)],
)
