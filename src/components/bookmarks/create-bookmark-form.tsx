'use client'

import { Link2Icon, Loader2Icon } from 'lucide-react'
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
    <form ref={formRef} onSubmit={handleSubmit} className="flex-1 flex flex-row">
      <div className="flex items-center justify-center w-12 border-t border-b border-l">
        <Link2Icon className="size-5 text-(--app-primary)/80" />
      </div>

      <Input type="text" name="url" placeholder="Insert a link" className="flex-1 h-12" ref={inputRef} />

      <Button type="submit" className="h-12 w-20" disabled={isPending}>
        {isPending && <Loader2Icon strokeWidth={1.25} className="size-5 animate-spin" />}
        <span className={cn('uppercase font-semibold font-(family-name:--font-geist-mono)', isPending && 'hidden')}>
          create
        </span>
      </Button>
    </form>
  )
}
