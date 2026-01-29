'use server'

import { eq } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { Folder } from '@/utils/types'

export async function getFolders(userId: string) {
  const [cachedFolders, _getCacheError] = await handle(cacheRepository.get<Folder[]>(`${userId}:folders`))

  if (cachedFolders) {
    return cachedFolders
  }

  const [folders, queryError] = await handle(
    db
      .select({
        folderId: foldersRepository.folderId,
        userId: foldersRepository.userId,
        name: foldersRepository.name,
      })
      .from(foldersRepository)
      .where(eq(foldersRepository.userId, userId)),
  )

  if (queryError) {
    throw queryError.message
  }

  await handle(cacheRepository.set(`${userId}:folders`, JSON.stringify(folders)))

  return folders
}

export const getUserFolders = async (userId: string) => getFolders(userId)
