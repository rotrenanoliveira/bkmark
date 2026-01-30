import { and, desc, eq } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { BookmarkPresenter } from '@/utils/types'

export async function getFolderBookmarks(userId: string, folderId: string) {
  const [bookmarksOnCache, _getCacheError] = await handle(
    cacheRepository.get<BookmarkPresenter[]>(`${userId}:folder:${folderId}`),
  )

  if (bookmarksOnCache) {
    return bookmarksOnCache
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
      .where(and(eq(bookmarksRepository.userId, userId), eq(bookmarksRepository.folderId, folderId)))
      .orderBy(desc(bookmarksRepository.createdAt)),
  )

  if (queryError) {
    throw queryError.message
  }

  const [_, setCacheError] = await handle(
    cacheRepository.set(`${userId}:folder:${folderId}`, JSON.stringify(bookmarks)),
  )

  if (setCacheError) {
    throw setCacheError.message
  }

  return bookmarks
}
