'use server'

import { and, desc, eq, ilike, type SQL } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import { getUserId } from './get-user-id'

export async function searchBookmarks(search: string | null) {
  const userId = await getUserId()

  if (!userId) {
    return []
  }

  if (!search) {
    return []
  }

  const conditions: SQL[] = []

  if (search) {
    conditions.push(
      ilike(bookmarksRepository.title, `%${search}%`),
      ilike(bookmarksRepository.bookmarkUrl, `%${search}%`),
    )
  }

  const [bookmarks, queryError] = await handle(
    db
      .select({
        bookmarkId: bookmarksRepository.bookmarkId,
        bookmarkUrl: bookmarksRepository.bookmarkUrl,
        title: bookmarksRepository.title,
        favicon: bookmarksRepository.favicon,
      })
      .from(bookmarksRepository)
      .where(and(...conditions, eq(bookmarksRepository.userId, userId)))
      .orderBy(desc(bookmarksRepository.createdAt)),
  )

  if (queryError) {
    throw queryError.message
  }

  return bookmarks
}
