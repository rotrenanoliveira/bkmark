import { XIcon } from 'lucide-react'
import { BookmarkRenameForm } from '@/components/bookmarks/bookmark-rename-form'

interface RenameBookmarkContentProps {
  bookmarkId: string
  onClose?: () => void
}

export function RenameBookmarkContent({ bookmarkId, onClose }: RenameBookmarkContentProps) {
  return (
    <div className="w-full max-w-sm flex flex-col gap-4 relative ring-foreground/10 bg-card text-card-foreground overflow-hidden rounded-xl py-4 text-sm ring-1 group/card">
      <div className="grid auto-rows-min items-start gap-1 border-b rounded-t-xl px-4 [.border-b]:pb-4">
        <div className="text-base leading-snug font-medium">Rename a new bookmark</div>
        <div className="text-muted-foreground text-sm">Update the title of the bookmark you want to rename.</div>

        {onClose && (
          <button type="button" className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
            <XIcon className="size-5" />
          </button>
        )}
      </div>

      <div className="flex flex-row px-4 ">
        <BookmarkRenameForm bookmarkId={bookmarkId} beforeSubmit={onClose} />
      </div>
    </div>
  )
}
