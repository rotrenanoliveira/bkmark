'use client'

import { useFolders } from '@/hooks/use-folders'
import { Folders } from './folders'

export function FoldersList() {
  const { folders } = useFolders()

  return (
    <div className="border-x">
      {folders.map((folder) => (
        <Folders key={folder.folderId} folder={folder} />
      ))}
    </div>
  )
}
