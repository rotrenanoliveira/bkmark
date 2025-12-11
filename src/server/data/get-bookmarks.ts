'use server'

import { and, desc, eq, isNull, type SQL } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'
import { db } from '@/infra/db/drizzle'
import { bookmarks as bookmarksRepository } from '@/infra/db/schemas'
import { handle } from '@/utils/functions'
import type { Bookmark } from '@/utils/types'

/** Get all bookmarks for a user */
export async function getBookmarks(userId: string | undefined): Promise<Bookmark[]>
/** Get all unfolded bookmarks for a user */
export async function getBookmarks(userId: string | undefined, folderId: null): Promise<Bookmark[]>
/** Get all bookmarks for a user in a folder */
export async function getBookmarks(userId: string | undefined, folderId: string): Promise<Bookmark[]>

export async function getBookmarks(userId: string | undefined, folderId: string | null = null) {
  if (userId === undefined) {
    return []
  }

  const conditions: SQL[] = []
  conditions.push(eq(bookmarksRepository.userId, userId))

  if (folderId) {
    conditions.push(eq(bookmarksRepository.folderId, folderId))
  }

  if (folderId === null) {
    conditions.push(isNull(bookmarksRepository.folderId))
  }

  const [bookmarks, queryError] = await handle(
    db
      .select()
      .from(bookmarksRepository)
      .where(and(...conditions))
      .orderBy(desc(bookmarksRepository.createdAt)),
  )

  if (queryError) {
    throw queryError.message
  }

  return bookmarks
}

/** Get all bookmarks for a user and cache them */
export const getUserBookmarks = unstable_cache(
  async (userId) => {
    return await getBookmarks(userId, null)
  },
  ['bookmarks'],
  { revalidate: 3600, tags: ['bookmarks', 'folders'] },
)
