'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AddBookmarkContent } from '@/app/(app)/(forms)/bookmarks/new/_components/add-bookmark-content'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function AddBookmarkDialogContent() {
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
        setOpen(false)
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
          <DialogTitle className="text-center">Register a new bookmark</DialogTitle>
          <DialogDescription>Enter the URL of the bookmark you want to add.</DialogDescription>
        </DialogHeader>

        <AddBookmarkContent onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
