import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'

export async function getFolderBookmarks(userId: string, folderId: string) {
  const [bookmarks, queryError] = await handle(
    db
      .select({
        userId: bookmarksRepository.userId,
        bookmarkId: bookmarksRepository.bookmarkId,
        bookmarkUrl: bookmarksRepository.bookmarkUrl,
        favicon: bookmarksRepository.favicon,
        title: bookmarksRepository.title,
        folderId: bookmarksRepository.folderId,
        workspaceId: bookmarksRepository.workspaceId,
        createdAt: bookmarksRepository.createdAt,
      })
      .from(bookmarksRepository)
      .where(and(eq(bookmarksRepository.userId, userId), eq(bookmarksRepository.folderId, folderId)))
      .orderBy(desc(bookmarksRepository.createdAt)),
  )

  if (queryError) {
    throw queryError.message
  }

  return bookmarks
}
