'use server'

import { revalidatePath } from 'next/cache'
import { handle } from '@/utils/functions'
import { getFolder } from '../data/get-folder'
import { updateFolder } from '../data/update-folder'

interface ActionProps {
  folderId: string
}

export async function actionRemoveFolderFromWorkspace({ folderId }: ActionProps) {
  const [currentFolder, resultError] = await handle(getFolder(folderId))

  if (resultError) {
    return resultError
  }

  const [_, updateError] = await updateFolder({ folderId, workspaceId: null })

  if (updateError) {
    return updateError
  }

  revalidatePath('/', 'layout')
  revalidatePath(`/workspaces/${currentFolder?.workspaceId}`, 'page')

  return { success: true, message: 'Bookmark added to folder.' }
}
