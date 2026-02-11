'use client'

import { floppyDisk } from '@lucide/lab'
import { useQuery } from '@tanstack/react-query'
import { Icon, Layers2Icon, Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useTransition } from 'react'
import { toast } from 'sonner'
import { useWorkspaces } from '@/hooks/use-workspaces'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { actionRenameWorkspace } from '@/server/actions/rename-workspace'
import { getWorkspace } from '@/server/data/get-workspace'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface RenameWorkspaceFormProps {
  beforeSubmit?: () => void
  workspaceId: string
}

export function RenameWorkspaceForm(props: RenameWorkspaceFormProps) {
  const [isPending, startTransition] = useTransition()

  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const { rename } = useWorkspaces()

  const { data, refetch, isLoading } = useQuery({
    queryKey: [`workspace-${props.workspaceId}`],
    queryFn: () => getWorkspace(props.workspaceId),
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    props.beforeSubmit?.()

    startTransition(async () => {
      const formData = new FormData(e.currentTarget)
      const name = formData.get('workspace-name')?.toString()

      if (!name) {
        toast.error('Invalid title!')
        return
      }

      rename({ workspaceId: props.workspaceId, name })

      formData.append('workspace-id', props.workspaceId)

      const result = await actionRenameWorkspace(formData)

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      queryClient.invalidateQueries({ queryKey: [`workspace-${props.workspaceId}`] })
      refetch()

      router.refresh()
    })
  }

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => inputRef.current?.focus(), 0)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-row">
      <div className="flex items-center justify-center w-16 border-t border-b border-l">
        <Layers2Icon className="size-5 text-(--app-primary)/80" />
      </div>

      <Input
        type="text"
        name="workspace-name"
        placeholder={isLoading ? 'Loading...' : 'Workspace Name'}
        className={cn('h-12', isLoading && 'animate-pulse')}
        defaultValue={data?.name}
        disabled={isLoading}
        ref={inputRef}
      />

      <Button type="submit" className="h-full w-12 md:w-20" disabled={isPending}>
        {isPending && <Loader2Icon strokeWidth={1.25} className="size-5 animate-spin" />}
        <span
          className={cn(
            'hidden md:inline uppercase font-semibold font-(family-name:--font-geist-mono)',
            isPending && 'hidden',
          )}
        >
          rename
        </span>
        <Icon iconNode={floppyDisk} className={cn('size-5 md:hidden', isPending && 'hidden')} strokeWidth={1.5} />
      </Button>
    </form>
  )
}
