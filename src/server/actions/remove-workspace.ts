'use server'

import { revalidatePath } from 'next/cache'
import { removeWorkspace } from '../data/remove-workspace'

export async function actionRemoveWorkspace(workspaceId: string) {
  const [_, queryError] = await removeWorkspace(workspaceId)

  if (queryError) {
    return { success: false, message: queryError.message }
  }

  revalidatePath('/', 'layout')

  return { success: true, message: 'Workspace removed successfully.' }
}
