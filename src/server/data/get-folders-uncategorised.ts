'use server'

import { and, asc, eq, isNull } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { Folder } from '@/utils/types'

export async function getFoldersUncategorised(userId: string) {
  const [cached, _] = await handle(cacheRepository.get<Folder[]>(`${userId}:folders`))

  if (cached) {
    return cached
  }

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

  if (folders.length > 0) {
    await cacheRepository.set(`${userId}:folders`, JSON.stringify(folders))
  }

  return folders
}
