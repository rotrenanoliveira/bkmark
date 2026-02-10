import { CornerDownRightIcon, Loader2Icon } from 'lucide-react'
import React from 'react'
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { useFolders } from '@/hooks/use-folders'
import { useWorkspaces } from '@/hooks/use-workspaces'
import { cn } from '@/lib/utils'
import { ScrollArea } from '../ui/scroll-area'
import { MoveBookmarkButton } from './move-bookmark-button'

interface MoveBookmarksProps {
  bookmarkId: string
  currentFolder?: string | null
  currentWorkspace?: string | null
}

export function MoveBookmarks({ bookmarkId, currentFolder, currentWorkspace }: MoveBookmarksProps) {
  const { folders } = useFolders()
  const { workspaces } = useWorkspaces()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="h-9 px-4 py-2 cursor-pointer has-[>svg]:px-3 text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
        <CornerDownRightIcon className="inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <span className="left-6">Move to...</span>
      </DropdownMenuSubTrigger>

      <DropdownMenuPortal>
        <DropdownMenuSubContent className="md:w-[calc(100%+1rem)] p-1" alignOffset={8}>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="h-9 px-4 py-2 cursor-pointer has-[>svg]:px-3 text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
              <span className="left-4">Folder</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="md:w-[calc(100%+1rem)] p-0" alignOffset={8}>
                {folders?.length === 0 && (
                  <DropdownMenuItem className="px-4 py-2 h-9 text-muted-foreground/50 hover:bg-inherit">
                    No folders registered.
                  </DropdownMenuItem>
                )}
                <ScrollArea className="w-full rounded-md h-fit max-h-72">
                  <div className={cn('space-y-0.5', folders && folders.length > 0 && 'p-1')}>
                    {folders?.length === 0 && (
                      <DropdownMenuItem
                        className="relative h-9 px-4 py-2 has-[>svg]:px-3 text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 disabled:pointer-events-none disabled:opacity-50"
                        disabled
                      >
                        <Loader2Icon className="animate-spin absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
                        <span className="relative left-6">Loading...</span>
                      </DropdownMenuItem>
                    )}

                    {folders &&
                      folders.length > 0 &&
                      folders.map((folder) => (
                        <React.Suspense key={folder.folderId}>
                          <MoveBookmarkButton
                            bookmarkId={bookmarkId}
                            groupId={folder.folderId}
                            currentGroup={currentFolder}
                            groupName={folder.name}
                            type="folder"
                          />
                        </React.Suspense>
                      ))}
                  </div>
                </ScrollArea>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="h-9 px-4 py-2 cursor-pointer has-[>svg]:px-3 text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
              <span className="left-4">Workspace</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="md:w-[calc(100%+1rem)] p-0" alignOffset={8}>
                {workspaces.length === 0 && (
                  <DropdownMenuItem className="px-4 py-2 h-9 text-muted-foreground/50 hover:bg-inherit">
                    No workspaces registered.
                  </DropdownMenuItem>
                )}

                <ScrollArea className="w-full rounded-md h-fit max-h-72">
                  <div className={cn('space-y-0.5', workspaces && workspaces.length > 0 && 'p-1')}>
                    {workspaces.length === 0 && (
                      <DropdownMenuItem
                        className="relative h-9 px-4 py-2 has-[>svg]:px-3 text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 disabled:pointer-events-none disabled:opacity-50"
                        disabled
                      >
                        <Loader2Icon className="animate-spin absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
                        <span className="relative left-6">Loading...</span>
                      </DropdownMenuItem>
                    )}

                    {workspaces &&
                      workspaces.length > 0 &&
                      workspaces.map((workspace) => (
                        <React.Suspense key={workspace.workspaceId}>
                          <MoveBookmarkButton
                            bookmarkId={bookmarkId}
                            groupId={workspace.workspaceId}
                            currentGroup={currentWorkspace}
                            groupName={workspace.name}
                            type="workspace"
                          />
                        </React.Suspense>
                      ))}
                  </div>
                </ScrollArea>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
