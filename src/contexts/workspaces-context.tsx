import { createContext, use, useCallback, useMemo, useOptimistic } from 'react'
import { generateNanoId } from '@/lib/nanoid'
import type { Workspace } from '@/utils/types'

type WorkspaceAction =
  | { type: 'ADD'; payload: { name: string } }
  | { type: 'RENAME'; payload: { workspaceId: string; name: string } }
  | { type: 'REMOVE'; payload: { workspaceId: string } }

type WorkspaceContextType = {
  workspaces: Workspace[]
  create: (name: string) => void
  remove: (id: string) => void
  rename: ({ workspaceId, name }: { workspaceId: string; name: string }) => void
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

function workspaceReducer(state: Workspace[], action: WorkspaceAction): Workspace[] {
  switch (action.type) {
    case 'ADD':
      return [
        ...state,
        {
          workspaceId: generateNanoId(),
          userId: generateNanoId(),
          name: action.payload.name,
        },
      ]
    case 'RENAME':
      return state.map((workspace) =>
        workspace.workspaceId === action.payload.workspaceId ? { ...workspace, name: action.payload.name } : workspace,
      )
    case 'REMOVE':
      return state.filter((workspace) => workspace.workspaceId !== action.payload.workspaceId)
    default:
      return state
  }
}

export function WorkspacesProvider({
  children,
  workspacesPromise,
}: {
  children: React.ReactNode
  workspacesPromise: Promise<Workspace[]>
}) {
  const initialWorkspaces = use(workspacesPromise)
  const [optimisticWorkspaces, setOptimisticWorkspaces] = useOptimistic(initialWorkspaces, workspaceReducer)

  const create = useCallback(
    (name: string) => setOptimisticWorkspaces({ type: 'ADD', payload: { name } }),
    [setOptimisticWorkspaces],
  )

  const rename = useCallback(
    ({ workspaceId, name }: { workspaceId: string; name: string }) =>
      setOptimisticWorkspaces({ type: 'RENAME', payload: { workspaceId, name } }),
    [setOptimisticWorkspaces],
  )

  const remove = useCallback(
    (workspaceId: string) => setOptimisticWorkspaces({ type: 'REMOVE', payload: { workspaceId } }),
    [setOptimisticWorkspaces],
  )

  const value = useMemo(
    () => ({ workspaces: optimisticWorkspaces, create, rename, remove }),
    [optimisticWorkspaces, create, rename, remove],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
