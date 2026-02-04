'use server'

import { asc, eq } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { workspacesRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'

type GetWorkspacesParams = { userId: string }

export async function getWorkspaces({ userId }: GetWorkspacesParams) {
  // const [cachedWorkspaces, _getCacheError] = await handle(cacheRepository.get<Workspace[]>(`${userId}:workspaces`))

  // if (cachedWorkspaces) {
  //   return cachedWorkspaces
  // }

  const [workspaces, queryError] = await handle(
    db
      .select({
        workspaceId: workspacesRepository.workspaceId,
        userId: workspacesRepository.userId,
        name: workspacesRepository.name,
      })
      .from(workspacesRepository)
      .where(eq(workspacesRepository.userId, userId))
      .orderBy(asc(workspacesRepository.createdAt)),
  )

  if (queryError) {
    throw queryError.message
  }

  // await handle(cacheRepository.set(`${userId}:workspaces`, JSON.stringify(workspaces)))

  return workspaces
}

export const getUserWorkspaces = async (params: GetWorkspacesParams) => getWorkspaces(params)
