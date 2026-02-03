'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { useFormState } from '@/hooks/use-form-state'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { actionRenameBookmark } from '@/server/actions/rename-bookmark'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface RenameBookmarkFormProps {
  bookmarkId: string
  beforeSubmit?: () => void
}

export function RenameBookmarkForm(props: RenameBookmarkFormProps) {
  const router = useRouter()

  const { rename } = useBookmarks()

  const inputRef = useRef<HTMLInputElement>(null)

  const { data, refetch, isLoading } = useQuery({
    queryKey: [`bookmark-${props.bookmarkId}`],
    queryFn: () => fetch(`/api/bookmarks/${props.bookmarkId}`).then((res) => res.json()),
  })

  function optimisticFn(formData: FormData) {
    const title = formData.get('bookmark-title')?.toString()
    const bookmarkId = formData.get('bookmark-id')?.toString()

    if (!title || !bookmarkId) {
      toast.error('Invalid data!')
      return
    }

    rename({ title, bookmarkId })

    props.beforeSubmit?.()
  }

  const [_, handleSubmit, isPending] = useFormState(actionRenameBookmark, {
    optimisticFn,
    onSuccess,
    onError,
  })

  function onError(message: string) {
    toast.error(message)
  }

  function onSuccess() {
    refetch()

    console.log(data)

    queryClient.invalidateQueries({ queryKey: [`bookmark-${props.bookmarkId}`] })
    queryClient.invalidateQueries({ queryKey: [`folder:${data?.bookmark.folderId}`] })
    queryClient.invalidateQueries({ queryKey: [`workspace:${data?.bookmark.workspaceId}`] })

    router.refresh()
  }

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <form className="flex flex-col w-full gap-2" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <input type="text" name="bookmark-id" className="hidden" defaultValue={props.bookmarkId} />
        <Input
          type="text"
          name="bookmark-title"
          placeholder="Bookmark Title"
          className={cn(isLoading && 'animate-pulse')}
          defaultValue={data?.bookmark.title}
          disabled={isLoading}
          ref={inputRef}
          autoFocus
        />

        <Button type="submit" disabled={isPending}>
          Rename
        </Button>
      </div>
    </form>
  )
}
