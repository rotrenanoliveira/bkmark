'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { updateBookmark } from '../data/update-bookmark'

const renameBookmarkSchema = z.object({
  'bookmark-id': z.string(),
  'bookmark-title': z.string(),
})

export async function actionRenameBookmark(data: FormData) {
  const formResult = renameBookmarkSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    return { success: false, message: z.prettifyError(formResult.error).replace('✖ ', '') }
  }

  const [_, updateError] = await updateBookmark({
    bookmarkId: formResult.data['bookmark-id'],
    title: formResult.data['bookmark-title'],
  })

  if (updateError) {
    return updateError
  }

  revalidatePath('/', 'layout')

  return { success: true, message: 'Bookmark rename successfully.' }
}
