'use server'

import type { BookmarkPresenter } from '@/utils/types'
import { getUncategorisedBookmarks } from './get-bookmarks-uncategorised'
import { getFolderBookmarks } from './get-folder-bookmarks'
import { getWorkspaceBookmarks } from './get-workspace-bookmarks'

type GetBookmarksParams =
  | { userId: string }
  | { userId: string; folderId: string }
  | { userId: string; workspaceId: string }

export async function getBookmarks(params: GetBookmarksParams): Promise<BookmarkPresenter[]> {
  if ('folderId' in params) {
    return getFolderBookmarks(params.userId, params.folderId)
  }

  if ('workspaceId' in params) {
    return getWorkspaceBookmarks(params.userId, params.workspaceId)
  }

  return getUncategorisedBookmarks(params.userId)
}

export const getUserBookmarks = async (params: GetBookmarksParams) => getBookmarks(params)
