'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

import { getBookmark } from '../data/get-bookmark'
import { updateBookmark } from '../data/update-bookmark'

interface ActionProps {
  bookmarkId: string
  folderId: string
}

export async function actionAddBookmarkToFolder({ bookmarkId, folderId }: ActionProps) {
  const [currentBookmark, bookmarkError] = await getBookmark(bookmarkId)

  if (bookmarkError) {
    return bookmarkError
  }

  const [_, updateError] = await updateBookmark({ bookmarkId, folderId })

  if (updateError) {
    return updateError
  }

  revalidatePath('/', 'layout')
  revalidateTag(`bookmarks-${currentBookmark.folderId}`, 'max')
  revalidateTag(`bookmarks-${folderId}`, 'max')

  return { success: true, message: 'Bookmark added to folder.' }
}
