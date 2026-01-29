'use server'

import { revalidatePath } from 'next/cache'
import { getBookmark } from '../data/get-bookmark'
import { updateBookmark } from '../data/update-bookmark'

interface ActionProps {
  bookmarkId: string
}

export async function actionRemoveBookmarkFromFolder({ bookmarkId }: ActionProps) {
  const [_currentBookmark, bookmarkError] = await getBookmark(bookmarkId)

  if (bookmarkError) {
    return bookmarkError
  }

  const [_, updateError] = await updateBookmark({ bookmarkId, folderId: null })

  if (updateError) {
    return updateError
  }

  revalidatePath('/', 'layout')

  return { success: true, message: 'Bookmark added to folder.' }
}
