'use client'

import { useFolders } from '@/hooks/use-folders'
import { Folders } from './folders'

export function FoldersList() {
  const { folders } = useFolders()

  return (
    <div className="space-y-2">
      {folders.map((folder) => (
        <Folders key={folder.folderId} folder={folder} />
      ))}
    </div>
  )
}
