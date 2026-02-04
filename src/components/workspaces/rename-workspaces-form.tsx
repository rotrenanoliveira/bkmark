'use client'

import { useQuery } from '@tanstack/react-query'
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
    <form className="flex flex-col w-full gap-2" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <Input
          type="text"
          name="workspace-name"
          placeholder={isLoading ? 'Loading...' : 'Workspace Name'}
          className={cn(isLoading && 'animate-pulse')}
          defaultValue={data?.name}
          disabled={isLoading}
          ref={inputRef}
        />

        <Button type="submit" disabled={isPending}>
          Rename
        </Button>
      </div>
    </form>
  )
}
