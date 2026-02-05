import { eq } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { workspacesRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { ResponseError } from '@/utils/types'

type WorkspaceUpdateInput = { workspaceId: string; name: string }

export async function updateWorkspace(data: WorkspaceUpdateInput): Promise<[null, null] | [null, ResponseError]> {
  if (!data.workspaceId && !data.name) {
    return [null, { success: false, message: 'Invalid parameters.' }]
  }

  const [workspaceResult, mutationResult] = await db.transaction(async (tx) => {
    const workspaceResult = await handle(
      tx
        .select({
          user: workspacesRepository.userId,
          workspace: workspacesRepository.workspaceId,
        })
        .from(workspacesRepository)
        .where(eq(workspacesRepository.workspaceId, data.workspaceId)),
    )

    const mutationResult = await handle(
      tx
        .update(workspacesRepository)
        .set({ name: data.name })
        .where(eq(workspacesRepository.workspaceId, data.workspaceId)),
    )

    return [workspaceResult, mutationResult]
  })

  const [workspace, queryError] = workspaceResult
  const [_, mutationError] = mutationResult

  if (mutationError || queryError) {
    return [null, mutationError || queryError]
  }

  await cacheRepository.delete(`${workspace[0].user}:workspaces`)

  return [null, null]
}
