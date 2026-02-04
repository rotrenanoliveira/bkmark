'use client'

import { CircleXIcon } from 'lucide-react'
import { useCallback, useTransition } from 'react'
import { toast } from 'sonner'
import { useFolders } from '@/hooks/use-folders'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { queryClient } from '@/lib/react-query'
import { actionRemoveFolder } from '@/server/actions/remove-folder'
import { Button } from '../ui/button'
import { DropdownMenuItem } from '../ui/dropdown-menu'

interface DeleteFolderProps {
  folderId: string
  currentWorkspace?: string | null
}

export function DeleteFolder({ folderId }: DeleteFolderProps) {
  const [isPending, startTransition] = useTransition()

  const { remove } = useFolders()

  const handleDeleteFolder = useCallback(async () => {
    startTransition(async () => {
      remove(folderId)

      const result = await actionRemoveFolder(folderId)

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      await queryClient.invalidateQueries({ queryKey: [`folder:${folderId}`] })
    })
  }, [remove, folderId])

  useKeyboardShortcut('d', handleDeleteFolder, ['Meta'])

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className="w-full relative cursor-pointer"
        onClick={handleDeleteFolder}
        disabled={isPending}
      >
        <CircleXIcon className="absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <span className="relative left-6">Delete</span>

        <div className="inline-flex gap-1 ml-auto font-(family-name:--font-geist-mono)">
          <kbd className="flex items-center justify-center tracking-widest border rounded size-5">
            <span className="text-lg text-foreground/75">{'\u2318'}</span>
          </kbd>
          <kbd className="flex items-center justify-center tracking-widest border rounded size-5">
            <span className="text-xs text-foreground/75">D</span>
          </kbd>
        </div>
      </Button>
    </DropdownMenuItem>
  )
}
