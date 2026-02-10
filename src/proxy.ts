import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('bkmark:userId')?.value

  const { searchParams } = new URL(request.url)
  const token = searchParams.get('bridge_token')

  if (token && token !== userId) {
    const response = NextResponse.redirect(new URL('/', request.url))

    cookieStore.set({
      name: 'bkmark:userId',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
