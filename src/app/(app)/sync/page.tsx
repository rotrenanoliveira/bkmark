import { redirect } from 'next/navigation'
import { SynchronizePageContent } from '@/components/synchronize/synchronize-page-content'
import { getUserId } from '@/server/data/get-user-id'

export default async function SynchronizePage() {
  const userId = await getUserId()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  if (!userId) {
    redirect('/api/sync/generate')
  }

  const syncUrl = new URL('api/sync', appUrl)
  syncUrl.searchParams.append('code', userId)

  return <SynchronizePageContent userId={userId} syncUrl={syncUrl.toString()} />
}
