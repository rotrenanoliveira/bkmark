'use client'

import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFolders } from '@/hooks/use-folders'
import { useFormState } from '@/hooks/use-form-state'
import { cn } from '@/lib/utils'
import { actionCreateFolder } from '@/server/actions/create-folder'

interface CreateFolderFormProps {
  beforeSubmit?: () => void
  onSuccess?: () => void
}

export function CreateFolderForm(props: CreateFolderFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const { create } = useFolders()

  function optimisticFn(formData: FormData) {
    props.beforeSubmit?.()

    const name = formData.get('folder')?.toString()

    if (!name) {
      toast.error('Invalid folder name!')
      return
    }

    create(name)
  }

  const [formState, handleSubmit, isPending] = useFormState(actionCreateFolder, {
    optimisticFn,
    onSuccess,
    onError,
    formRef,
    reset: true,
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
    <form onSubmit={handleSubmit} ref={formRef} className="w-full">
      {formState.success === false && <p className="text-red-500">{formState.message}</p>}
      <div className="flex flex-row gap-2">
        <Input type="text" name="folder" placeholder="enter folder name" />

        <Button type="submit" disabled={isPending}>
          <PlusIcon strokeWidth={1.25} className={cn('size-5', isPending && 'hidden')} />
          {isPending && <Loader2Icon strokeWidth={1.25} className="size-5 animate-spin" />}
        </Button>
      </div>
    </form>
  )
}
