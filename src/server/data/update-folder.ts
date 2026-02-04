import { eq } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { FolderUpdateInput, ResponseError } from '@/utils/types'

export async function updateFolder(data: FolderUpdateInput): Promise<[null, null] | [null, ResponseError]> {
  if (!data.folderId && data.workspaceId === undefined) {
    return [null, { success: false, message: 'Invalid parameters.' }]
  }

  const queryData = {
    ...(data.workspaceId !== undefined && { workspaceId: data.workspaceId }),
    ...(data.name && { name: data.name }),
  }

  const [folderResult, mutationResult] = await db.transaction(async (tx) => {
    const folderResult = await handle(
      tx
        .select({
          user: foldersRepository.userId,
          folder: foldersRepository.folderId,
          workspace: foldersRepository.workspaceId,
        })
        .from(foldersRepository)
        .where(eq(foldersRepository.folderId, data.folderId)),
    )

    const mutationResult = await handle(
      tx.update(foldersRepository).set(queryData).where(eq(foldersRepository.folderId, data.folderId)),
    )

    return [folderResult, mutationResult]
  })

  const [folder, queryError] = folderResult
  const [_, mutationError] = mutationResult

  if (mutationError || queryError) {
    return [null, mutationError || queryError]
  }

  await cacheRepository.mdel([
    `${folder[0].user}:folders`, // remove user folders from cache
    `${folder[0].user}:folder:${data.folderId}`, // remove folder from cache
    `${folder[0].user}:workspace:${folder[0].workspace}`, // remove previous workspace from cache
    `${folder[0].user}:workspace:${data.workspaceId}`, // remove "new" workspace from cache
  ])

  return [null, null]
}
