'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { removeBookmark } from '../data/remove-bookmark'

export async function actionRemoveBookmark(bookmarkId: string) {
  const [_, queryError] = await removeBookmark(bookmarkId)

  if (queryError) {
    return { success: false, message: queryError.message }
  }

  revalidatePath('/', 'layout')
  revalidateTag('bookmarks', 'max')

  return { success: true, message: 'Bookmark removed successfully.' }
}
