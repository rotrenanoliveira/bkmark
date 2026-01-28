'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SynchronizePageContent } from '@/app/(app)/(forms)/sync/_components/synchronize-page-content'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

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
        className="w-full md:w-fit font-(family-name:--font-geist-sans) p-0 rounded-xl"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle className="text-center">Synchronize</DialogTitle>
          <DialogDescription>Synchronize your bookmarks across devices with your access code.</DialogDescription>
        </DialogHeader>

        <SynchronizePageContent userId={userId} syncUrl={syncUrl.toString()} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
