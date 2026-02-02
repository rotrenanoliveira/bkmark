import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'

export async function getWorkspaceFolders(userId: string, workspaceId: string) {
  // const [bookmarksOnCache, _getCacheError] = await handle(
  //   cacheRepository.get<BookmarkPresenter[]>(`${userId}:workspace:${workspaceId}`),
  // )

  // if (bookmarksOnCache) {
  //   return bookmarksOnCache
  // }

  const [folders, queryError] = await handle(
    db
      .select({
        userId: foldersRepository.userId,
        folderId: foldersRepository.folderId,
        workspaceId: foldersRepository.workspaceId,
        name: foldersRepository.name,
      })
      .from(foldersRepository)
      .where(and(eq(foldersRepository.userId, userId), eq(foldersRepository.workspaceId, workspaceId)))
      .orderBy(asc(foldersRepository.createdAt)),
  )

  if (queryError) {
    throw queryError.message
  }

  // await handle(cacheRepository.set(`${userId}:workspace:${workspaceId}`, JSON.stringify(bookmarks)))

  return folders
}
