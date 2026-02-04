'use server'

import { revalidatePath } from 'next/cache'
import { handle } from '@/utils/functions'
import { getFolder } from '../data/get-folder'
import { updateFolder } from '../data/update-folder'

interface ActionProps {
  folderId: string
  workspaceId: string | null
}

export async function actionMoveFolderToWorkspace({ folderId, workspaceId }: ActionProps) {
  const [_currentFolder, resultError] = await handle(getFolder(folderId))

  if (resultError) {
    return resultError
  }

  const [_updateResponse, updateError] = await updateFolder({ folderId, workspaceId })

  if (updateError) {
    return updateError
  }

  revalidatePath('/', 'layout')
  revalidatePath(`/folders/${folderId}`, 'layout')

  if (workspaceId) {
    revalidatePath(`/workspaces/${workspaceId}`, 'layout')
  }

  return { success: true, message: 'Bookmark added to folder.' }
}
