'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { ResponseError } from '@/utils/types'

export async function removeFolder(folderId: string): Promise<[null, null] | [null, ResponseError]> {
  const [_, queryError] = await handle(db.delete(foldersRepository).where(eq(foldersRepository.folderId, folderId)))

  if (queryError) {
    return [null, queryError]
  }

  return [null, null]
}
