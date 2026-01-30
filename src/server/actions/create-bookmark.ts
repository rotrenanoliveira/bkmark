'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
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
  folder: z.string().nullish(),
  workspace: z.string().nullish(),
})

export async function actionCreateBookmark(data: FormData) {
  const formResult = addBookmarkSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    const zodErrors = formatZodError(formResult.error)
    const validationErrors = { error: [`Validation Error at ${zodErrors[0].field} - ${zodErrors[0].message}`] }
    const message = validationErrors.error.join('. ')

    return { success: false, message }
  }

  const isYouTubeVideo =
    formResult.data.url.includes('youtube.com/watch?v=') || formResult.data.url.includes('youtu.be/')

  const [bookmarkData, getUrlDataError] = await getUrlData({
    url: formResult.data.url,
    ...(isYouTubeVideo && { fetcher: 'youtube-api' }),
  })

  const userId = await getUserId()

  const bookmark = bookmarkData ? { ...bookmarkData, userId } : { title: 'No title', bookmarkUrl: formResult.data.url }

  const folderId = formResult.data.folder
  const workspaceId = formResult.data.workspace

  const [_, actionError] = await createBookmark({
    ...bookmark,
    ...(folderId && { folderId }),
    ...(workspaceId && { workspaceId }),
    userId,
  })

  if (actionError) {
    return actionError
  }

  if (getUrlDataError) {
    return getUrlDataError
  }

  revalidatePath('/', 'layout')

  if (folderId) {
    revalidatePath(`/folders/${folderId}`, 'layout')
    redirect(`/folders/${folderId}`)
  }

  if (workspaceId) {
    revalidatePath(`/workspaces/${workspaceId}`, 'layout')
    redirect(`/workspaces/${workspaceId}`)
  }

  return { success: true, message: 'Bookmark added successfully.' }
}
