import { CornerDownLeftIcon } from 'lucide-react'
import { useRef, useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { useBounce } from '@/hooks/use-bounce'
import { queryClient } from '@/lib/react-query'
import { actionRemoveBookmarkFromFolder } from '@/server/actions/remove-bookmark-from-folder'

interface BookmarkRemoveFromFolderButtonProps {
  bookmarkId: string
  currentFolder?: string | null
}

export function BookmarkRemoveFromFolderButton({ bookmarkId, currentFolder }: BookmarkRemoveFromFolderButtonProps) {
  const [_, startTransition] = useTransition()

  const buttonRef = useRef<HTMLButtonElement>(null)

  const { remove } = useBookmarks()
  const { bounce } = useBounce()

  async function handleRemoveFromFolder() {
    bounce(buttonRef)

    startTransition(async () => {
      remove(bookmarkId)

      const result = await actionRemoveBookmarkFromFolder({ bookmarkId })

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      await queryClient.invalidateQueries({ queryKey: [`folder:${currentFolder}`] })
    })
  }

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className="w-full relative justify-start cursor-pointer"
        onClick={handleRemoveFromFolder}
        ref={buttonRef}
      >
        <CornerDownLeftIcon className="absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <span className="relative left-6">Remove from folder</span>
      </Button>
    </DropdownMenuItem>
  )
}
