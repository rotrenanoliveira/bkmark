import { Ellipsis } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Bookmark } from '@/utils/types'
import { BookmarkCopyUrl } from './bookmark-copy-url'
import { BookmarkDeleteButton } from './bookmark-delete'
import { BookmarkRemoveFromFolderButton } from './bookmark-remove-from-folder'
import { BookmarkRename } from './bookmark-rename'

interface BookmarkOptionsProps {
  bookmark: Bookmark
}

export function BookmarkOptions({ bookmark }: BookmarkOptionsProps) {
  const hasParentFolder = bookmark.folderId !== null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          className="flex items-center justify-center shadow-none bg-transparent rounded-lg size-10 hover:bg-foreground/5"
        >
          <Ellipsis className="size-5 text-foreground/50 group-hover:text-foreground/75" strokeWidth={1.25} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-1" align="end">
        <BookmarkCopyUrl bookmarkUrl={bookmark.bookmarkUrl} />

        <BookmarkRename bookmarkId={bookmark.bookmarkId} />

        <BookmarkDeleteButton bookmarkId={bookmark.bookmarkId} />

        {hasParentFolder && <BookmarkRemoveFromFolderButton bookmarkId={bookmark.bookmarkId} />}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
