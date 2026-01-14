'use client'

import { Copy } from 'lucide-react'
import { useQRCode } from 'next-qrcode'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { SyncForm } from './sync-form'

interface SyncDialogProps {
  userId: string
  appUrl: string
}

export function SyncDialog({ userId, appUrl }: SyncDialogProps) {
  const { SVG } = useQRCode()

  const [isOpen, setIsOpen] = useState(false)

  const syncUrl = new URL('api/sync', appUrl)
  syncUrl.searchParams.append('code', userId)

  function handleCopy() {
    navigator.clipboard.writeText(userId)
  }

  function handleClose() {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full text-left p-2 py-1.5 rounded-sm text-sm hover:bg-muted">
        <span>Synchronize</span>
      </DialogTrigger>
      <DialogContent className="max-w-72 font-[family-name:var(--font-geist-sans)]">
        {/* dialog header */}
        <DialogHeader>
          <DialogTitle className="text-center">synchronize</DialogTitle>
        </DialogHeader>
        {/* current sync code */}
        <div className="w-full flex items-center justify-between rounded-md bg-muted-foreground/15 p-2 text-sm">
          <p className="font-[family-name:var(--font-geist-mono)]">{userId}</p>
          <Button variant="ghost" className="p-2 h-fit hover:bg-muted-foreground/25" onClick={handleCopy}>
            <Copy className="size-4" />
          </Button>
        </div>

        <div className="w-full flex items-center justify-center">
          <SVG
            text={syncUrl.toString()}
            options={{ margin: 1, width: 200, color: { dark: '#000000', light: '#ffffff' } }}
          />
        </div>

        {/*  */}
        <div className="w-full max-w-72 flex items-center justify-center gap-1">
          <Separator className="w-5/12" />
          <span className="font-light font-[family-name:var(--font-geist-mono)]">or</span>
          <Separator className="w-5/12" />
        </div>
        {/* Sync form */}
        <SyncForm closeDialog={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
