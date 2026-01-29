'use client'

import { TrashIcon } from 'lucide-react'
import { useCallback, useTransition } from 'react'
import { toast } from 'sonner'
import { useFolders } from '@/hooks/use-folders'
import { actionRemoveFolder } from '@/server/actions/remove-folder'
import { Button } from '../ui/button'

interface RemoveFolderProps {
  folderId: string
}

export function RemoveFolder({ folderId }: RemoveFolderProps) {
  const [isPending, startTransition] = useTransition()

  const { remove } = useFolders()

  const handleRemoveFolder = useCallback(async () => {
    startTransition(async () => {
      remove(folderId)

      const result = await actionRemoveFolder(folderId)

      if (result.success === false) {
        toast.error(result.message)
        return
      }
    })
  }, [remove, folderId])

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
