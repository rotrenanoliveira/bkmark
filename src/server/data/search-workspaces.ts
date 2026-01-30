'use server'

import { and, asc, eq, ilike } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { workspacesRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import { getUserId } from './get-user-id'

export async function searchWorkspaces(search: string | null) {
  const userId = await getUserId()

  if (!search) {
    return []
  }

  const [workspaces, workspacesQueryError] = await handle(
    db
      .select({
        id: workspacesRepository.workspaceId,
        name: workspacesRepository.name,
      })
      .from(workspacesRepository)
      .where(and(eq(workspacesRepository.userId, userId), ilike(workspacesRepository.name, `%${search}%`)))
      .orderBy(asc(workspacesRepository.name)),
  )

  if (workspacesQueryError) {
    throw workspacesQueryError.message
  }

  return workspaces
}
