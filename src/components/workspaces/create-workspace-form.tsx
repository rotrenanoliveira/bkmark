'use client'

import { floppyDisk } from '@lucide/lab'
import { Icon, Layers2Icon, Loader2Icon } from 'lucide-react'
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
    <form onSubmit={handleSubmit} ref={formRef} className="flex-1 flex flex-row">
      <div className="flex items-center justify-center w-12 border-t border-b border-l">
        <Layers2Icon className="size-5 text-(--app-primary)/80" />
      </div>
      <Input type="text" name="workspace" placeholder="enter workspace name" className="flex-1 h-12" ref={inputRef} />

      <Button type="submit" className="h-full w-12 md:w-20" disabled={isPending}>
        {isPending && <Loader2Icon strokeWidth={1.25} className="size-5 animate-spin" />}
        <span
          className={cn(
            'hidden md:inline uppercase font-semibold font-(family-name:--font-geist-mono)',
            isPending && 'hidden',
          )}
        >
          create
        </span>
        <Icon iconNode={floppyDisk} className={cn('size-5 md:hidden', isPending && 'hidden')} strokeWidth={1.5} />
      </Button>
    </form>
  )
}
