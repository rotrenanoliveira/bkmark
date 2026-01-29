import { ArrowBigRightDashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { queryClient } from '@/lib/react-query'
import { actionAddBookmarkToFolder } from '@/server/actions/add-bookmark-to-folder'
import { DropdownMenuItem } from '../ui/dropdown-menu'

interface MoveBookmarkButtonProps {
  bookmarkId: string
  currentFolder?: string | null
  folderName: string
  folderId: string
}

export function MoveBookmarkButton({ bookmarkId, folderId, folderName, currentFolder }: MoveBookmarkButtonProps) {
  const [_, startTransition] = useTransition()
  const { remove } = useBookmarks()

  const router = useRouter()

  async function handleUpdateBookmark(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    startTransition(async () => {
      remove(bookmarkId)

      const result = await actionAddBookmarkToFolder({ bookmarkId, folderId })

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [`folder:${currentFolder}`] }),
        queryClient.invalidateQueries({ queryKey: [`folder:${folderId}`] }),
      ])

      router.refresh()
    })
  }

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className="w-full max-w-32 md:max-w-full relative justify-start cursor-pointer truncate"
        onClick={handleUpdateBookmark}
        disabled={currentFolder === folderId}
      >
        <ArrowBigRightDashIcon className="absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <p className="relative left-4">{folderName}</p>
      </Button>
    </DropdownMenuItem>
  )
}
