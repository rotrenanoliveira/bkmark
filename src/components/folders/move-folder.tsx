import { CornerDownRightIcon, Layers2Icon, Loader2Icon } from 'lucide-react'
import React from 'react'
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { useWorkspaces } from '@/hooks/use-workspaces'
import { cn } from '@/lib/utils'
import { ScrollArea } from '../ui/scroll-area'
import { MoveFolderButton } from './move-folder-button'

interface MoveFolderProps {
  folderId: string

  currentWorkspace?: string | null
}

export function MoveFolder({ folderId, currentWorkspace }: MoveFolderProps) {
  const { workspaces } = useWorkspaces()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="h-9 px-4 py-2 cursor-pointer has-[>svg]:px-3 text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
        <CornerDownRightIcon className="inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <span className="left-6">Move to...</span>
      </DropdownMenuSubTrigger>

      <DropdownMenuPortal>
        <DropdownMenuSubContent className="md:w-[calc(100%+1rem)] p-0 truncate" sideOffset={-72}>
          {workspaces.length === 0 && (
            <DropdownMenuItem className="h-9 px-4 py-2 text-muted-foreground/50 hover:bg-inherit">
              No workspaces registered.
            </DropdownMenuItem>
          )}

          <ScrollArea className="w-full h-fit max-h-72 rounded-md truncate">
            <div className="flex items-center gap-2 p-3 border-b">
              <Layers2Icon className="size-4 text-muted-foreground" />
              <h4 className="text-sm">Workspaces</h4>
            </div>
            <div className={cn('space-y-0.5 truncate', workspaces && workspaces.length > 0 && 'p-1')}>
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
                    <MoveFolderButton
                      folderId={folderId}
                      workspaceId={workspace.workspaceId}
                      workspaceName={workspace.name}
                      currentWorkspace={currentWorkspace}
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
