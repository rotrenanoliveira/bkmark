'use server'

import { revalidatePath } from 'next/cache'
import { getBookmark } from '../data/get-bookmark'
import { updateBookmark } from '../data/update-bookmark'

interface ActionProps {
  bookmarkId: string
  folderId: string
}

export async function actionAddBookmarkToFolder({ bookmarkId, folderId }: ActionProps) {
  const [_currentBookmark, bookmarkError] = await getBookmark(bookmarkId)

  if (bookmarkError) {
    return bookmarkError
  }

  const [_updateResponse, updateError] = await updateBookmark({ bookmarkId, folderId })

  if (updateError) {
    return updateError
  }

  revalidatePath('/', 'layout')

  return { success: true, message: 'Bookmark added to folder.' }
}
