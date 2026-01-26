'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AddFolderContent } from '@/app/(app)/(registers)/folders/new/_components/add-folder-content'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function AddFolderDialogContent() {
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
          <DialogTitle className="text-center">Register a new folder</DialogTitle>
          <DialogDescription>Enter the name of the folder you want to add.</DialogDescription>
        </DialogHeader>

        <AddFolderContent onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
