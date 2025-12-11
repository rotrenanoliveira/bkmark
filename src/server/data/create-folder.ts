import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { FolderCreateInput, ResponseError } from '@/utils/types'

/** save folder to database */
export async function createFolder(data: FolderCreateInput): Promise<[null, null] | [null, ResponseError]> {
  const [_, queryError] = await handle(
    db.insert(foldersRepository).values({
      userId: data.userId,
      name: data.name,
    }),
  )

  if (queryError) {
    return [null, queryError]
  }

  return [null, null]
}
