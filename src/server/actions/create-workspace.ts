'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createWorkspace } from '../data/create-workspace'
import { getUserId } from '../data/get-user-id'

const createWorkspaceSchema = z.object({
  workspace: z.string().min(1, { message: 'Invalid workspace name.' }),
})

export async function actionCreateWorkspace(data: FormData) {
  const formResult = createWorkspaceSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    return { success: false, message: z.prettifyError(formResult.error).replace('✖ ', '') }
  }

  const userId = await getUserId()

  const [_, registerError] = await createWorkspace({
    name: formResult.data.workspace,
    userId,
  })

  if (registerError) {
    return registerError
  }

  revalidatePath('/', 'layout')

  return { success: true, message: `Workspace ${formResult.data.workspace} created successfully.` }
}
