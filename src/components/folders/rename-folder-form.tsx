'use client'

import { floppyDisk } from '@lucide/lab'
import { useQuery } from '@tanstack/react-query'
import { FolderPenIcon, Icon, Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useTransition } from 'react'
import { toast } from 'sonner'
import { useFolders } from '@/hooks/use-folders'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { actionRenameFolder } from '@/server/actions/rename-folder'
import { getFolder } from '@/server/data/get-folder'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface RenameFolderFormProps {
  beforeSubmit?: () => void
  folderId: string
}

export function RenameFolderForm(props: RenameFolderFormProps) {
  const [isPending, startTransition] = useTransition()

  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const { rename } = useFolders()

  const {
    data: folder,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [`folder-${props.folderId}`],
    queryFn: () => getFolder(props.folderId),
  })

  console.log(folder)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    props.beforeSubmit?.()

    startTransition(async () => {
      const formData = new FormData(e.currentTarget)
      const name = formData.get('folder-name')?.toString()

      if (!name) {
        toast.error('Invalid name!')
        return
      }

      rename({ name, folderId: props.folderId })

      formData.append('folder-id', props.folderId)

      const result = await actionRenameFolder(formData)

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      queryClient.invalidateQueries({ queryKey: [`folder-${props.folderId}`] })
      queryClient.invalidateQueries({ queryKey: [`workspace:${folder?.workspaceId}`] })
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
    <form className="flex-1 flex flex-row" onSubmit={handleSubmit}>
      <div className="flex items-center justify-center w-12 border-t border-b border-l">
        <FolderPenIcon className="size-5 text-(--app-primary)/80" />
      </div>

      <Input
        type="text"
        name="folder-name"
        placeholder={isLoading ? 'Loading...' : 'Folder Title'}
        className={cn('flex-1 h-12', isLoading && 'animate-pulse')}
        defaultValue={folder?.name}
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
