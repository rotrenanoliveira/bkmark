import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useFormState } from '@/hooks/use-form-state'
import { actionRenameBookmark } from '@/server/actions/rename-bookmark'
import type { Bookmark } from '@/utils/types'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useBookmarks } from './bookmarks-context'

interface BookmarkRenameFormProps {
  bookmarkId: string
  onCloseDialog: () => void
}

export function BookmarkRenameForm({ bookmarkId, onCloseDialog }: BookmarkRenameFormProps) {
  const { rename } = useBookmarks()
  const router = useRouter()

  const { data, refetch } = useQuery({
    queryKey: [`bookmark-${bookmarkId}`],
    queryFn: () => fetch(`/api/bookmarks/${bookmarkId}`).then((res) => res.json() as Promise<{ bookmark: Bookmark }>),
  })

  function optimisticFn(formData: FormData) {
    const title = formData.get('title')?.toString()
    const bookmarkId = formData.get('bookmarkId')?.toString()

    if (!title || !bookmarkId) {
      toast.error('Invalid data!')
      return
    }

    onCloseDialog()
    rename({ title, bookmarkId })
  }

  const [formState, handleSubmit, isPending] = useFormState(actionRenameBookmark, {
    onSuccess,
    onError,
    optimisticFn,
  })

  function onError(message: string) {
    toast.error(message)
  }

  function onSuccess() {
    refetch()
    router.refresh()
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      {formState.success === false && <p className="text-red-500">{formState.message}</p>}

      <input type="text" name="bookmarkId" className="hidden" defaultValue={data?.bookmark.bookmarkId} />
      <div className="space-y-2">
        <Label htmlFor="title">Bookmark Title</Label>
        <Input type="text" name="title" placeholder="Bookmark Title" defaultValue={data?.bookmark.title} />
      </div>

      <Button type="submit" disabled={isPending}>
        Rename
      </Button>
    </form>
  )
}
