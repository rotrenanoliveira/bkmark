import { CreateBookmarkForm } from '../bookmarks/create-bookmark-form'
import { DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

interface CreateBookmarkContentProps {
  onClose?: () => void
}

export function CreateBookmarkContent({ onClose }: CreateBookmarkContentProps) {
  return (
    <>
      <DialogHeader className="sr-only">
        <DialogTitle className="text-center">Register a new bookmark</DialogTitle>
        <DialogDescription>Enter the URL of the bookmark you want to add.</DialogDescription>
      </DialogHeader>

      <div className="w-full flex flex-col gap-4 relative ring-foreground/10 bg-card text-card-foreground overflow-hidden py-4 text-sm ring-1 group/card">
        <div className="grid auto-rows-min items-start gap-1 border-b rounded-t-xl px-4 [.border-b]:pb-4">
          <div className="text-base leading-snug font-medium">Register a new bookmark</div>
          <div className="text-muted-foreground text-sm">Insert the link of the bookmark you want to add.</div>
        </div>

        <div className="flex flex-row px-4">
          <CreateBookmarkForm beforeSubmit={onClose} focus={true} />
        </div>
      </div>
    </>
  )
}
