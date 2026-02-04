import { Ellipsis } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Folder } from '@/utils/types'
import { DeleteFolder } from './delete-folder'
import { GoToFolderButton } from './go-to-folder'
import { MoveFolder } from './move-folder'
import { RemoveFolderFromWorkspace } from './remove-folder-from-workspace'
import { RenameFolderButton } from './rename-folder'

interface FolderOptionsProps {
  folder: Folder
}

export function FolderOptions({ folder }: FolderOptionsProps) {
  const hasParentWorkspace = folder.workspaceId !== null

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
        <GoToFolderButton folderId={folder.folderId} />

        <RenameFolderButton folderId={folder.folderId} />

        <DeleteFolder folderId={folder.folderId} currentWorkspace={folder.workspaceId} />

        {hasParentWorkspace && (
          <RemoveFolderFromWorkspace folderId={folder.folderId} currentWorkspace={folder.workspaceId} />
        )}

        <MoveFolder folderId={folder.folderId} currentWorkspace={folder.workspaceId} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
