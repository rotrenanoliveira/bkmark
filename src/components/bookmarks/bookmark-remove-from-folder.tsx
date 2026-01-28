import { CornerDownLeftIcon } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { actionRemoveBookmarkFromFolder } from '@/server/actions/remove-bookmark-from-folder'

interface BookmarkRemoveFromFolderButtonProps {
  bookmarkId: string
}

export function BookmarkRemoveFromFolderButton({ bookmarkId }: BookmarkRemoveFromFolderButtonProps) {
  const [_, startTransition] = useTransition()

  const { remove } = useBookmarks()

  async function handleRemoveFromFolder() {
    startTransition(async () => {
      remove(bookmarkId)

      const result = await actionRemoveBookmarkFromFolder({ bookmarkId })

      if (result.success === false) {
        toast.error(result.message)
        return
      }
    })
  }

  return (
    <DropdownMenuItem asChild>
      <Button variant="ghost" className="w-full relative justify-start cursor-pointer" onClick={handleRemoveFromFolder}>
        <CornerDownLeftIcon className="absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <span className="relative left-6">Remove from folder</span>
      </Button>
    </DropdownMenuItem>
  )
}
