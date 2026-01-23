import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { getUserId } from '@/server/data/get-user-id'
import { SynchronizePageContent } from './_components/synchronize-page-content'

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
      <main className="w-full flex flex-col items-center justify-center h-[calc(100svh-72px)] py-6 space-y-4">
        <SynchronizePageContent userId={userId} syncUrl={syncUrl.toString()} />
      </main>
    </div>
  )
}
