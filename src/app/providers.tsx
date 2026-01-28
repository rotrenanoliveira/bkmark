'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { BookmarkProvider } from '@/contexts/bookmarks-context'
import { queryClient } from '@/lib/react-query'
import type { Bookmark } from '@/utils/types'

export function Providers({
  children,
  bookmarksPromise,
}: {
  children: ReactNode
  bookmarksPromise: Promise<Bookmark[]>
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        <BookmarkProvider bookmarksPromise={bookmarksPromise}>{children}</BookmarkProvider>
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
