'use client'

import { useWorkspaces } from '@/hooks/use-workspaces'

export function WorkspaceList() {
  const { workspaces } = useWorkspaces()

  return (
    <div className="space-y-2">
      {workspaces.map((workspace) => (
        <div key={workspace.workspaceId} className="flex items-center gap-2">
          {workspace.name}
        </div>
      ))}
    </div>
  )
}
