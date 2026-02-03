'use server'

import type { BookmarkPresenter } from '@/utils/types'
import { getUncategorisedBookmarks } from './get-bookmarks-uncategorised'
import { getFolderBookmarks } from './get-folder-bookmarks'
import { getWorkspaceBookmarks } from './get-workspace-bookmarks'

type GetBookmarksParams =
  | { userId: string }
  | { userId: string; folderId: string }
  | { userId: string; workspaceId: string }
  | { userId: string; workspaceId: string; folderId: string | null }

export async function getBookmarks(params: GetBookmarksParams): Promise<BookmarkPresenter[]> {
  if ('folderId' in params && params.folderId) {
    return getFolderBookmarks(params.userId, params.folderId)
  }

  if ('workspaceId' in params && 'folderId' in params) {
    return getWorkspaceBookmarks(params.userId, params.workspaceId, params.folderId)
  }

  if ('workspaceId' in params && !('folderId' in params)) {
    return getWorkspaceBookmarks(params.userId, params.workspaceId, null)
  }

  return getUncategorisedBookmarks(params.userId)
}

export const getUserBookmarks = async (params: GetBookmarksParams) => getBookmarks(params)
