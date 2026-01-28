'use client'

import { use } from 'react'
import { RenameBookmarkContent } from '@/components/bookmarks/rename-bookmark-content'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InterceptDialog } from '@/components/ui/intercept-dialog'
import { useInterceptModal } from '@/hooks/use-intercept-modal'

export default function BookmarkRenamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookmarkId } = use(params)
  const { open, setOpen, handleClose } = useInterceptModal()

  return (
    <InterceptDialog open={open} setOpen={setOpen}>
      <DialogHeader className="sr-only">
        <DialogTitle className="text-center">Rename a new bookmark</DialogTitle>
        <DialogDescription>Update the title of the bookmark you want to rename.</DialogDescription>
      </DialogHeader>

      <RenameBookmarkContent bookmarkId={bookmarkId} onClose={handleClose} />
    </InterceptDialog>
  )
}
