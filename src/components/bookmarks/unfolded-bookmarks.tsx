'use client'

import { Bookmark } from '@/components/bookmarks/bookmark'
import { useBookmarks } from '@/components/bookmarks/bookmarks-context'

export function UnfoldedBookmarks() {
  const { bookmarks } = useBookmarks()

  return (
    <div className="space-y-2">
      {bookmarks.map((bookmark) => (
        <Bookmark key={bookmark.bookmarkId} bookmark={bookmark} />
      ))}
    </div>
  )
}
