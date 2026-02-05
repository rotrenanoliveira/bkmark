'use server'

import { eq } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { ResponseError } from '@/utils/types'

export async function removeBookmark(bookmarkId: string): Promise<[null, null] | [null, ResponseError]> {
  const [bookmark, queryError] = await handle(
    db.delete(bookmarksRepository).where(eq(bookmarksRepository.bookmarkId, bookmarkId)).returning({
      user: bookmarksRepository.userId,
      folder: bookmarksRepository.folderId,
      workspace: bookmarksRepository.workspaceId,
    }),
  )

  if (queryError) {
    return [null, queryError]
  }

  await cacheRepository.mdel([
    `${bookmark[0].user}:bookmarks`,
    `${bookmark[0].user}:folder:${bookmark[0].folder}:bookmarks`,
    `${bookmark[0].user}:workspace:${bookmark[0].workspace}:bookmarks`,
  ])

  return [null, null]
}
