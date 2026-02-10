import { and, desc, eq, isNull, type SQL } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'

export async function getWorkspaceBookmarks(userId: string, workspaceId: string, folderId: string | null) {
  const conditions: SQL[] = []

  if (folderId) {
    conditions.push(eq(bookmarksRepository.folderId, folderId))
  } else {
    conditions.push(isNull(bookmarksRepository.folderId))
  }

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
      .where(
        and(eq(bookmarksRepository.userId, userId), eq(bookmarksRepository.workspaceId, workspaceId), ...conditions),
      )
      .orderBy(desc(bookmarksRepository.createdAt)),
  )

  if (queryError) {
    throw queryError.message
  }

  return bookmarks
}
