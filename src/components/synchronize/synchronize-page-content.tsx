import { TicketIcon, XIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { CopyAccessCode } from './copy-access-code'
import { SynchronizeForm } from './synchronize-form'

interface SynchronizePageContentProps {
  userId: string
  syncUrl: string
  onClose?: () => void
}

export function SynchronizePageContent({ userId, onClose }: SynchronizePageContentProps) {
  return (
    <Card className="max-w-sm">
      <CardHeader className="border-none">
        <CardTitle>Synchronize bookmarks</CardTitle>
        <CardDescription>Synchronize your bookmarks across devices with your access code.</CardDescription>

        {onClose && (
          <button type="button" className="absolute cursor-pointer top-4 right-4" onClick={onClose}>
            <XIcon className="size-5" />
          </button>
        )}
      </CardHeader>

      <CardContent className="w-full flex-col">
        <div className="w-full flex flex-col gap-2">
          <p className="sr-only">Access code</p>

          <div className="h-12 w-full flex items-center border-t border-b bg-muted-foreground/5">
            <div className="size-12 border-r flex items-center justify-center">
              <TicketIcon className="size-5 stroke-red-500" />
            </div>
            <p className="ml-4 flex-1 font-(family-name:--font-geist-mono)">{userId}</p>
            <CopyAccessCode userId={userId} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col">
        <div className="p-4 space-y-2">
          <p className="text-base font-medium leading-snug">Already have an access code?</p>
          <span className="text-sm text-muted-foreground">Enter the access code to synchronize your bookmarks.</span>
        </div>

        <SynchronizeForm onSuccess={onClose} />
      </CardFooter>
    </Card>
  )
}
