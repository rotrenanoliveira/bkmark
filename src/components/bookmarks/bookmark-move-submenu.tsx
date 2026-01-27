import { useQuery } from '@tanstack/react-query'
import { CornerDownRightIcon, Loader2Icon } from 'lucide-react'
import React from 'react'
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { getFolders } from '@/server/data/get-folders'
import { ScrollArea } from '../ui/scroll-area'
import { BookmarkMoveToFolder } from './bookmark-move-to-folder'

interface BookmarkMoveSubMenuProps {
  userId: string
  bookmarkId: string
  currentFolder?: string | null
}

export function BookmarkMoveSubMenu({ userId, bookmarkId, currentFolder }: BookmarkMoveSubMenuProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['folders'],
    queryFn: async () => getFolders(userId),
  })

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="h-9 px-4 py-2 has-[>svg]:px-3 text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
        <CornerDownRightIcon className="inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <span className="left-6">Move to...</span>
      </DropdownMenuSubTrigger>

      <DropdownMenuPortal>
        <DropdownMenuSubContent className="w-full p-0" alignOffset={8}>
          {data?.folders.length === 0 && (
            <DropdownMenuItem className="text-muted-foreground/50 hover:bg-inherit">
              No folders registered.
            </DropdownMenuItem>
          )}

          <ScrollArea className="h-fit max-h-72 rounded-md">
            <div className="w-full p-1 space-y-0.5">
              {isLoading && (
                <DropdownMenuItem
                  className="relative h-9 px-4 py-2 has-[>svg]:px-3 text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 disabled:pointer-events-none disabled:opacity-50"
                  disabled
                >
                  <Loader2Icon className="animate-spin absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
                  <span className="relative left-6">Loading...</span>
                </DropdownMenuItem>
              )}

              {data?.folders &&
                data.folders.length > 0 &&
                data?.folders.map((folder) => (
                  <React.Suspense key={folder.folderId}>
                    <BookmarkMoveToFolder
                      bookmarkId={bookmarkId}
                      currentFolder={currentFolder}
                      folderId={folder.folderId}
                      folderName={folder.name}
                    />
                  </React.Suspense>
                ))}
            </div>
          </ScrollArea>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
