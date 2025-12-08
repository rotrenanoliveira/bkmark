'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'

import { formatZodError } from '@/utils/functions'
import { updateBookmark } from '../data/update-bookmark'

const renameBookmarkSchema = z.object({
  bookmarkId: z.string(),
  title: z.string(),
})

export async function actionRenameBookmark(data: FormData) {
  const formResult = renameBookmarkSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    const zodErrors = formatZodError(formResult.error)
    const validationErrors = { error: [`Validation Error at ${zodErrors[0].field} - ${zodErrors[0].message}`] }
    const message = validationErrors.error.join('. ')

    return { success: false, message }
  }

  const [_, updateError] = await updateBookmark({
    bookmarkId: formResult.data.bookmarkId,
    title: formResult.data.title,
  })

  if (updateError) {
    return updateError
  }

  revalidatePath('/', 'layout')
  revalidateTag('bookmarks', 'max')

  return { success: true, message: 'Bookmark rename successfully.' }
}
