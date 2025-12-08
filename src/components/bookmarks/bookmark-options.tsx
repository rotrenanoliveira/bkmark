import { Ellipsis } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { BookmarkCopy } from './bookmark-copy-url'
import { BookmarkDeleteButton } from './bookmark-delete'
import { BookmarkMoveSubMenu } from './bookmark-move-submenu'
import { BookmarkRename } from './bookmark-rename'
import type { Bookmark } from '@/utils/types'
import { BookmarkRemoveFromFolderButton } from './bookmark-remove-from-folder'

interface BookmarkOptionsProps {
  bookmark: Bookmark
}

export function BookmarkOptions({ bookmark }: BookmarkOptionsProps) {
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
        {/* bookmark copy */}
        <BookmarkCopy bookmarkUrl={bookmark.bookmarkUrl} />
        {/* bookmark rename */}
        <BookmarkRename bookmarkId={bookmark.id} />
        {/* bookmark remove from folder */}
        {bookmark.folderId !== null && <BookmarkRemoveFromFolderButton bookmarkId={bookmark.id} />}
        {/* bookmark delete */}
        <BookmarkDeleteButton bookmarkId={bookmark.id} />
        {/* bookmark move */}
        <BookmarkMoveSubMenu userId={bookmark.userId} bookmarkId={bookmark.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
