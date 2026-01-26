import { ArrowBigRightDashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { actionAddBookmarkToFolder } from '@/server/actions/add-bookmark-to-folder'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { useBookmarks } from './bookmarks-context'

interface BookmarkMoveProps {
  bookmarkId: string
  currentFolder?: string | null
  folderId: string
  folderName: string
}

export function BookmarkMoveToFolder({ bookmarkId, folderId, folderName, currentFolder }: BookmarkMoveProps) {
  const [_, startTransition] = useTransition()

  const router = useRouter()

  const { remove } = useBookmarks()

  async function handleUpdateBookmark(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    startTransition(async () => {
      remove(bookmarkId)

      const result = await actionAddBookmarkToFolder({ bookmarkId, folderId })

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      router.refresh()
    })
  }

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className="w-full relative justify-start cursor-pointer"
        onClick={handleUpdateBookmark}
        disabled={currentFolder === folderId}
      >
        <ArrowBigRightDashIcon className="absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <span className="relative left-6 truncate">{folderName}</span>
      </Button>
    </DropdownMenuItem>
  )
}
