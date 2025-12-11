'use server'

import { eq } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'

export async function getFolders(userId: string) {
  const [folders, queryError] = await handle(
    db.select().from(foldersRepository).where(eq(foldersRepository.userId, userId)),
  )

  if (queryError) {
    return { folders: [] }
  }

  return { folders }
}

/** Get all folders for a user and cache them at nextjs level */
export const getUserFolders = unstable_cache(
  async (userId) => {
    return await getFolders(userId)
  },
  ['folders'],
  { revalidate: 3600, tags: ['folders'] },
)
