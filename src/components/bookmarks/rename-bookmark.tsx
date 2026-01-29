import { PencilIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { Button } from '../ui/button'
import { DropdownMenuItem, DropdownMenuShortcut } from '../ui/dropdown-menu'

interface RenameBookmarkProps {
  bookmarkId: string
}

export function RenameBookmark({ bookmarkId }: RenameBookmarkProps) {
  const router = useRouter()

  const handleRename = useCallback(() => router.push(`/bookmarks/${bookmarkId}/rename`), [bookmarkId, router.push])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === 'x') {
        e.preventDefault()
        handleRename()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [handleRename])

  return (
    <DropdownMenuItem asChild>
      <Button variant="ghost" className="w-full relative cursor-pointer" onClick={handleRename}>
        <PencilIcon className="absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <span className="relative left-6">Rename</span>
        <DropdownMenuShortcut>⌘+⇧+X</DropdownMenuShortcut>
      </Button>
    </DropdownMenuItem>
  )
}
