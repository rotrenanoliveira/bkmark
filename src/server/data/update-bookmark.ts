import { eq } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { BookmarkUpdateInput, ResponseError } from '@/utils/types'

export async function updateBookmark(data: BookmarkUpdateInput): Promise<[null, null] | [null, ResponseError]> {
  console.log('update data', data)

  if (data.folderId === undefined && !data.title) {
    return [null, { success: false, message: 'folderId or title is required' }]
  }

  const query = data.folderId !== undefined ? { folderId: data.folderId } : data.title ? { title: data.title } : {}

  console.log('update query', query)

  const [_, queryError] = await handle(
    db.update(bookmarksRepository).set(query).where(eq(bookmarksRepository.bookmarkId, data.bookmarkId)),
  )

  console.log('result', _)
  console.log('query error', queryError)

  if (queryError) {
    return [null, queryError]
  }

  return [null, null]
}
