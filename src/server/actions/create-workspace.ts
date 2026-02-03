'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { formatZodError } from '@/utils/functions'
import { createWorkspace } from '../data/create-workspace'
import { getUserId } from '../data/get-user-id'

const createWorkspaceSchema = z.object({
  workspace: z.string().min(1, { message: 'Invalid workspace name.' }),
})

export async function actionCreateWorkspace(data: FormData) {
  const formResult = createWorkspaceSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    const zodErrors = formatZodError(formResult.error)
    const validationErrors = { error: [`Validation Error at ${zodErrors[0].field} - ${zodErrors[0].message}`] }
    const message = validationErrors.error.join('. ')

    return { success: false, message }
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
