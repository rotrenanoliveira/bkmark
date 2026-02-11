import { FolderClosedIcon, Layers2Icon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { BookmarksList } from '@/components/bookmarks/bookmarks-list'
import { CreateBookmarkForm } from '@/components/bookmarks/create-bookmark-form'
import { Header } from '@/components/layout/header/header'
import { getFolder } from '@/server/data/get-folder'
import { getWorkspace } from '@/server/data/get-workspace'

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: folderId } = await params
  const folder = await getFolder(folderId)
  if (!folder) notFound()

  const workspace = folder.workspaceId ? await getWorkspace(folder.workspaceId) : null

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex flex-col items-center p-4">
        <section className="w-full max-w-4xl grid grid-cols-1">
          <CreateBookmarkForm />

          <div className="flex flex-col md:flex-row md:items-center mt-4 md:gap-2 border">
            {workspace && (
              <div className="w-full md:w-fit hidden md:inline-flex items-center gap-2 border-b md:border-none">
                <div className="size-12 flex items-center justify-center border-r">
                  <Layers2Icon className="size-5 text-muted-foreground" />
                </div>
                <span className="max-w-64 md:max-w-full truncate font-semibold font-(family-name:--font-geist-mono)">
                  {workspace?.name}
                </span>
              </div>
            )}

            <div className="w-full inline-flex items-center gap-2">
              <div className="size-12 flex items-center justify-center border-r md:border-x">
                <FolderClosedIcon className="size-5 text-(--app-primary)/80" />
              </div>
              <span className="max-w-64 md:max-w-full truncate font-semibold font-(family-name:--font-geist-mono)">
                {folder.name}
              </span>
            </div>
          </div>

          <div className="border-x">
            <BookmarksList />
          </div>
        </section>
      </main>
    </div>
  )
}
