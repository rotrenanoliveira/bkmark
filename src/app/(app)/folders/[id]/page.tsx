import { Folder01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Layers2Icon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { BookmarksList } from '@/components/bookmarks/bookmarks-list'
import { CreateBookmarkForm } from '@/components/bookmarks/create-bookmark-form'
import { Header } from '@/components/layout/header/header'
import { cn } from '@/lib/utils'
import { getFolder } from '@/server/data/get-folder'
import { getWorkspace } from '@/server/data/get-workspace'

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: folderId } = await params
  const folder = await getFolder(folderId)
  if (!folder) notFound()

  const workspace = folder.workspaceId ? await getWorkspace(folder.workspaceId) : null

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />
      <main className="flex flex-col items-center p-4">
        <section className="grid w-full max-w-4xl grid-cols-1">
          <CreateBookmarkForm />

          <div className="flex flex-col mt-4 border md:flex-row md:items-center md:gap-2">
            {workspace && (
              <div className="items-center hidden w-full gap-2 border-b md:w-fit md:inline-flex md:border-none">
                <div className="flex items-center justify-center border-r size-12">
                  <Layers2Icon className="size-5 text-muted-foreground" />
                </div>
                <span className="max-w-64 md:max-w-full truncate font-semibold font-(family-name:--font-geist-mono)">
                  {workspace?.name}
                </span>
              </div>
            )}

            <div className="inline-flex items-center w-full gap-2">
              <div
                className={cn(
                  'flex items-center justify-center border-r size-12',
                  workspace ? 'md:border-x' : 'md:border-r',
                )}
              >
                <HugeiconsIcon icon={Folder01Icon} className="size-5 text-(--app-primary)/80" />
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
