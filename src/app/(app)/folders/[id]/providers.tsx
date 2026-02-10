'use client'

import { BookmarkProvider } from '@/contexts/bookmarks-context'
import type { BookmarkPresenter } from '@/utils/types'

export default function FoldersProviders({
  children,
  bookmarksPromise,
}: {
  children: React.ReactNode
  bookmarksPromise: Promise<BookmarkPresenter[]>
}) {
  return <BookmarkProvider bookmarksPromise={bookmarksPromise}>{children}</BookmarkProvider>
}
