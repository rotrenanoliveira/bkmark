import { useQuery } from '@tanstack/react-query'
import { FastForwardIcon, Loader2 } from 'lucide-react'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { getFolders } from '@/server/data/get-folders'
import { BookmarkMove } from './bookmark-move'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import React from 'react'

interface BookmarkMoveSubMenuProps {
  userId: string
  bookmarkId: string
}

export function BookmarkMoveSubMenu({ userId, bookmarkId }: BookmarkMoveSubMenuProps) {
  const { data, isLoading } = useQuery({
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
        <DropdownMenuContent className="w-full p-0">
          {data?.folders.length === 0 && (
            <DropdownMenuItem className="text-muted-foreground/50 hover:bg-inherit">
              No folders registered.
            </DropdownMenuItem>
          )}

          <ScrollArea className="h-72 w-48 rounded-md">
            <div className="p-4">
              <div className="inline-flex items-center justify-between w-full">
                <h4 className="text-sm leading-none font-medium">Folders</h4>
                {isLoading && <Loader2 className="animate-spin size-4" />}
              </div>
              <Separator className="my-2" />
              {data?.folders.map((folder) => (
                <React.Suspense key={folder.folderId}>
                  <BookmarkMove bookmarkId={bookmarkId} folderId={folder.folderId} folderName={folder.name} />
                </React.Suspense>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
