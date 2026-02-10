import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response('Invalid code.', { status: 400 })
  }

  const cookieStore = await cookies()
  cookieStore.set('bkmark:userId', code)

  revalidatePath('/', 'layout')
  redirect('/')
}
