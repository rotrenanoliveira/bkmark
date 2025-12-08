'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { z } from 'zod'

import { formatZodError } from '@/utils/functions'
import { createFolder } from '../data/create-folder'
import { getUserId } from '../data/get-user-id'

const createFolderSchema = z.object({
  folder: z.string().min(1, { message: 'Invalid folder name.' }),
})

export async function actionCreateFolder(data: FormData) {
  const formResult = createFolderSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    const zodErrors = formatZodError(formResult.error)
    const validationErrors = { error: [`Validation Error at ${zodErrors[0].field} - ${zodErrors[0].message}`] }
    const message = validationErrors.error.join('. ')

    return { success: false, message }
  }

  const userId = await getUserId()

  if (!userId) {
    return { success: false, message: 'User not found.' }
  }

  const [_, createFolderError] = await createFolder({
    name: formResult.data.folder,
    userId,
  })

  if (createFolderError) {
    return createFolderError
  }

  revalidatePath('/', 'layout')
  revalidateTag('folders', 'max')

  return { success: true, message: 'Folder created successfully.' }
}
