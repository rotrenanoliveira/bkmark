import { useQuery } from '@tanstack/react-query'
import { FastForwardIcon } from 'lucide-react'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { getFolders } from '@/server/data/get-folders'
import { BookmarkMove } from './bookmark-move'

interface BookmarkMoveSubMenuProps {
  userId: string
  bookmarkId: string
}

export function BookmarkMoveSubMenu({ userId, bookmarkId }: BookmarkMoveSubMenuProps) {
  const { data } = useQuery({
    queryKey: ['folders'],
    queryFn: () => getFolders(userId),
  })

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
        <FastForwardIcon strokeWidth={1.25} className="size-4" />
        <span>Move to...</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align="center">
          {data?.folders.length === 0 && (
            <DropdownMenuItem className="text-muted-foreground/50 hover:bg-inherit">
              No folders registered.
            </DropdownMenuItem>
          )}

          {data?.folders.map((folder) => (
            <BookmarkMove
              key={folder.folderId}
              bookmarkId={bookmarkId}
              folderId={folder.folderId}
              folderName={folder.name}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
