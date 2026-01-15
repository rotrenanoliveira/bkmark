import { Header } from '@/components/header'

export default async function HomePage() {
  // const userId = await getUserId()
  // // const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''

  // if (!userId) {
  //   redirect('/api/sync/generate')
  // }

  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      {/* <main className="w-full flex flex-col items-center py-6 space-y-4">
        <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between gap-2">
          <BookmarkForm />

          <div className="space-x-2 self-end">
            <FolderDialog />
            <SyncDialog userId={userId} appUrl={appUrl} />
          </div>
        </div>

        <section className="w-full max-w-4xl grid grid-cols-1 gap-4">
          <UnfoldedBookmarks />
          <Folders />
        </section>
      </main>

      <Header /> */}
    </div>
  )
}
