import { BookmarksList } from '@/components/bookmarks/bookmarks-list'
import { CreateBookmarkForm } from '@/components/bookmarks/create-bookmark-form'
import { CreateFolderForm } from '@/components/folders/create-folder-form'
import { FoldersList } from '@/components/folders/folders-list'
import { Header } from '@/components/header'
import { CreateWorkspaceForm } from '@/components/workspaces/create-workspace-form'
import { WorkspaceList } from '@/components/workspaces/workspace-list'

export default async function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <main className="w-full flex flex-col items-center p-6 space-y-4">
        <section className="w-full max-w-4xl grid grid-cols-1 gap-4">
          <CreateBookmarkForm />
          <CreateFolderForm />
          <CreateWorkspaceForm />

          <WorkspaceList />
          <BookmarksList />
          <FoldersList />
        </section>
      </main>
    </div>
  )
}
