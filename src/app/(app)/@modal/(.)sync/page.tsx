import { redirect } from 'next/navigation'
import { getUserId } from '@/server/data/get-user-id'
import { SyncDialogContent } from './_components/sync-dialog-content'

export default async function SynchronizeModal() {
  const userId = await getUserId()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  if (!userId) {
    redirect('/api/sync/generate')
  }

  const syncUrl = new URL('api/sync', appUrl)

  return <SyncDialogContent userId={userId} syncUrl={syncUrl.toString()} />
}
