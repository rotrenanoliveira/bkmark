'use client'

import { CircleMinusIcon, CircleXIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useFolders } from '@/hooks/use-folders'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { actionRemoveFolder } from '@/server/actions/remove-folder'
import { Button } from '../ui/button'
import { DropdownMenuItem } from '../ui/dropdown-menu'

interface DeleteFolderProps {
  folderId: string
  currentWorkspace?: string | null
}

export function DeleteFolder({ folderId }: DeleteFolderProps) {
  const [shortcutPressed, setShortcutPressed] = useState(false)
  const [isPending, startTransition] = useTransition()

  const commandTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
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

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // TODO: incluir validação para o windows
      if (e.metaKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setShortcutPressed(true)
        handleDeleteFolder()

        commandTimeoutRef.current = setTimeout(() => setShortcutPressed(false), 1000)
      }
    }

    document.addEventListener('keydown', down)

    return () => {
      document.removeEventListener('keydown', down)

      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current)
      }
    }
  }, [handleDeleteFolder])

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className={cn('w-full relative cursor-pointer', shortcutPressed && 'bg-accent')}
        onClick={handleDeleteFolder}
        disabled={isPending}
      >
        <CircleXIcon
          className={cn(
            'absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out',
            shortcutPressed ? 'scale-75 opacity-0' : 'scale-100 opacity-100',
          )}
        />
        <CircleMinusIcon
          className={cn(
            'absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out',
            shortcutPressed ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
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
  )
}
