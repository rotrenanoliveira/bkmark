import { CornerDownLeftIcon } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { queryClient } from '@/lib/react-query'
import { actionRemoveFolderFromWorkspace } from '@/server/actions/remove-folder-from-workspace'

interface RemoveFolderFromWorkspaceProps {
  folderId: string
  currentWorkspace?: string | null
}

export function RemoveFolderFromWorkspace({ folderId, currentWorkspace }: RemoveFolderFromWorkspaceProps) {
  const [isLoading, startTransition] = useTransition()

  async function handleRemoveFromWorkspace() {
    startTransition(async () => {
      const result = await actionRemoveFolderFromWorkspace({ folderId })

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      await queryClient.invalidateQueries({ queryKey: [`workspace:${currentWorkspace}`] })
    })
  }

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className="w-full relative justify-start cursor-pointer"
        onClick={handleRemoveFromWorkspace}
        disabled={isLoading}
      >
        <CornerDownLeftIcon className="absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <span className="relative left-6">Remove from workspace</span>
      </Button>
    </DropdownMenuItem>
  )
}
