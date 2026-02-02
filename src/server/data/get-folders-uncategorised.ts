'use server'

import { and, asc, eq, isNull } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'

export async function getFoldersUncategorised(userId: string) {
  // const [cachedFolders, _getCacheError] = await handle(cacheRepository.get<Folder[]>(`${userId}:folders`))

  // if (cachedFolders) {
  //   return cachedFolders
  // }

  const [folders, queryError] = await handle(
    db
      .select({
        folderId: foldersRepository.folderId,
        userId: foldersRepository.userId,
        name: foldersRepository.name,
        workspaceId: foldersRepository.workspaceId,
      })
      .from(foldersRepository)
      .where(and(eq(foldersRepository.userId, userId), isNull(foldersRepository.workspaceId)))
      .orderBy(asc(foldersRepository.createdAt)),
  )

  if (queryError) {
    throw queryError.message
  }

  // await handle(cacheRepository.set(`${userId}:folders`, JSON.stringify(folders)))

  return folders
}
