import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { getUserBookmarks } from '@/server/data/get-bookmarks'
import { Providers } from './providers'
import './globals.css'
import { getUserFolders } from '@/server/data/get-folders'
import { getUserId } from '@/server/data/get-user-id'
import { getUserWorkspaces } from '@/server/data/get-workspaces'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'bkmark',
  description: 'A simple way to manage bookmarks across devices and browsers.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0D0D0F' },
  ],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const userId = await getUserId()
  const bookmarks = getUserBookmarks(userId)
  const folders = getUserFolders(userId)
  const workspaces = getUserWorkspaces(userId)

  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <link rel="icon" href="/icon?<generated>" type="image/<generated>" sizes="<generated>" />
        <link rel="apple-touch-icon" href="/apple-icon?<generated>" type="image/<generated>" sizes="<generated>" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers bookmarksPromise={bookmarks} foldersPromise={folders} workspacesPromise={workspaces}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
