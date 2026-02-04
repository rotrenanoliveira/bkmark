import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getUserBookmarks } from '@/server/data/get-bookmarks'
import { getUserFolders } from '@/server/data/get-folders'
import { getUserId } from '@/server/data/get-user-id'
import { getWorkspace } from '@/server/data/get-workspace'
import { LoadingWorkspacePage } from './_components/loading-workspace-page'
import WorkspacesProviders from './providers'

export default async function WorkspacesLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id: workspaceId } = await params

  const workspace = await getWorkspace(workspaceId)
  if (!workspace) notFound()

  const userId = await getUserId()

  const bookmarks = getUserBookmarks({ userId, workspaceId })
  const folders = getUserFolders({ userId, workspaceId })

  return (
    <Suspense fallback={<LoadingWorkspacePage />}>
      <WorkspacesProviders bookmarksPromise={bookmarks} foldersPromise={folders}>
        {children}
      </WorkspacesProviders>
    </Suspense>
  )
}
