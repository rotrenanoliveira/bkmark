'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { BookmarkProvider } from '@/contexts/bookmarks-context'
import { FoldersProvider } from '@/contexts/folders-context'
import { WorkspacesProvider } from '@/contexts/workspaces-context'
import { queryClient } from '@/lib/react-query'
import type { Bookmark, Folder, Workspace } from '@/utils/types'

export function Providers({
  children,
  bookmarksPromise,
  foldersPromise,
  workspacesPromise,
}: {
  children: ReactNode
  bookmarksPromise: Promise<Bookmark[]>
  foldersPromise: Promise<Folder[]>
  workspacesPromise: Promise<Workspace[]>
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        <BookmarkProvider bookmarksPromise={bookmarksPromise}>
          <WorkspacesProvider workspacesPromise={workspacesPromise}>
            <FoldersProvider foldersPromise={foldersPromise}>{children}</FoldersProvider>
          </WorkspacesProvider>
        </BookmarkProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
