'use client'

import { BookmarkProvider } from '@/contexts/bookmarks-context'
import { FoldersProvider } from '@/contexts/folders-context'
import type { BookmarkPresenter, Folder } from '@/utils/types'

export default function WorkspacesProviders({
  children,
  bookmarksPromise,
  foldersPromise,
}: {
  children: React.ReactNode
  bookmarksPromise: Promise<BookmarkPresenter[]>
  foldersPromise: Promise<Folder[]>
}) {
  return (
    <BookmarkProvider bookmarksPromise={bookmarksPromise}>
      <FoldersProvider foldersPromise={foldersPromise}>{children}</FoldersProvider>
    </BookmarkProvider>
  )
}
