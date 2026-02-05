import type { QueryResult } from '@neondatabase/serverless'
import { cacheRepository } from '@/infra/cache/cache-repository'
import { db } from '@/infra/db/drizzle'
import { foldersRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import type { FolderCreateInput, ResponseError } from '@/utils/types'

type FolderInsertResponse = QueryResult<never>

/** Insert a new folder into the database
 * @param {String} data.userId - The user ID of the user who is creating the folder
 * @param {String} data.name - The name of the folder
 */
export async function createFolder(
  data: FolderCreateInput,
): Promise<[FolderInsertResponse, null] | [null, ResponseError]> {
  const [result] = await Promise.all([
    handle(
      db.insert(foldersRepository).values({
        userId: data.userId,
        name: data.name,
        workspaceId: data.workspaceId,
      }),
    ),
    cacheRepository.mdel([`${data.userId}:folders`, `${data.userId}:workspace:${data.workspaceId}:folders`]),
  ])

  return result
}
