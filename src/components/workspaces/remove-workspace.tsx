'use client'

import { TrashIcon } from 'lucide-react'
import { useCallback, useTransition } from 'react'
import { toast } from 'sonner'
import { useWorkspaces } from '@/hooks/use-workspaces'
import { actionRemoveWorkspace } from '@/server/actions/remove-workspace'
import { Button } from '../ui/button'

interface RemoveWorkspaceProps {
  workspaceId: string
}

export function RemoveWorkspace({ workspaceId }: RemoveWorkspaceProps) {
  const [isPending, startTransition] = useTransition()

  const { remove } = useWorkspaces()

  const handleRemoveFolder = useCallback(async () => {
    startTransition(async () => {
      remove(workspaceId)

      const result = await actionRemoveWorkspace(workspaceId)

      if (result.success === false) {
        toast.error(result.message)
        return
      }
    })
  }, [remove, workspaceId])

  return (
    <Button
      type="button"
      variant="ghost"
      className="flex items-center justify-center shadow-none bg-transparent rounded-lg size-10 hover:bg-destructive/25 dark:hover:bg-destructive/50"
      onClick={handleRemoveFolder}
      disabled={isPending}
    >
      <TrashIcon className="size-5 text-destructive dark:text-white" strokeWidth={1.25} />
    </Button>
  )
}
