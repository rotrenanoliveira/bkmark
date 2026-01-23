'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SynchronizePageContent } from '@/app/(app)/sync/_components/synchronize-page-content'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface SyncDialogContentProps {
  userId: string
  syncUrl: string
}

export function SyncDialogContent({ userId, syncUrl }: SyncDialogContentProps) {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  function handleClose() {
    router.back()
    setOpen(false)
  }

  return (
    <Dialog defaultOpen open={open} onOpenChange={setOpen}>
      <DialogContent className="w-fit font-(family-name:--font-geist-sans) p-0 rounded-xl" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle className="text-center">Synchronize</DialogTitle>
        </DialogHeader>

        <SynchronizePageContent userId={userId} syncUrl={syncUrl.toString()} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
