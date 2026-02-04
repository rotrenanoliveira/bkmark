import { ArrowBigRightDashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { queryClient } from '@/lib/react-query'
import { actionMoveBookmarkToGroup } from '@/server/actions/move-bookmark-to-group'
import { DropdownMenuItem } from '../ui/dropdown-menu'

interface MoveBookmarkButtonProps {
  bookmarkId: string
  currentGroup?: string | null
  groupName: string
  groupId: string
  type: 'folder' | 'workspace'
}

export function MoveBookmarkButton({ bookmarkId, groupId, groupName, currentGroup, type }: MoveBookmarkButtonProps) {
  const [_, startTransition] = useTransition()
  const { remove } = useBookmarks()

  const router = useRouter()

  async function handleUpdateBookmark(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    startTransition(async () => {
      remove(bookmarkId)

      const result = await actionMoveBookmarkToGroup({
        bookmarkId,
        folderId: type === 'folder' ? groupId : null,
        workspaceId: type === 'workspace' ? groupId : null,
      })

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      if (type === 'folder') {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: [`folder:${currentGroup}`] }),
          queryClient.invalidateQueries({ queryKey: [`folder:${groupId}`] }),
        ])
      }

      if (type === 'workspace') {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: [`workspace:${currentGroup}`] }),
          queryClient.invalidateQueries({ queryKey: [`workspace:${groupId}`] }),
        ])
      }

      router.refresh()
    })
  }

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className="w-full max-w-32 md:max-w-64 relative justify-start cursor-pointer truncate"
        onClick={handleUpdateBookmark}
        disabled={currentGroup === groupId}
      >
        <ArrowBigRightDashIcon className="absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <p className="relative left-4 truncate">{groupName}</p>
      </Button>
    </DropdownMenuItem>
  )
}
