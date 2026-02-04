'use client'

import { useWorkspaces } from '@/hooks/use-workspaces'
import { RemoveWorkspace } from './remove-workspace'
import { RenameWorkspace } from './rename-workspace'

export function WorkspaceList() {
  const { workspaces } = useWorkspaces()

  return (
    <div className="space-y-2">
      {workspaces.map((workspace) => (
        <div key={workspace.workspaceId} className="flex items-center gap-2">
          {workspace.name}

          <RemoveWorkspace workspaceId={workspace.workspaceId} />
          <RenameWorkspace workspaceId={workspace.workspaceId} />
        </div>
      ))}
    </div>
  )
}
