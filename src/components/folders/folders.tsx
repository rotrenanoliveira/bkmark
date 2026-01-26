import { redirect } from 'next/navigation'
import React from 'react'
import { getUserFolders } from '@/server/data/get-folders'
import { getUserId } from '@/server/data/get-user-id'
import { Folder } from './folder'
import { LoadingFolder } from './loading-folder'

export async function Folders() {
  const userId = await getUserId()

  if (!userId) {
    redirect('/')
  }

  const { folders } = await getUserFolders(userId)

  return (
    <div className="space-y-2">
      {folders.map((folder) => (
        <React.Suspense key={folder.folderId} fallback={<LoadingFolder />}>
          <Folder folder={folder} />
        </React.Suspense>
      ))}
    </div>
  )
}
