'use client'

import { GlobeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import type { BookmarkPresenter } from '@/utils/types'
import { BookmarkOptions } from './bookmark-options'

interface BookmarkProps {
  bookmark: BookmarkPresenter
}

export function Bookmark({ bookmark }: BookmarkProps) {
  const bookmarkUrl =
    bookmark.bookmarkUrl.length > 30 ? bookmark.bookmarkUrl.substring(0, 30).concat('...') : bookmark.bookmarkUrl

  const bookmarkCreatedAt = useMemo(() => {
    return Intl.DateTimeFormat('pt-BR', { month: 'short', day: 'numeric', year: '2-digit' })
      .format(new Date(bookmark.createdAt))
      .replaceAll('.', '')
  }, [bookmark.createdAt])

  return (
    <Button type="button" variant="ghost" className="p-0" asChild>
      <Link
        href={bookmark.bookmarkUrl}
        target="_blank"
        className="w-full h-12 flex items-center justify-between group border-b hover:bg-foreground/5 hover:border-foreground/15 font-(family-name:--font-geist-sans) last:border-none"
      >
        <div className="w-full flex items-center gap-2">
          <div className="flex items-center justify-center size-12 border-r">
            {bookmark.favicon ? (
              <Image src={bookmark.favicon} alt={bookmark.title} width={24} height={24} className="size-6" />
            ) : (
              <GlobeIcon strokeWidth={1.25} className="size-6 text-muted-foreground" />
            )}
          </div>
          <p className="w-48 flex-1 md:max-w-lg font-semibold truncate">{bookmark.title}</p>
          <span className="hidden md:inline w-60 font-light text-muted-foreground/75">{bookmarkUrl}</span>
        </div>

        <div className="inline-flex items-center gap-2">
          <span className="hidden md:inline text-sm font-light">{bookmarkCreatedAt}</span>

          <BookmarkOptions bookmark={bookmark} />
        </div>
      </Link>
    </Button>
  )
}
