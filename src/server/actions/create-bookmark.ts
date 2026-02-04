'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createBookmark } from '../data/create-bookmark'
import { getUrlData } from '../data/get-url-data'
import { getUserId } from '../data/get-user-id'

const addBookmarkSchema = z.object({
  url: z
    .string()
    .transform((value) => (value.includes('://') ? value : `https://${value}`))
    .refine((value) => value.match(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/), {
      message: 'Invalid URL',
    }),
  folder: z.string().min(1, { message: 'Invalid folder id' }).max(12, { message: 'Invalid folder id' }).nullish(),
  workspace: z.string().min(1, { message: 'Invalid folder id' }).max(12, { message: 'Invalid folder id' }).nullish(),
})

export async function actionCreateBookmark(data: FormData) {
  const formResult = addBookmarkSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    return { success: false, message: z.prettifyError(formResult.error).replace('✖ ', '') }
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
    // redirect(`/folders/${folderId}`)
  }

  if (workspaceId) {
    revalidatePath(`/workspaces/${workspaceId}`, 'layout')
    // redirect(`/workspaces/${workspaceId}`)
  }

  return { success: true, message: 'Bookmark added successfully.' }
}
