'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'

import { formatZodError } from '@/utils/functions'
import { createBookmark } from '../data/create-bookmark'
import { getUrlData } from '../data/get-url-data'
import { getUserId } from '../data/get-user-id'

const addBookmarkSchema = z.object({
  url: z
    .string()
    .transform((value) => (value.includes('://') ? value : `https://${value}`))
    .refine((value) => value.match(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/)),
})

export async function actionAddBookmark(data: FormData) {
  const formResult = addBookmarkSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    const zodErrors = formatZodError(formResult.error)
    const validationErrors = { error: [`Validation Error at ${zodErrors[0].field} - ${zodErrors[0].message}`] }
    const message = validationErrors.error.join('. ')

    return { success: false, message }
  }

  const [bookmarkData, getUrlDataError] = await getUrlData({ url: formResult.data.url })

  const userId = await getUserId()

  if (!userId) {
    return { success: false, message: 'User not found.' }
  }

  const bookmark = bookmarkData ? { ...bookmarkData, userId } : { title: 'No title', bookmarkUrl: formResult.data.url }

  const [_, createBookmarkError] = await createBookmark({
    ...bookmark,
    userId,
  })

  if (createBookmarkError) {
    return createBookmarkError
  }

  revalidatePath('/', 'layout')
  revalidateTag('bookmarks', 'max')

  if (getUrlDataError) {
    return getUrlDataError
  }

  return { success: true, message: 'Bookmark added successfully.' }
}
