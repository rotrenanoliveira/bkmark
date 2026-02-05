import { and, asc, eq } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { Folder } from '@/utils/types'

export async function getWorkspaceFolders(userId: string, workspaceId: string) {
  const [cached, _] = await handle(cacheRepository.get<Folder[]>(`${userId}:workspace:${workspaceId}:folders`))

  if (cached) {
    return cached
  }

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

  if (folders.length > 0) {
    await cacheRepository.set(`${userId}:workspace:${workspaceId}:folders`, JSON.stringify(folders))
  }

  return folders
}
