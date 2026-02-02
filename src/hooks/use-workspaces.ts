import { use } from 'react'
import { WorkspaceContext } from '@/contexts/workspaces-context'

export function useWorkspaces() {
  const context = use(WorkspaceContext)

  if (!context) {
    throw new Error('useWorkspaces must be used within a WorkspacesProvider')
  }

  return context
}
