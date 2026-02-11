'use server'

import { and, asc, desc, eq, ilike, or } from 'drizzle-orm'
import { db } from '@/infra/db/drizzle'
import { bookmarksRepository, foldersRepository, workspacesRepository } from '@/infra/db/repositories'
import { handle } from '@/utils/functions'
import { getUserId } from './get-user-id'

export async function searchItems(search: string | null) {
  const userId = await getUserId()

  if (!search) {
    return { bookmarks: [], folders: [], workspaces: [] }
  }

  const [bookmarksResult, foldersResult, workspaceResult] = await Promise.all([
    handle(
      db
        .select({
          id: bookmarksRepository.bookmarkId,
          url: bookmarksRepository.bookmarkUrl,
          title: bookmarksRepository.title,
          favicon: bookmarksRepository.favicon,
        })
        .from(bookmarksRepository)
        .where(
          and(
            eq(bookmarksRepository.userId, userId),
            or(ilike(bookmarksRepository.title, `%${search}%`), ilike(bookmarksRepository.bookmarkUrl, `%${search}%`)),
          ),
        )
        .orderBy(desc(bookmarksRepository.createdAt)),
    ),
    handle(
      db
        .select({
          id: foldersRepository.folderId,
          name: foldersRepository.name,
          parent: workspacesRepository.name,
        })
        .from(foldersRepository)
        .where(and(eq(foldersRepository.userId, userId), ilike(foldersRepository.name, `%${search}%`)))
        .leftJoin(workspacesRepository, eq(foldersRepository.workspaceId, workspacesRepository.workspaceId))
        .orderBy(asc(foldersRepository.name)),
    ),
    handle(
      db
        .select({
          id: workspacesRepository.workspaceId,
          name: workspacesRepository.name,
        })
        .from(workspacesRepository)
        .where(and(eq(workspacesRepository.userId, userId), ilike(workspacesRepository.name, `%${search}%`)))
        .orderBy(asc(workspacesRepository.name)),
    ),
  ])

  const [bookmarks, bookmarksQueryError] = bookmarksResult
  const [folders, foldersQueryError] = foldersResult
  const [workspaces, workspacesQueryError] = workspaceResult

  if (bookmarksQueryError) {
    throw bookmarksQueryError.message
  }

  if (foldersQueryError) {
    throw foldersQueryError.message
  }

  if (workspacesQueryError) {
    throw workspacesQueryError.message
  }

  return { bookmarks, folders, workspaces }
}
