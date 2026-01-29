import { eq } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { BookmarkUpdateInput, ResponseError } from '@/utils/types'

export async function updateBookmark(data: BookmarkUpdateInput): Promise<[null, null] | [null, ResponseError]> {
  if (data.folderId === undefined && !data.title) {
    return [null, { success: false, message: 'Invalid parameters. Please provide a title or a folderId.' }]
  }

  const query = {
    ...(data.folderId !== undefined && { folderId: data.folderId }),
    ...(data.title && { title: data.title }),
  }

  const [bookmarkResult, mutationResult] = await db.transaction(async (tx) => {
    const bookmarkResult = await handle(
      tx
        .select({
          user: bookmarksRepository.userId,
          folder: bookmarksRepository.folderId,
        })
        .from(bookmarksRepository)
        .where(eq(bookmarksRepository.bookmarkId, data.bookmarkId)),
    )

    const mutationResult = await handle(
      tx.update(bookmarksRepository).set(query).where(eq(bookmarksRepository.bookmarkId, data.bookmarkId)),
    )

    return [bookmarkResult, mutationResult]
  })

  const [bookmark, queryError] = bookmarkResult
  const [_, mutationError] = mutationResult

  if (mutationError || queryError) {
    return [null, mutationError]
  }

  await cacheRepository.mdel([
    `${bookmark[0].user}:bookmarks`, // remove bookmarks from cache
    `${bookmark[0].user}:folder:${bookmark[0].folder}`, // remove previous folder from cache
    `${bookmark[0].user}:folder:${query.folderId}`, // remove "new" folder from cache
  ])

  return [null, null]
}
