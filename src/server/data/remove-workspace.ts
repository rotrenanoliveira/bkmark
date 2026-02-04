'use server'

import { eq } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { workspacesRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { ResponseError } from '@/utils/types'

export async function removeWorkspace(workspaceId: string): Promise<[null, null] | [null, ResponseError]> {
  const [workspace, queryError] = await handle(
    db.delete(workspacesRepository).where(eq(workspacesRepository.workspaceId, workspaceId)).returning({
      user: workspacesRepository.userId,
      workspace: workspacesRepository.workspaceId,
    }),
  )

  if (queryError) {
    return [null, queryError]
  }

  await cacheRepository.mdel([
    `${workspace[0].user}:workspaces`, // remove workspaces from cache
    `${workspace[0].user}:workspaces:${workspace[0].workspace}`, // remove this workspaces from cache
  ])

  return [null, null]
}
