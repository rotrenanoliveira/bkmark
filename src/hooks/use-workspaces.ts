import { useContext } from 'react'
import { WorkspaceContext } from '@/contexts/workspaces-context'

export function useWorkspaces() {
  const context = useContext(WorkspaceContext)

  if (!context) {
    throw new Error('useWorkspaces must be used within a WorkspacesProvider')
  }

  return context
}
