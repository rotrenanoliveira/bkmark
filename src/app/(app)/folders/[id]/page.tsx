import { BookmarksList } from '@/components/bookmarks/bookmarks-list'
import { Header } from '@/components/header'
import { CreateBookmark } from './_components/create-bookmark'

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: folderId } = await params

  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <main className="w-full flex flex-col items-center p-6 space-y-4">
        <section className="w-full max-w-4xl grid grid-cols-1 gap-4">
          <CreateBookmark folderId={folderId} />

          <BookmarksList />
        </section>
      </main>
    </div>
  )
}
