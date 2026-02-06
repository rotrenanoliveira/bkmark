import { BookmarksList } from '@/components/bookmarks/bookmarks-list'
import { CreateBookmarkForm } from '@/components/bookmarks/create-bookmark-form'
import { FoldersList } from '@/components/folders/folders-list'
import { Header } from '@/components/layout/header/header'

export default async function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <main className="w-full flex flex-col items-center p-6 space-y-4">
        <section className="w-full max-w-4xl grid grid-cols-1 gap-4">
          <CreateBookmarkForm />

          <BookmarksList />
          <FoldersList />
        </section>
      </main>
    </div>
  )
}
