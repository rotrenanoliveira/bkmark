import { CircleMinusIcon, CircleXIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { actionRemoveBookmark } from '@/server/actions/remove-bookmark'

interface RemoveBookmarkProps {
  bookmarkId: string
  currentFolder?: string | null
}

export function DeleteBookmark({ bookmarkId, currentFolder }: RemoveBookmarkProps) {
  const [shortcutPressed, setShortcutPressed] = useState(false)
  const [isPending, startTransition] = useTransition()

  const commandTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const { remove } = useBookmarks()

  const handleDeleteBookmark = useCallback(async () => {
    startTransition(async () => {
      remove(bookmarkId)

      const result = await actionRemoveBookmark(bookmarkId)

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      await queryClient.invalidateQueries({ queryKey: [`folder:${currentFolder}`] })
    })
  }, [remove, bookmarkId, currentFolder])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // TODO: incluir validação para o windows
      if (e.metaKey && e.key === 'Backspace') {
        e.preventDefault()
        setShortcutPressed(true)
        handleDeleteBookmark()

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
  }, [handleDeleteBookmark])

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className={cn('w-full relative cursor-pointer', shortcutPressed && 'bg-accent')}
        onClick={handleDeleteBookmark}
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
        <DropdownMenuShortcut>
          {'\u2318'}+{'\u232B'} {/* Command + Backspace */}
        </DropdownMenuShortcut>
      </Button>
    </DropdownMenuItem>
  )
}
