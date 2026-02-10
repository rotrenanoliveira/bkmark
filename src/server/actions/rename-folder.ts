'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { updateFolder } from '../data/update-folder'

const renameFolderSchema = z.object({
  'folder-id': z.string(),
  'folder-name': z.string(),
})

export async function actionRenameFolder(data: FormData) {
  const formResult = renameFolderSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    return { success: false, message: z.prettifyError(formResult.error).replace('✖ ', '') }
  }

  const [_, updateError] = await updateFolder({
    folderId: formResult.data['folder-id'],
    name: formResult.data['folder-name'],
  })

  if (updateError) {
    return updateError
  }

  revalidatePath('/', 'layout')
  revalidatePath(`/folders/${formResult.data['folder-id']}`, 'layout')

  return { success: true, message: 'Folder rename successfully.' }
}
