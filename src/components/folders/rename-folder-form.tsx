'use client'

import { useQuery } from '@tanstack/react-query'
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
    <form className="flex flex-col w-full gap-2" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <Input
          type="text"
          name="folder-name"
          placeholder={isLoading ? 'Loading...' : 'Folder Title'}
          className={cn(isLoading && 'animate-pulse')}
          defaultValue={folder?.name}
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
