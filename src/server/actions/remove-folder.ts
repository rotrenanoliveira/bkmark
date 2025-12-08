'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { removeFolder } from '../data/remove-folder'

export async function actionRemoveFolder(folderId: string) {
  const [_, queryError] = await removeFolder(folderId)

  if (queryError) {
    return { success: false, message: queryError.message }
  }

  revalidatePath('/', 'layout')
  revalidateTag('bookmarks', 'max')
  revalidateTag(`bookmarks-${folderId}`, 'max')

  return { success: true, message: 'Folder removed successfully.' }
}
