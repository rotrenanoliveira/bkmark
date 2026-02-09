'use client'

import { Bookmark } from '@/components/bookmarks/bookmark'
import { useBookmarks } from '@/hooks/use-bookmarks'

export function BookmarksList() {
  const { bookmarks } = useBookmarks()

  return (
    <div className="border">
      {bookmarks.map((bookmark) => (
        <Bookmark key={bookmark.bookmarkId} bookmark={bookmark} />
      ))}
    </div>
  )
}
