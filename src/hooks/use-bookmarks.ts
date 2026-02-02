import { use } from 'react'
import { BookmarkContext } from '@/contexts/bookmarks-context'

export function useBookmarks() {
  const context = use(BookmarkContext)

  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider')
  }

  return context
}
