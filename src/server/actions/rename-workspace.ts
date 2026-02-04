'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { formatZodError } from '@/utils/functions'
import { updateWorkspace } from '../data/update-workspace'

const renameWorkspaceSchema = z.object({
  'workspace-id': z.string(),
  'workspace-name': z.string(),
})

export async function actionRenameWorkspace(data: FormData) {
  const formResult = renameWorkspaceSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    const zodErrors = formatZodError(formResult.error)
    const validationErrors = { error: [`Validation Error at ${zodErrors[0].field} - ${zodErrors[0].message}`] }
    const message = validationErrors.error.join('. ')

    return { success: false, message }
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
