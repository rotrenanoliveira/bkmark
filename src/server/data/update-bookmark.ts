import { eq } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { BookmarkUpdateInput, ResponseError } from '@/utils/types'

export async function updateBookmark(data: BookmarkUpdateInput): Promise<[null, null] | [null, ResponseError]> {
  if (!data.title && !data.folderId && !data.workspaceId) {
    return [null, { success: false, message: 'Invalid parameters. Please provide a title, folderId or workspaceId.' }]
  }

  const query = {
    ...(data.title && { title: data.title }),
    ...(data.folderId && { folderId: data.folderId }),
    ...(data.workspaceId && { workspaceId: data.workspaceId }),
  }

  const [bookmarkResult, mutationResult] = await db.transaction(async (tx) => {
    const bookmarkResult = await handle(
      tx
        .select({
          user: bookmarksRepository.userId,
          folder: bookmarksRepository.folderId,
          workspace: bookmarksRepository.workspaceId,
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
    `${bookmark[0].user}:workspace:${bookmark[0].workspace}`, // remove previous workspace from cache
    `${bookmark[0].user}:workspace:${query.workspaceId}`, // remove "new" workspace from cache
  ])

  return [null, null]
}
