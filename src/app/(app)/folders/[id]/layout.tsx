import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getUserBookmarks } from '@/server/data/get-bookmarks'
import { getFolder } from '@/server/data/get-folder'
import { getUserId } from '@/server/data/get-user-id'
import { LoadingFolderPage } from './_components/loading-folder-page'
import WorkspacesProviders from './providers'

export default async function FoldersLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id: folderId } = await params

  const folder = await getFolder(folderId)
  if (!folder) notFound()

  const userId = await getUserId()
  const bookmarks = getUserBookmarks({ userId, folderId })

  return (
    <Suspense fallback={<LoadingFolderPage />}>
      <WorkspacesProviders bookmarksPromise={bookmarks}>{children}</WorkspacesProviders>
    </Suspense>
  )
}
