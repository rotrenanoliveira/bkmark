'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { getUserById } from '../data/get-user-by-id'

const syncUserSchema = z.object({
  code: z.string().min(12, { message: 'Invalid code.' }).max(12, { message: 'Invalid code.' }),
})

export async function actionSyncUser(data: FormData) {
  const formResult = syncUserSchema.safeParse(Object.fromEntries(data))
  if (formResult.success === false) {
    const message = z.prettifyError(formResult.error).replace('✖ ', '').replace('\n', '')

    return { success: false, message }
  }

  const user = await getUserById(formResult.data.code)

  if (user === null) {
    return { success: false, message: 'Unable to synchronize, invalid access code.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('bkmark:userId', formResult.data.code)

  revalidatePath('/', 'layout')

  return { success: true, message: 'User synced successfully.' }
}
