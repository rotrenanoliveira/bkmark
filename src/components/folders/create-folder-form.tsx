'use client'

import { FolderPlusIcon, Loader2Icon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFolders } from '@/hooks/use-folders'
import { cn } from '@/lib/utils'
import { actionCreateFolder } from '@/server/actions/create-folder'

interface CreateFolderFormProps {
  beforeSubmit?: () => void
  focus?: boolean
}

export function CreateFolderForm(props: CreateFolderFormProps) {
  const [isPending, startTransition] = useTransition()

  const currentPath = usePathname()
  const router = useRouter()

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { create } = useFolders()

  function getFormData(form: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(form.currentTarget)

    const isOnWorkspace = currentPath.includes('workspaces')

    if (isOnWorkspace) {
      const workspaceId = currentPath.split('/')[2]
      formData.append('workspace', workspaceId)

      return formData
    }

    return formData
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    props.beforeSubmit?.()

    startTransition(async () => {
      const name = new FormData(e.currentTarget).get('folder')?.toString()

      if (!name) {
        toast.error('Invalid folder name!')
        return
      }

      create(name)

      const formData = getFormData(e)
      formRef.current?.reset()

      const result = await actionCreateFolder(formData)

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      toast.success('Folder created successfully.')

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
        <FolderPlusIcon className="size-5 text-(--app-primary)/80" />
      </div>

      <Input type="text" name="folder" placeholder="enter folder name" className="flex-1 h-12" ref={inputRef} />

      <Button type="submit" className="h-full w-20" disabled={isPending}>
        {isPending && <Loader2Icon strokeWidth={1.25} className="size-5 animate-spin" />}
        <span className={cn('uppercase font-semibold font-(family-name:--font-geist-mono)', isPending && 'hidden')}>
          create
        </span>
      </Button>
    </form>
  )
}
