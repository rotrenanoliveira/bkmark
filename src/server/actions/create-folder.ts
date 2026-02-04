'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createFolder } from '../data/create-folder'
import { getUserId } from '../data/get-user-id'

const createFolderSchema = z.object({
  folder: z.string().min(1, { message: 'Invalid folder name.' }),
  workspace: z.string().nullish(),
})

export async function actionCreateFolder(data: FormData) {
  const formResult = createFolderSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    return { success: false, message: z.prettifyError(formResult.error).replace('✖ ', '') }
  }

  const userId = await getUserId()

  const workspaceId = formResult.data.workspace

  const [_, error] = await createFolder({
    name: formResult.data.folder,
    userId,
    ...(workspaceId && { workspaceId }),
  })

  if (error) {
    return error
  }

  revalidatePath('/', 'layout')

  return { success: true, message: `Folder ${formResult.data.folder} created successfully.` }
}
