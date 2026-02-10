import { Layers2Icon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { BookmarksList } from '@/components/bookmarks/bookmarks-list'
import { CreateBookmarkForm } from '@/components/bookmarks/create-bookmark-form'
import { FoldersList } from '@/components/folders/folders-list'
import { Header } from '@/components/layout/header/header'
import { getWorkspace } from '@/server/data/get-workspace'

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: workspaceId } = await params
  const workspace = await getWorkspace(workspaceId)
  if (!workspace) notFound()

  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <main className="flex flex-col items-center p-4">
        <section className="w-full max-w-4xl grid grid-cols-1">
          <CreateBookmarkForm />

          <div className="w-full inline-flex items-center mt-4 gap-2 border">
            <div className="size-12 flex items-center justify-center border-r">
              <Layers2Icon className="size-5 text-(--app-primary)/80" />
            </div>
            <span className="max-w-72 md:max-w-full truncate font-semibold font-(family-name:--font-geist-mono)">
              {workspace.name}
            </span>
          </div>

          <div className="border-x">
            <BookmarksList />
            <FoldersList />
          </div>
        </section>
      </main>
    </div>
  )
}
