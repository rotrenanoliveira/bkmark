import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { workspacesRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { ResponseError, WorkspaceCreateInput } from '@/utils/types'

type WorkspaceInsertResponse = { workspaceId: string }[]

/**
 * Insert a new workspace into the database
 * @param {String} data.userId - The user ID of the user who is creating the workspace
 * @param {String} data.name - The name of the workspace
 */
export async function createWorkspace(
  data: WorkspaceCreateInput,
): Promise<[WorkspaceInsertResponse, null] | [null, ResponseError]> {
  const [result, _] = await Promise.all([
    handle(
      db
        .insert(workspacesRepository)
        .values({
          userId: data.userId,
          name: data.name,
        })
        .returning({
          workspaceId: workspacesRepository.workspaceId,
        }),
    ),
    cacheRepository.delete(`${data.userId}:workspaces`),
  ])

  return result
}
