'use server'

import { eq } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { workspacesRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { Workspace } from '@/utils/types'

export async function getWorkspaces(userId: string) {
  const [cachedWorkspaces, _getCacheError] = await handle(cacheRepository.get<Workspace[]>(`${userId}:workspaces`))

  if (cachedWorkspaces) {
    return cachedWorkspaces
  }

  const [workspaces, queryError] = await handle(
    db
      .select({
        workspaceId: workspacesRepository.workspaceId,
        userId: workspacesRepository.userId,
        name: workspacesRepository.name,
      })
      .from(workspacesRepository)
      .where(eq(workspacesRepository.userId, userId)),
  )

  if (queryError) {
    throw queryError.message
  }

  await handle(cacheRepository.set(`${userId}:workspaces`, JSON.stringify(workspaces)))

  return workspaces
}

export const getUserWorkspaces = async (userId: string) => getWorkspaces(userId)
