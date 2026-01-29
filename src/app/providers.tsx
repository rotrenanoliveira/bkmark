'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { BookmarkProvider } from '@/contexts/bookmarks-context'
import { FoldersProvider } from '@/contexts/folders-context'
import { queryClient } from '@/lib/react-query'
import type { Bookmark, Folder } from '@/utils/types'

export function Providers({
  children,
  bookmarksPromise,
  foldersPromise,
}: {
  children: ReactNode
  bookmarksPromise: Promise<Bookmark[]>
  foldersPromise: Promise<Folder[]>
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        <BookmarkProvider bookmarksPromise={bookmarksPromise}>
          <FoldersProvider foldersPromise={foldersPromise}>{children}</FoldersProvider>
        </BookmarkProvider>
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
