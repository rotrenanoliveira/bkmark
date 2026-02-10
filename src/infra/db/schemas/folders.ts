import { foreignKey, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { generateNanoId } from '@/lib/nanoid'
import { workspaces } from './workspaces'

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
    workspaceId: text(),
  },
  (table) => [
    index('folders_user_id_idx').on(table.userId),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.workspaceId],
      name: 'folders_workspace_id_fk',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
