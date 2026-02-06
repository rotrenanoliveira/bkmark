import { BookmarksList } from '@/components/bookmarks/bookmarks-list'
import { CreateBookmarkForm } from '@/components/bookmarks/create-bookmark-form'
import { FoldersList } from '@/components/folders/folders-list'
import { Header } from '@/components/layout/header/header'

export default function WorkspacePage() {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <Header />
      <main className="flex flex-col items-center w-full p-6 space-y-4">
        <section className="grid w-full max-w-4xl grid-cols-1 gap-4">
          <CreateBookmarkForm />

          <BookmarksList />
          <FoldersList />
        </section>
      </main>
    </div>
  )
}
