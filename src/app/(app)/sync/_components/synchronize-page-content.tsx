import { QrCodeIcon, RefreshCcwIcon, TicketIcon, ViewIcon, XIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CopyAccessCode } from './copy-access-code'
import { AccessCodeQrCode } from './qrcode-access-code'
import { SyncForm } from './sync-form'

interface SynchronizePageContentProps {
  userId: string
  syncUrl: string
  onClose?: () => void
}

export function SynchronizePageContent({ userId, syncUrl, onClose }: SynchronizePageContentProps) {
  return (
    <div className="w-full max-w-sm flex flex-col gap-4 relative ring-foreground/10 bg-card text-card-foreground overflow-hidden rounded-xl py-4 text-sm ring-1 group/card">
      <div className="grid auto-rows-min items-start gap-1 border-b rounded-t-xl px-4 [.border-b]:pb-4">
        <div className="text-base leading-snug font-medium">Synchronize your bookmarks</div>
        <div className="text-muted-foreground text-sm">
          Use the access code below to synchronize your bookmarks with your device.
        </div>

        {onClose && (
          <button type="button" className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
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
          <div className="w-full flex py-2 px-4 items-center justify-between rounded-lg border bg-muted-foreground/5">
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
              className="w-full flex py-2 px-4 items-center justify-between rounded-lg cursor-pointer border bg-muted-foreground/5"
              asChild
            >
              <div className="w-full flex py-2 px-4 items-center justify-between rounded-lg border bg-muted-foreground/5">
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

      <div className="space-y-4 px-4">
        <div className="flex flex-col gap-2 ">
          <div className="inline-flex items-center gap-2">
            <div className="flex items-center justify-center p-2 bg-muted-foreground/15 rounded-3xl">
              <RefreshCcwIcon className="size-4 stroke-blue-500" />
            </div>
            <p className="text-base leading-snug font-medium">Already have an access code?</p>
          </div>
          <span className="text-muted-foreground text-sm">Enter the access code to synchronize your bookmarks.</span>
        </div>
        <SyncForm />
      </div>
    </div>
  )
}
