import { BookmarksList } from '@/components/bookmarks/bookmarks-list'
import { CreateBookmarkForm } from '@/components/bookmarks/create-bookmark-form'
import { FolderForm } from '@/components/folders/folder-form'
import { Folders } from '@/components/folders/folders'
import { Header } from '@/components/header'

export default async function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <main className="w-full flex flex-col items-center p-6 space-y-4">
        <section className="w-full max-w-4xl grid grid-cols-1 gap-4">
          <CreateBookmarkForm />
          <FolderForm />

          <BookmarksList />
          <Folders />
        </section>
      </main>
    </div>
  )
}
