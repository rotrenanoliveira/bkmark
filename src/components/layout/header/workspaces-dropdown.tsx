'use client'

import { ArrowRightIcon, ChevronsUpDownIcon, Layers2Icon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { CreateWorkspace } from '@/components/workspaces/create-workspace'
import { RenameWorkspace } from '@/components/workspaces/rename-workspace'
import { useWorkspaces } from '@/hooks/use-workspaces'
import { cn } from '@/lib/utils'
import { Button } from '../../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { DeleteWorkspace } from '../../workspaces/delete-workspace'

export function WorkspacesDropdown() {
  const { workspaces } = useWorkspaces()

  return (
    <DropdownMenu>
      <WorkspaceDropdownMenuTrigger />
      <DropdownMenuContent className="space-y-1" alignOffset={0}>
        {workspaces.map((workspace) => (
          <DropdownMenuItem key={workspace.workspaceId} asChild>
            <Button variant="ghost" className="w-full cursor-pointer justify-start rounded-none" asChild>
              <Link href={`/workspaces/${workspace.workspaceId}`} className="flex items-center gap-2">
                <ArrowRightIcon className="size-4" />
                <span>{workspace.name}</span>
              </Link>
            </Button>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />

        <CreateWorkspace />
        <RenameWorkspace />
        <DeleteWorkspace />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function WorkspaceDropdownMenuTrigger() {
  const pathname = usePathname()
  const { workspaces } = useWorkspaces()

  const currentWorkspace = useMemo(() => {
    const workspaceId = pathname.includes('/workspaces') ? pathname.split('/')[2] : null
    const workspace = workspaces.find((workspace) => workspace.workspaceId === workspaceId)

    return workspace
  }, [pathname, workspaces])

  return (
    <DropdownMenuTrigger className="inline-flex items-center gap-2 p-2 cursor-pointer border border-dashed border-transparent rounded-xs hover:border-ring">
      <Layers2Icon strokeWidth={1.25} className={cn('size-5', currentWorkspace && 'text-(--app-primary)')} />

      {!currentWorkspace && <span className="uppercase">workspaces</span>}
      {currentWorkspace && <span className="uppercase text-(--app-primary)">{currentWorkspace.name}</span>}

      <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
    </DropdownMenuTrigger>
  )
}
