'use server'

import { asc, eq } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { workspacesRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { Workspace } from '@/utils/types'

type GetWorkspacesParams = { userId: string }

export async function getWorkspaces({ userId }: GetWorkspacesParams) {
  const [cached, _getCacheError] = await handle(cacheRepository.get<Workspace[]>(`${userId}:workspaces`))

  if (cached) {
    return cached
  }

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

  if (workspaces.length > 0) {
    await cacheRepository.set(`${userId}:workspaces`, JSON.stringify(workspaces))
  }

  return workspaces
}

export const getUserWorkspaces = async (params: GetWorkspacesParams) => getWorkspaces(params)
