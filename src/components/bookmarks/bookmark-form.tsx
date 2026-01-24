'use client'

import { Loader2Icon, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { toast } from 'sonner'
import { useBookmarks } from '@/components/bookmarks/bookmarks-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFormState } from '@/hooks/use-form-state'
import { cn } from '@/lib/utils'
import { actionAddBookmark } from '@/server/actions/add-bookmark'

interface BookmarkFormProps {
  isOnPage?: boolean
  beforeSubmit?: () => void
  onSuccess?: () => void
}

export function BookmarkForm(props: BookmarkFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const { create } = useBookmarks()

  function optimisticFn(formData: FormData) {
    props.beforeSubmit?.()

    const url = formData.get('url')?.toString()

    if (!url) {
      toast.error('Invalid URL!')
      return
    }

    const match = url.match(/^(?:https?:\/\/)?([^?#]+).*$/)
    const title = match ? match[1] : url

    create({ title, bookmarkUrl: url })

    if (props.isOnPage) {
      return router.push('/')
    }

    formRef.current?.reset()
  }

  const [formState, handleSubmit, isPending] = useFormState(actionAddBookmark, {
    onSuccess,
    onError,
    optimisticFn,
  })

  function onError(message: string) {
    toast.error(message)
  }

  function onSuccess() {
    if (props.onSuccess) {
      return props.onSuccess()
    }

    router.refresh()
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col gap-2">
        {formState.success === false && <p className="text-red-500">{formState.message}</p>}
        <div className="flex gap-2">
          <Input type="text" name="url" placeholder="Enter URL" />
          {/* <Button type="submit" disabled={isPending}> */}
          <Button type="submit">
            <Plus strokeWidth={1.25} className={cn('size-5', isPending && 'hidden')} />
            {isPending && <Loader2Icon strokeWidth={1.25} className="size-5 animate-spin" />}
            {/* <Plus strokeWidth={1.25} className="size-5" /> */}
          </Button>
        </div>
      </form>
    </div>
  )
}
