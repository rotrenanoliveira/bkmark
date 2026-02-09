import { CircleXIcon } from 'lucide-react'
import { useCallback, useRef, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { useBounce } from '@/hooks/use-bounce'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { queryClient } from '@/lib/react-query'
import { actionRemoveBookmark } from '@/server/actions/remove-bookmark'

interface RemoveBookmarkProps {
  bookmarkId: string
  currentFolder?: string | null
}

export function DeleteBookmark({ bookmarkId, currentFolder }: RemoveBookmarkProps) {
  const [isPending, startTransition] = useTransition()

  const buttonRef = useRef<HTMLButtonElement>(null)

  const { remove } = useBookmarks()
  const { bounce } = useBounce()

  const handleDeleteBookmark = useCallback(async () => {
    bounce(buttonRef)

    startTransition(async () => {
      remove(bookmarkId)

      const result = await actionRemoveBookmark(bookmarkId)

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      await queryClient.invalidateQueries({ queryKey: [`folder:${currentFolder}`] })
    })
  }, [bounce, remove, bookmarkId, currentFolder])

  useKeyboardShortcut('d', handleDeleteBookmark, ['Mod'])

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className="w-full relative cursor-pointer"
        onClick={handleDeleteBookmark}
        disabled={isPending}
        ref={buttonRef}
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
