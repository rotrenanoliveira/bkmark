import { toast } from 'sonner'
import { FolderMinus } from 'lucide-react'
import { useTransition } from 'react'

import { useBookmarks } from '@/components/bookmarks/bookmarks-context'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { actionRemoveBookmarkFromFolder } from '@/server/actions/remove-bookmark-from-folder'

interface RemoveBookmarkProps {
  bookmarkId: string
}

export function BookmarkRemoveFromFolderButton({ bookmarkId }: RemoveBookmarkProps) {
  const [isPending, startTransition] = useTransition()
  const { remove } = useBookmarks()

  async function handleRemoveBookmark() {
    const result = await actionRemoveBookmarkFromFolder({ bookmarkId })
    remove(bookmarkId)

    if (result.success === false) {
      toast.error(result.message)
      return
    }
  }

  return (
    <DropdownMenuItem>
      <Button
        variant="ghost"
        className="w-full h-fit m-0 p-0 justify-start border-none hover:bg-none font-medium"
        onClick={() => startTransition(handleRemoveBookmark)}
        disabled={isPending}
      >
        <FolderMinus strokeWidth={1.25} className="size-4" />
        Remove from folder
      </Button>
    </DropdownMenuItem>
  )
}
