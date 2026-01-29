'use server'

import { and, asc, eq, ilike } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import { getUserId } from './get-user-id'

export async function searchFolders(search: string | null) {
  const userId = await getUserId()

  if (!search) {
    return []
  }

  const [folders, foldersQueryError] = await handle(
    db
      .select({
        id: foldersRepository.folderId,
        name: foldersRepository.name,
      })
      .from(foldersRepository)
      .where(and(eq(foldersRepository.userId, userId), ilike(foldersRepository.name, `%${search}%`)))
      .orderBy(asc(foldersRepository.name)),
  )

  if (foldersQueryError) {
    throw foldersQueryError.message
  }

  return folders
}
