import { ArrowBigRightDashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { queryClient } from '@/lib/react-query'
import { actionMoveFolderToWorkspace } from '@/server/actions/move-folder-to-workspace'
import { DropdownMenuItem } from '../ui/dropdown-menu'

interface MoveFolderButtonProps {
  folderId: string
  currentWorkspace?: string | null
  workspaceName: string
  workspaceId: string
}

export function MoveFolderButton({ folderId, currentWorkspace, workspaceName, workspaceId }: MoveFolderButtonProps) {
  const [isLoading, startTransition] = useTransition()

  const router = useRouter()

  async function handleUpdateFolder(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    startTransition(async () => {
      const result = await actionMoveFolderToWorkspace({ folderId, workspaceId })

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [`workspace:${currentWorkspace}`] }),
        queryClient.invalidateQueries({ queryKey: [`workspace:${workspaceId}`] }),
      ])

      router.refresh()
    })
  }

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className="w-full max-w-56 md:max-w-64 relative justify-start cursor-pointer truncate"
        onClick={handleUpdateFolder}
        disabled={currentWorkspace === workspaceId || isLoading}
      >
        <ArrowBigRightDashIcon className="absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <p className="relative left-4 truncate">{workspaceName}</p>
      </Button>
    </DropdownMenuItem>
  )
}
