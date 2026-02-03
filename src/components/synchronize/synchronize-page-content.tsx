import { QrCodeIcon, RefreshCcwIcon, TicketIcon, ViewIcon, XIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CopyAccessCode } from './copy-access-code'
import { AccessCodeQrCode } from './qrcode-access-code'
import { SynchronizeForm } from './synchronize-form'

interface SynchronizePageContentProps {
  userId: string
  syncUrl: string
  onClose?: () => void
}

export function SynchronizePageContent({ userId, syncUrl, onClose }: SynchronizePageContentProps) {
  return (
    <div className="relative flex flex-col w-full max-w-sm gap-4 py-4 overflow-hidden text-sm ring-foreground/10 bg-card text-card-foreground rounded-xl ring-1 group/card">
      <div className="grid auto-rows-min items-start gap-1 border-b rounded-t-xl px-4 [.border-b]:pb-4">
        <div className="text-base font-medium leading-snug">Synchronize your bookmarks</div>
        <div className="text-sm text-muted-foreground">
          Use the access code below to synchronize your bookmarks with your device.
        </div>

        {onClose && (
          <button type="button" className="absolute cursor-pointer top-4 right-4" onClick={onClose}>
            <XIcon className="size-5" />
          </button>
        )}
      </div>

      <div className="px-4 space-y-4 border-b [.border-b]:pb-4">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2">
            <div className="flex items-center justify-center p-2 bg-muted-foreground/15 rounded-3xl">
              <TicketIcon className="size-4 stroke-red-500" />
            </div>
            <p className="text-sm font-medium">Access code</p>
          </div>
          <div className="flex items-center justify-between w-full px-4 py-2 border rounded-lg bg-muted-foreground/5">
            <p className="font-(family-name:--font-geist-mono)">{userId}</p>
            <CopyAccessCode userId={userId} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2">
            <div className="flex items-center justify-center p-2 bg-muted-foreground/15 rounded-3xl">
              <QrCodeIcon className="size-4 stroke-red-500" />
            </div>
            <p className="text-sm font-medium">QR Code</p>
          </div>
          <Popover>
            <PopoverTrigger
              className="flex items-center justify-between w-full px-4 py-2 border rounded-lg cursor-pointer bg-muted-foreground/5"
              asChild
            >
              <div className="flex items-center justify-between w-full px-4 py-2 border rounded-lg bg-muted-foreground/5">
                <p className="font-(family-name:--font-geist-mono)">Show</p>
                <div className="flex items-center justify-center size-8">
                  <ViewIcon className="size-5" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-40">
              <AccessCodeQrCode syncUrl={syncUrl.toString()} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <div className="flex flex-col gap-2 ">
          <div className="inline-flex items-center gap-2">
            <div className="flex items-center justify-center p-2 bg-muted-foreground/15 rounded-3xl">
              <RefreshCcwIcon className="size-4 stroke-blue-500" />
            </div>
            <p className="text-base font-medium leading-snug">Already have an access code?</p>
          </div>
          <span className="text-sm text-muted-foreground">Enter the access code to synchronize your bookmarks.</span>
        </div>
        <SynchronizeForm onSuccess={onClose} />
      </div>
    </div>
  )
}
