import { Ellipsis } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { BookmarkPresenter } from '@/utils/types'
import { BookmarkRemoveFromFolderButton } from './bookmark-remove-from-folder'
import { CopyBookmarkUrl } from './copy-bookmark-url'
import { DeleteBookmark } from './delete-bookmark'
import { MoveBookmarks } from './move-bookmarks'
import { RenameBookmark } from './rename-bookmark'

interface BookmarkOptionsProps {
  bookmark: BookmarkPresenter
}

export function BookmarkOptions({ bookmark }: BookmarkOptionsProps) {
  const hasParentFolder = bookmark.folderId !== null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-12 flex items-center justify-center border-l">
          <Ellipsis className="size-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-1" align="end">
        <CopyBookmarkUrl bookmarkUrl={bookmark.bookmarkUrl} />

        <RenameBookmark bookmarkId={bookmark.bookmarkId} />

        <DeleteBookmark bookmarkId={bookmark.bookmarkId} currentFolder={bookmark.folderId} />

        {hasParentFolder && (
          <BookmarkRemoveFromFolderButton bookmarkId={bookmark.bookmarkId} currentFolder={bookmark.folderId} />
        )}

        <MoveBookmarks
          bookmarkId={bookmark.bookmarkId}
          currentFolder={bookmark.folderId}
          currentWorkspace={bookmark.workspaceId}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
