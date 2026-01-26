'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RenameBookmarkContent } from '@/app/(app)/(registers)/bookmarks/[id]/rename/_components/rename-bookmark-content'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface RenameBookmarkDialogContentProps {
  bookmarkId: string
}

export function RenameBookmarkDialogContent({ bookmarkId }: RenameBookmarkDialogContentProps) {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  function handleClose() {
    setOpen(false)
    router.back()
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        e.target instanceof HTMLInputElement
      ) {
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        router.back()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [router])

  return (
    <Dialog defaultOpen open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-full md:w-96 font-(family-name:--font-geist-sans) p-0 rounded-xl"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle className="text-center">Rename a new bookmark</DialogTitle>
          <DialogDescription>Update the title of the bookmark you want to rename.</DialogDescription>
        </DialogHeader>

        <RenameBookmarkContent bookmarkId={bookmarkId} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
