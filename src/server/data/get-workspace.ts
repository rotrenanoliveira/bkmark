'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { workspacesRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'

export async function getWorkspace(workspaceId: string) {
  const [folder, queryError] = await handle(
    db
      .select({
        workspaceId: workspacesRepository.workspaceId,
        userId: workspacesRepository.userId,
        name: workspacesRepository.name,
      })
      .from(workspacesRepository)
      .where(eq(workspacesRepository.workspaceId, workspaceId)),
  )

  if (queryError) {
    throw queryError.message
  }

  return folder.length > 0 ? folder[0] : null
}
