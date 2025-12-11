'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { ResponseError } from '@/utils/types'

export async function removeBookmark(bookmarkId: string): Promise<[null, null] | [null, ResponseError]> {
  const [_, queryError] = await handle(
    db.delete(bookmarksRepository).where(eq(bookmarksRepository.bookmarkId, bookmarkId)),
  )

  if (queryError) {
    return [null, queryError]
  }

  return [null, null]
}
