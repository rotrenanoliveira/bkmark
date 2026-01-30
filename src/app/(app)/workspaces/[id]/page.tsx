import { notFound } from 'next/navigation'
import { Bookmark } from '@/components/bookmarks/bookmark'
import { Header } from '@/components/header'
import { getBookmarks } from '@/server/data/get-bookmarks'
import { getUserId } from '@/server/data/get-user-id'
import { getWorkspace } from '@/server/data/get-workspace'
import { CreateBookmark } from './_components/create-bookmark'

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: workspaceId } = await params

  const workspace = await getWorkspace(workspaceId)
  if (!workspace) notFound()

  const userId = await getUserId()
  const bookmarks = await getBookmarks({ userId, workspaceId })

  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <main className="w-full flex flex-col items-center p-6 space-y-4">
        <section className="w-full max-w-4xl grid grid-cols-1 gap-4">
          <CreateBookmark workspaceId={workspaceId} />

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
