'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useFormState } from '@/hooks/use-form-state'
import { actionRenameBookmark } from '@/server/actions/rename-bookmark'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useBookmarks } from './bookmarks-context'

interface BookmarkRenameFormProps {
  bookmarkId: string
  beforeSubmit?: () => void
}

export function BookmarkRenameForm(props: BookmarkRenameFormProps) {
  const router = useRouter()

  const { rename } = useBookmarks()

  const { data } = useQuery({
    queryKey: [`bookmark-${props.bookmarkId}`],
    queryFn: () => fetch(`/api/bookmarks/${props.bookmarkId}`).then((res) => res.json()),
  })

  function optimisticFn(formData: FormData) {
    const title = formData.get('title')?.toString()
    const bookmarkId = formData.get('bookmark-id')?.toString()

    if (!title || !bookmarkId) {
      toast.error('Invalid data!')
      return
    }

    props.beforeSubmit?.()

    rename({ title, bookmarkId })
  }

  const [formState, handleSubmit, isPending] = useFormState(actionRenameBookmark, {
    optimisticFn,
    onSuccess,
    onError,
  })

  function onError(message: string) {
    toast.error(message)
  }

  function onSuccess() {
    router.push('/')
  }

  return (
    <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
      {formState.success === false && <p className="text-red-500">{formState.message}</p>}

      <div className="flex gap-2">
        <input type="text" name="bookmark-id" className="hidden" defaultValue={props.bookmarkId} />
        <Input type="text" name="title" placeholder="Bookmark Title" defaultValue={data?.bookmark.title} />

        <Button type="submit" disabled={isPending}>
          Rename
        </Button>
      </div>
    </form>
  )
}
