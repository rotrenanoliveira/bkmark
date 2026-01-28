'use client'

import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { useFormState } from '@/hooks/use-form-state'
import { cn } from '@/lib/utils'
import { actionCreateBookmark } from '@/server/actions/create-bookmark'

interface CreateBookmarkFormProps {
  beforeSubmit?: () => void
  onSuccess?: () => void
}

export function CreateBookmarkForm(props: CreateBookmarkFormProps) {
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
  }

  const [formState, handleSubmit, isPending] = useFormState(actionCreateBookmark, {
    optimisticFn,
    onSuccess,
    onError,
  })

  function onError(message: string) {
    toast.error(message)
  }

  function onSuccess() {
    if (props.onSuccess) {
      return props.onSuccess()
    }

    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="w-full flex flex-col gap-2">
      {formState.success === false && <p className="text-red-500">{formState.message}</p>}
      <div className="flex gap-2">
        <Input type="text" name="url" placeholder="Insert a link" />

        <Button type="submit" disabled={isPending}>
          <PlusIcon strokeWidth={1.25} className={cn('size-5', isPending && 'hidden')} />
          {isPending && <Loader2Icon strokeWidth={1.25} className="size-5 animate-spin" />}
        </Button>
      </div>
    </form>
  )
}
