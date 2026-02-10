'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'

const syncUserSchema = z.object({
  code: z.string().min(12, { message: 'Invalid code.' }).max(12),
})

export async function actionSyncUser(data: FormData) {
  const formResult = syncUserSchema.safeParse(Object.fromEntries(data))

  if (formResult.success === false) {
    return { success: false, message: z.prettifyError(formResult.error).replace('✖ ', '') }
  }

  const cookieStore = await cookies()
  cookieStore.set('bkmark:userId', formResult.data.code)

  revalidatePath('/', 'layout')

  return { success: true, message: 'User synced successfully.' }
}
