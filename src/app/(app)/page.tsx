import { BookmarkForm } from '@/components/bookmarks/bookmark-form'
import { UnfoldedBookmarks } from '@/components/bookmarks/unfolded-bookmarks'
import { FolderForm } from '@/components/folders/folder-form'
import { Folders } from '@/components/folders/folders'
import { Header } from '@/components/header'

export default async function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <main className="w-full flex flex-col items-center p-6 space-y-4">
        <section className="w-full max-w-4xl grid grid-cols-1 gap-4">
          <BookmarkForm />
          <FolderForm />

          <UnfoldedBookmarks />
          <Folders />
        </section>
      </main>
    </div>
  )
}
