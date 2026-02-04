'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { updateWorkspace } from '../data/update-workspace'

const renameWorkspaceSchema = z.object({
  'workspace-id': z.string(),
  'workspace-name': z.string(),
})

export async function actionRenameWorkspace(data: FormData) {
  const formResult = renameWorkspaceSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    return { success: false, message: z.prettifyError(formResult.error).replace('✖ ', '') }
  }

  const [_, updateError] = await updateWorkspace({
    workspaceId: formResult.data['workspace-id'],
    name: formResult.data['workspace-name'],
  })

  if (updateError) {
    return updateError
  }

  revalidatePath('/', 'layout')
  revalidatePath(`/workspaces/${formResult.data['workspace-id']}`, 'layout')

  return { success: true, message: `Workspace renamed to ${formResult.data['workspace-name']} successfully.` }
}
