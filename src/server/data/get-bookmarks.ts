'use server'

import type { Bookmark, BookmarkPresenter } from '@/utils/types'
import { getUncategorisedBookmarks } from './get-bookmarks-uncategorised'
import { getFolderBookmarks } from './get-folder-bookmarks'

/** Get all bookmarks for a user */
export async function getBookmarks(userId: string): Promise<BookmarkPresenter[]>
/** Get all unfolded bookmarks for a user */
export async function getBookmarks(userId: string, folderId: null): Promise<Bookmark[]>
/** Get all bookmarks for a user in a folder */
export async function getBookmarks(userId: string, folderId: string): Promise<Bookmark[]>

export async function getBookmarks(userId: string, folderId: string | null = null) {
  if (folderId === null) {
    return getUncategorisedBookmarks(userId)
  }

  return getFolderBookmarks(userId, folderId)
}

export const getUserBookmarks = async (userId: string) => getBookmarks(userId)
