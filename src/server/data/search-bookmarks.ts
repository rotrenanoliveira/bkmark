'use server'

import { and, desc, eq, ilike, or } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import { getUserId } from './get-user-id'

export async function searchBookmarks(search: string | null) {
  const userId = await getUserId()

  if (!search) {
    return []
  }

  const [bookmarks, bookmarksQueryError] = await handle(
    db
      .select({
        id: bookmarksRepository.bookmarkId,
        url: bookmarksRepository.bookmarkUrl,
        title: bookmarksRepository.title,
        favicon: bookmarksRepository.favicon,
      })
      .from(bookmarksRepository)
      .where(
        and(
          eq(bookmarksRepository.userId, userId),
          or(ilike(bookmarksRepository.title, `%${search}%`), ilike(bookmarksRepository.bookmarkUrl, `%${search}%`)),
        ),
      )
      .orderBy(desc(bookmarksRepository.createdAt)),
  )

  if (bookmarksQueryError) {
    throw bookmarksQueryError.message
  }

  return bookmarks
}
