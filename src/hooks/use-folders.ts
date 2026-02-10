import { use } from 'react'
import { FolderContext } from '@/contexts/folders-context'

export function useFolders() {
  const context = use(FolderContext)

  if (!context) {
    throw new Error('FoldersProvider must be used within FoldersContext')
  }

  return context
}
