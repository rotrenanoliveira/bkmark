import { foreignKey, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { generateNanoId } from '@/lib/nanoid'
import { folders } from './folders'
import { workspaces } from './workspaces'

export const bookmarks = pgTable(
  'bookmarks',
  {
    bookmarkId: text()
      .primaryKey()
      .notNull()
      .$default(() => generateNanoId()),
    userId: text().notNull(),
    bookmarkUrl: text().notNull(),
    title: text().notNull(),
    favicon: text(),
    description: text(),
    ogImage: text(),
    createdAt: timestamp().notNull().defaultNow(),
    folderId: text(),
    workspaceId: text(),
  },
  (table) => [
    index('bookmarks_userId_idx').on(table.userId),
    foreignKey({
      columns: [table.folderId],
      foreignColumns: [folders.folderId],
      name: 'bookmarks_folderId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.workspaceId],
      name: 'bookmarks_workspaceId_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
