'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useTransition } from 'react'
import { toast } from 'sonner'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import { actionRenameBookmark } from '@/server/actions/rename-bookmark'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface RenameBookmarkFormProps {
  beforeSubmit?: () => void
  bookmarkId: string
}

export function RenameBookmarkForm(props: RenameBookmarkFormProps) {
  const [isPending, startTransition] = useTransition()

  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const { rename } = useBookmarks()

  const { data, refetch, isLoading } = useQuery({
    queryKey: [`bookmark-${props.bookmarkId}`],
    queryFn: () => fetch(`/api/bookmarks/${props.bookmarkId}`).then((res) => res.json()),
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    props.beforeSubmit?.()

    startTransition(async () => {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('bookmark-title')?.toString()

      if (!title) {
        toast.error('Invalid title!')
        return
      }

      rename({ title, bookmarkId: props.bookmarkId })

      formData.append('bookmark-id', props.bookmarkId)

      const result = await actionRenameBookmark(formData)

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      queryClient.invalidateQueries({ queryKey: [`bookmark-${props.bookmarkId}`] })
      queryClient.invalidateQueries({ queryKey: [`folder:${data?.bookmark.folderId}`] })
      queryClient.invalidateQueries({ queryKey: [`workspace:${data?.bookmark.workspaceId}`] })
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
          name="bookmark-title"
          placeholder={isLoading ? 'Loading...' : 'Bookmark Title'}
          className={cn(isLoading && 'animate-pulse')}
          defaultValue={data?.bookmark.title}
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
