import { createContext, use, useCallback, useMemo, useOptimistic } from 'react'
import { generateNanoId } from '@/lib/nanoid'
import type { Folder } from '@/utils/types'

type FolderAction =
  | { type: 'ADD'; payload: { name: string } }
  | { type: 'REMOVE'; payload: { folderId: string } }
  | { type: 'RENAME'; payload: { folderId: string; name: string } }

type FolderContextType = {
  folders: Folder[]
  create: (name: string) => void
  remove: (id: string) => void
  rename: ({ folderId, name }: { folderId: string; name: string }) => void
}

export const FolderContext = createContext<FolderContextType | undefined>(undefined)

function folderReducer(state: Folder[], action: FolderAction): Folder[] {
  switch (action.type) {
    case 'ADD':
      return [
        ...state,
        {
          folderId: generateNanoId(),
          userId: generateNanoId(),
          name: action.payload.name,
        },
      ]
    case 'RENAME':
      return state.map((folder) =>
        folder.folderId === action.payload.folderId ? { ...folder, name: action.payload.name } : folder,
      )
    case 'REMOVE':
      return state.filter((folder) => folder.folderId !== action.payload.folderId)
    default:
      return state
  }
}

export function FoldersProvider({
  children,
  foldersPromise,
}: {
  children: React.ReactNode
  foldersPromise: Promise<Folder[]>
}) {
  const initialFolders = use(foldersPromise)
  const [optimisticFolders, setOptimisticFolders] = useOptimistic(initialFolders, folderReducer)

  const create = useCallback(
    (name: string) => setOptimisticFolders({ type: 'ADD', payload: { name } }),
    [setOptimisticFolders],
  )

  const rename = useCallback(
    ({ folderId, name }: { folderId: string; name: string }) =>
      setOptimisticFolders({ type: 'RENAME', payload: { folderId, name } }),
    [setOptimisticFolders],
  )

  const remove = useCallback(
    (folderId: string) => setOptimisticFolders({ type: 'REMOVE', payload: { folderId } }),
    [setOptimisticFolders],
  )

  const value = useMemo(
    () => ({ folders: optimisticFolders, create, rename, remove }),
    [optimisticFolders, create, rename, remove],
  )

  return <FolderContext.Provider value={value}>{children}</FolderContext.Provider>
}
