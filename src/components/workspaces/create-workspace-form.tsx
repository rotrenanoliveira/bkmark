'use client'

import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWorkspaces } from '@/hooks/use-workspaces'
import { cn } from '@/lib/utils'
import { actionCreateWorkspace } from '@/server/actions/create-workspace'

interface CreateWorkspaceFormProps {
  beforeSubmit?: () => void
  focus?: boolean
}

export function CreateWorkspaceForm(props: CreateWorkspaceFormProps) {
  const [isPending, startTransition] = useTransition()

  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const router = useRouter()

  const { create } = useWorkspaces()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    props.beforeSubmit?.()

    startTransition(async () => {
      const formData = new FormData(e.currentTarget)
      const name = formData.get('workspace')?.toString()

      if (!name) {
        toast.error('Invalid workspace name!')
        return
      }

      create(name)

      formRef.current?.reset()

      const result = await actionCreateWorkspace(formData)

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      toast.success('Workspace created successfully.')
      router.refresh()
    })
  }

  useEffect(() => {
    if (props.focus) {
      const timer = setTimeout(() => inputRef.current?.focus(), 0)
      return () => clearTimeout(timer)
    }
  }, [props.focus])

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="w-full">
      <div className="flex flex-row gap-2">
        <Input type="text" name="workspace" placeholder="enter workspace name" ref={inputRef} />

        <Button type="submit" disabled={isPending}>
          <PlusIcon strokeWidth={1.25} className={cn('size-5', isPending && 'hidden')} />
          {isPending && <Loader2Icon strokeWidth={1.25} className="size-5 animate-spin" />}
        </Button>
      </div>
    </form>
  )
}
