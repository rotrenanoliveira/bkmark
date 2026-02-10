import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/header/header'
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

  return (
    <div className="flex flex-col w-screen min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center h-[calc(100svh-75px)] py-6 space-y-4">
        <SynchronizePageContent userId={userId} syncUrl={syncUrl.toString()} />
      </main>
    </div>
  )
}
