'use client'

import { CreateBookmarkContent } from '@/components/bookmarks/create-bookmark-content'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InterceptDialog } from '@/components/ui/intercept-dialog'
import { useInterceptModal } from '@/hooks/use-intercept-modal'

export default function CreateBookmarkInterceptDialog() {
  const { open, setOpen, handleClose } = useInterceptModal()

  return (
    <InterceptDialog open={open} setOpen={setOpen}>
      <DialogHeader className="sr-only">
        <DialogTitle className="text-center">Register a new bookmark</DialogTitle>
        <DialogDescription>Enter the URL of the bookmark you want to add.</DialogDescription>
      </DialogHeader>

      <CreateBookmarkContent onClose={handleClose} />
    </InterceptDialog>
  )
}
