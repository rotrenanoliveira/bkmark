'use client'

import { FolderRemoveIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useCallback, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useBounce } from '@/hooks/use-bounce'
import { useFolders } from '@/hooks/use-folders'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { queryClient } from '@/lib/react-query'
import { actionRemoveFolder } from '@/server/actions/remove-folder'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { DropdownMenuItem } from '../ui/dropdown-menu'

interface DeleteFolderProps {
  folderId: string
  currentWorkspace?: string | null
}

export function DeleteFolder({ folderId }: DeleteFolderProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const buttonRef = useRef<HTMLButtonElement>(null)

  const { remove } = useFolders()
  const { bounce } = useBounce()

  const handleSelect = useCallback(
    (e: Event) => {
      e.preventDefault()
      bounce(buttonRef)
      setOpen(true)
    },
    [bounce],
  )

  const handleClose = () => setOpen(false)

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

  useKeyboardShortcut('d', handleSelect, ['Meta'])

  return (
    <>
      <DropdownMenuItem onSelect={handleSelect} asChild>
        <Button variant="ghost" className="relative w-full cursor-pointer">
          <HugeiconsIcon
            icon={FolderRemoveIcon}
            className="absolute transition-all duration-200 ease-out scale-100 opacity-100 inset-x-2 inset-y-2 size-5"
          />
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

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete folder?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the folder, all the bookmarks associated with it. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeleteFolder} disabled={isPending}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
