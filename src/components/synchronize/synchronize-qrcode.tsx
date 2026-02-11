import { QrCodeIcon, ViewIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { AccessCodeQrCode } from './qrcode-access-code'

interface SynchronizeQrCodeProps {
  syncUrl: string
}

export function SynchronizeQrCode({ syncUrl }: SynchronizeQrCodeProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="sr-only">QR Code</p>
      <Popover>
        <PopoverTrigger asChild>
          <div className="h-12 w-full flex items-center border-b cursor-pointer bg-muted-foreground/5">
            <div className="size-12 border-r flex items-center justify-center">
              <QrCodeIcon className="size-5 stroke-red-500" />
            </div>
            <p className="ml-4 flex-1 font-(family-name:--font-geist-mono)">Show</p>

            <div className="size-12 flex items-center justify-center">
              <ViewIcon className="size-5" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-40">
          <AccessCodeQrCode syncUrl={syncUrl.toString()} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
