'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'

export async function getFolders(userId: string) {
  // TODO: testar não receber o userId mas buscar diretamente dos cookies
  const [folders, queryError] = await handle(
    db.select().from(foldersRepository).where(eq(foldersRepository.userId, userId)),
  )

  if (queryError) {
    return { folders: [] }
  }

  return { folders }
}

export const getUserFolders = async (userId: string) => getFolders(userId)
