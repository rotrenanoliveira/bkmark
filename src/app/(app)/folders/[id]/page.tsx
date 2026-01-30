import { notFound } from 'next/navigation'
import { Bookmark } from '@/components/bookmarks/bookmark'
import { Header } from '@/components/header'
import { getBookmarks } from '@/server/data/get-bookmarks'
import { getFolder } from '@/server/data/get-folder'
import { getUserId } from '@/server/data/get-user-id'
import { CreateBookmark } from './_components/create-bookmark'

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: folderId } = await params

  const folder = await getFolder(folderId)
  if (!folder) notFound()

  const userId = await getUserId()
  const bookmarks = await getBookmarks(userId, folderId)

  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <main className="w-full flex flex-col items-center p-6 space-y-4">
        <section className="w-full max-w-4xl grid grid-cols-1 gap-4">
          <CreateBookmark folderId={folderId} />

          <div className="space-y-2">
            {bookmarks.map((bookmark) => (
              <Bookmark key={bookmark.bookmarkId} bookmark={bookmark} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
