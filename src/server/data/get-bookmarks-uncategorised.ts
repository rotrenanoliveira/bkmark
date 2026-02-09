import { and, desc, eq, isNull } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { BookmarkPresenter } from '@/utils/types'

export async function getBookmarksUncategorised(userId: string) {
  const [cached, _] = await handle(cacheRepository.get<BookmarkPresenter[]>(`${userId}:bookmarks`))

  if (cached) {
    return cached
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
        and(
          eq(bookmarksRepository.userId, userId),
          isNull(bookmarksRepository.folderId),
          isNull(bookmarksRepository.workspaceId),
        ),
      )
      .orderBy(desc(bookmarksRepository.createdAt)),
  )

  if (queryError) {
    throw queryError.message
  }

  if (bookmarks.length > 0) {
    await cacheRepository.set(`${userId}:bookmarks`, JSON.stringify(bookmarks))
  }

  return bookmarks
}
