'use client'

import { Loader2Icon, PlusIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBookmarks } from '@/hooks/use-bookmarks'
import { cn } from '@/lib/utils'
import { actionCreateBookmark } from '@/server/actions/create-bookmark'

interface CreateBookmarkFormProps {
  beforeSubmit?: () => void
  focus?: boolean
}

export function CreateBookmarkForm(props: CreateBookmarkFormProps) {
  const [isPending, startTransition] = useTransition()

  const currentPath = usePathname()
  const router = useRouter()

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { create } = useBookmarks()

  function getFormData(form: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(form.currentTarget)

    const isOnFolder = currentPath.includes('folders')
    const isOnWorkspace = currentPath.includes('workspaces')

    if (isOnFolder) {
      const folderId = currentPath.split('/')[2]
      formData.append('folder', folderId)

      return formData
    }

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
      const url = new FormData(e.currentTarget).get('url')?.toString()

      if (!url) {
        toast.error('Invalid URL!')
        return
      }

      const match = url.match(/^(?:https?:\/\/)?([^?#]+).*$/)
      const title = match ? match[1] : url

      create({ title, bookmarkUrl: url })

      const formData = getFormData(e)
      formRef.current?.reset()

      const result = await actionCreateBookmark(formData)

      if (result.success === false) {
        toast.error(result.message)
        return
      }

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
    <form ref={formRef} onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
      <div className="flex gap-2">
        <Input type="text" name="url" placeholder="Insert a link" ref={inputRef} />

        <Button type="submit" disabled={isPending}>
          <PlusIcon strokeWidth={1.25} className={cn('size-5', isPending && 'hidden')} />
          {isPending && <Loader2Icon strokeWidth={1.25} className="size-5 animate-spin" />}
        </Button>
      </div>
    </form>
  )
}
