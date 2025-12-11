import type { NeonHttpQueryResult } from 'drizzle-orm/neon-http'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { BookmarkCreateInput, ResponseError } from '@/utils/types'

type BookmarkInsertResponse = NeonHttpQueryResult<never>

/**
 * Insert a new bookmark into the database
 * @param {String} data.userId - The user ID of the user who is creating the bookmark
 * @param {String} data.bookmarkUrl - The URL of the bookmark
 * @param {String} data.title - The title of the bookmark
 * @param {String} data.favicon - The favicon of the bookmark
 * @param {String} data.description - The description of the bookmark
 * @param {String} data.ogImage - The Open Graph image of the bookmark
 * @returns
 */
export async function createBookmark(
  data: BookmarkCreateInput,
): Promise<[BookmarkInsertResponse, null] | [null, ResponseError]> {
  const result = await handle(
    db.insert(bookmarksRepository).values({
      userId: data.userId,
      bookmarkUrl: data.bookmarkUrl,
      title: data.title,
      favicon: data.favicon,
      description: data.description,
      ogImage: data.ogImage,
    }),
  )

  return result
}
