import { env } from 'node:process'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { generateNanoId } from '@/lib/nanoid'

export async function GET() {
  const userId = generateNanoId()

  const cookieStore = await cookies()
  cookieStore.set({
    name: 'bkmark:userId',
    value: userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  redirect(new URL(env.APP_URL ?? '/').toString())
}
