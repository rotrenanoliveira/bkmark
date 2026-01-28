import { CircleMinusIcon, CircleXIcon } from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { cn } from '@/lib/utils'
import { actionRemoveBookmark } from '@/server/actions/remove-bookmark'

interface RemoveBookmarkProps {
  bookmarkId: string
}

export function BookmarkDeleteButton({ bookmarkId }: RemoveBookmarkProps) {
  const [shortcutPressed, setShortcutPressed] = useState(false)
  const [isPending, startTransition] = useTransition()

  const commandTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)
  const { remove } = useBookmarks()

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-render
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setShortcutPressed(true)
        handleRemoveBookmark()

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
  }, [])

  async function handleRemoveBookmark() {
    startTransition(async () => {
      remove(bookmarkId)

      const result = await actionRemoveBookmark(bookmarkId)

      if (result.success === false) {
        toast.error(result.message)
        return
      }
    })
  }

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className={cn('w-full relative cursor-pointer', shortcutPressed && 'bg-accent')}
        onClick={handleRemoveBookmark}
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
        <DropdownMenuShortcut>⌘+⇧+D</DropdownMenuShortcut>
      </Button>
    </DropdownMenuItem>
  )
}
