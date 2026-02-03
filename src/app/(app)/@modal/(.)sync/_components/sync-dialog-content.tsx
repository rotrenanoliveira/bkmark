'use client'

import { SynchronizePageContent } from '@/app/(app)/(forms)/sync/_components/synchronize-page-content'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InterceptDialog } from '@/components/ui/intercept-dialog'
import { useInterceptModal } from '@/hooks/use-intercept-modal'

interface SyncDialogContentProps {
  userId: string
  syncUrl: string
}

export function SyncDialogContent({ userId, syncUrl }: SyncDialogContentProps) {
  const { open, setOpen, handleClose } = useInterceptModal()

  return (
    <InterceptDialog open={open} setOpen={setOpen}>
      <DialogHeader className="sr-only">
        <DialogTitle className="text-center">Synchronize</DialogTitle>
        <DialogDescription>Synchronize your bookmarks across devices with your access code.</DialogDescription>
      </DialogHeader>

      <SynchronizePageContent userId={userId} syncUrl={syncUrl.toString()} onClose={handleClose} />
    </InterceptDialog>
  )
}
