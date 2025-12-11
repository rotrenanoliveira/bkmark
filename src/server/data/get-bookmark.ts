import { eq } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { Bookmark, ResponseError } from '@/utils/types'

export async function getBookmark(bookmarkId: string): Promise<[Bookmark, null] | [null, ResponseError]> {
  const [bookmark, queryError] = await handle(
    db
      .select()
      .from(bookmarksRepository)
      .where(eq(bookmarksRepository.bookmarkId, bookmarkId))
      .then((result) => (result.length > 0 ? result[0] : null)),
  )

  if (queryError) {
    return [null, queryError]
  }

  if (!bookmark) {
    return [null, { success: false, message: 'Bookmark not found' }]
  }

  return [bookmark, null]
}
