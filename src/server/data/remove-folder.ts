'use server'

import { eq } from 'drizzle-orm'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { ResponseError } from '@/utils/types'

export async function removeFolder(folderId: string): Promise<[null, null] | [null, ResponseError]> {
  const [bookmark, queryError] = await handle(
    db.delete(foldersRepository).where(eq(foldersRepository.folderId, folderId)).returning({
      user: foldersRepository.userId,
      folder: foldersRepository.folderId,
    }),
  )

  if (queryError) {
    return [null, queryError]
  }

  await cacheRepository.mdel([`${bookmark[0].user}:folders`, `${bookmark[0].user}:folder:${bookmark[0].folder}:*`])

  return [null, null]
}
