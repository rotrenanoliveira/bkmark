import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('bkmark:userId')?.value || 'default'

  const manifest = {
    name: 'bkmark',
    short_name: 'bkmark',
    description: 'A simple way to manage bookmarks across devices and browsers.',
    start_url: `/?bridge_token=${userId}`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0D0D0F',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  }

  return NextResponse.json(manifest, {
    headers: { 'Content-Type': 'application/manifest+json' },
  })
}
