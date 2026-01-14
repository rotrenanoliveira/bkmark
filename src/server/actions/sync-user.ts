'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { formatZodError } from '@/utils/functions'

const syncUserSchema = z.object({
  code: z.string().min(12, { message: 'Invalid code.' }).max(12),
})

export async function actionSyncUser(data: FormData) {
  const formResult = syncUserSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    const zodErrors = formatZodError(formResult.error)
    const validationErrors = { error: [`Validation Error at ${zodErrors[0].field} - ${zodErrors[0].message}`] }
    const message = validationErrors.error.join('. ')

    return { success: false, message }
  }

  const cookieStore = await cookies()
  cookieStore.set('bkmark:userId', formResult.data.code)

  revalidatePath('/', 'layout')

  return { success: true, message: 'User synced successfully.' }
}
