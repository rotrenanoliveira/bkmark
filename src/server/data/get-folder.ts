'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'

export async function getFolder(folderId: string) {
  const [folder, queryError] = await handle(
    db
      .select({
        folderId: foldersRepository.folderId,
        userId: foldersRepository.userId,
        name: foldersRepository.name,
        workspaceId: foldersRepository.workspaceId,
      })
      .from(foldersRepository)
      .where(eq(foldersRepository.folderId, folderId)),
  )

  if (queryError) {
    throw queryError.message
  }

  return folder.length > 0 ? folder[0] : null
}
