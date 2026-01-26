'use client'

import { GlobeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import type { Bookmark as BookmarkType } from '@/utils/types'
import { BookmarkOptions } from './bookmark-options'

interface BookmarkProps {
  bookmark: BookmarkType
}

export function Bookmark({ bookmark }: BookmarkProps) {
  const bookmarkTitle = bookmark.title.length > 30 ? bookmark.title.substring(0, 30).concat('...') : bookmark.title

  const bookmarkUrl =
    bookmark.bookmarkUrl.length > 30 ? bookmark.bookmarkUrl.substring(0, 30).concat('...') : bookmark.bookmarkUrl

  const bookmarkCreatedAt = useMemo(() => {
    return Intl.DateTimeFormat('pt-BR', { month: 'short', day: 'numeric' })
      .format(new Date(bookmark.createdAt))
      .replaceAll('.', '')
  }, [bookmark.createdAt])

  return (
    <div className="font-(family-name:--font-geist-sans)">
      <Button
        type="button"
        variant="ghost"
        className="w-full h-12 flex pl-3 pr-1 items-center justify-between rounded-lg group hover:bg-foreground/5 hover:border-foreground/15"
        asChild
      >
        <div className="w-full">
          <Link href={bookmark.bookmarkUrl} target="_blank" className="flex-1 flex items-center justify-between">
            <div className="flex items-center gap-2 ml-1">
              {bookmark.favicon ? (
                <Image src={bookmark.favicon} alt={bookmark.title} width={24} height={24} className="size-6" />
              ) : (
                <GlobeIcon strokeWidth={1.25} className="size-6 text-muted-foreground" />
              )}
              <p className="font-semibold truncate">{bookmarkTitle}</p>
              <span className="hidden md:inline font-light text-muted-foreground/75">{bookmarkUrl}</span>
            </div>

            <span className="hidden md:inline text-sm font-light">{bookmarkCreatedAt}</span>
          </Link>

          <BookmarkOptions bookmark={bookmark} />
        </div>
      </Button>
    </div>
  )
}
