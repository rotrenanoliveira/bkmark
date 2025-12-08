import { prisma } from '@/lib/prisma'
import { handle } from '@/utils/functions'
import type { Bookmark, BookmarkUpdateInput, ResponseError } from '@/utils/types'

export async function updateBookmark(data: BookmarkUpdateInput): Promise<[Bookmark, null] | [null, ResponseError]> {
  if (data.folderId === undefined && !data.title) {
    return [null, { success: false, message: 'folderId or title is required' }]
  }

  const query = data.folderId !== undefined ? { folderId: data.folderId } : data.title ? { title: data.title } : {}

  return await handle(
    prisma.bookmark.update({
      where: { id: data.bookmarkId },
      data: query,
    }),
  )
}
