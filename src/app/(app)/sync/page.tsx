import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { getUserId } from '@/server/data/get-user-id'
import { CopyAccessCode } from './_components/copy-access-code'
import { AccessCodeQrCode } from './_components/qrcode-access-code'
import { SyncForm } from './_components/sync-form'

export default async function SynchronizePage() {
  const userId = await getUserId()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  if (!userId) {
    redirect('/api/sync/generate')
  }

  const syncUrl = new URL('api/sync', appUrl)
  syncUrl.searchParams.append('code', userId)

  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <main className="w-full flex flex-col items-center py-6 space-y-4">
        <Dialog defaultOpen>
          <DialogContent className="w-72 font-(family-name:--font-geist-sans)">
            {/* Dialog header */}
            <DialogHeader>
              <DialogTitle className="text-center">Synchronize</DialogTitle>
            </DialogHeader>
            {/* current sync code */}
            <div className="w-full flex items-center justify-between rounded-md bg-muted-foreground/15 p-2 text-sm">
              <p className="font-(family-name:--font-geist-mono)">{userId}</p>
              <CopyAccessCode userId={userId} />
            </div>
            {/* QR code */}
            <AccessCodeQrCode syncUrl={syncUrl.toString()} />
            {/* Divider */}
            <div className="w-full max-w-72 flex items-center justify-center gap-1">
              <Separator className="flex-1" />
              <span className="font-light font-(family-name:--font-geist-mono)">or</span>
              <Separator className="flex-1" />
            </div>
            {/* Sync form */}
            <SyncForm />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
