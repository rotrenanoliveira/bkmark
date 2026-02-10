'use client'

import { createContext, use, useCallback, useMemo, useOptimistic } from 'react'

import { generateNanoId } from '@/lib/nanoid'
import type { BookmarkPresenter } from '@/utils/types'

type BookmarkAction =
  | { type: 'ADD'; payload: { bookmarkUrl: string; title: string } }
  | { type: 'RENAME'; payload: { bookmarkId: string; title: string } }
  | { type: 'REMOVE'; payload: { id: string } }

type BookmarkContextType = {
  bookmarks: BookmarkPresenter[]
  create: ({ title, bookmarkUrl }: { title: string; bookmarkUrl: string }) => void
  rename: ({ title, bookmarkId }: { title: string; bookmarkId: string }) => void
  remove: (id: string) => void
}

export const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined)

function bookmarkReducer(state: BookmarkPresenter[], action: BookmarkAction): BookmarkPresenter[] {
  switch (action.type) {
    case 'ADD':
      return [
        {
          bookmarkId: generateNanoId(),
          userId: generateNanoId(),
          title: action.payload.title,
          bookmarkUrl: action.payload.bookmarkUrl,
          createdAt: new Date(),
        },
        ...state,
      ]
    case 'REMOVE':
      return state.filter((bookmark) => bookmark.bookmarkId !== action.payload.id)
    case 'RENAME':
      return state.map((bookmark) =>
        bookmark.bookmarkId === action.payload.bookmarkId ? { ...bookmark, title: action.payload.title } : bookmark,
      )
    default:
      return state
  }
}

export function BookmarkProvider({
  children,
  bookmarksPromise,
}: {
  children: React.ReactNode
  bookmarksPromise: Promise<BookmarkPresenter[]>
}) {
  const initialBookmarks = use(bookmarksPromise)
  const [optimisticBookmarks, setOptimisticBookmarks] = useOptimistic(initialBookmarks, bookmarkReducer)

  const create = useCallback(
    ({ title, bookmarkUrl }: { title: string; bookmarkUrl: string }) => {
      setOptimisticBookmarks({ type: 'ADD', payload: { title, bookmarkUrl } })
    },
    [setOptimisticBookmarks],
  )

  const rename = useCallback(
    ({ title, bookmarkId }: { title: string; bookmarkId: string }) => {
      setOptimisticBookmarks({ type: 'RENAME', payload: { title, bookmarkId } })
    },
    [setOptimisticBookmarks],
  )

  const remove = useCallback(
    (id: string) => {
      setOptimisticBookmarks({ type: 'REMOVE', payload: { id } })
    },
    [setOptimisticBookmarks],
  )

  const value = useMemo(
    () => ({ bookmarks: optimisticBookmarks, create, rename, remove }),
    [optimisticBookmarks, create, rename, remove],
  )

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>
}
