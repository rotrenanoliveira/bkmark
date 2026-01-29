'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getUserId() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('bkmark:userId')

  if (!userId) {
    return redirect('/api/sync/generate')
  }

  return userId?.value
}
