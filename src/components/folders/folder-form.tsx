'use client'

import { Loader2Icon, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFormState } from '@/hooks/use-form-state'
import { cn } from '@/lib/utils'
import { actionCreateFolder } from '@/server/actions/create-folder'

interface FolderFormProps {
  isOnPage?: boolean
  beforeSubmit?: () => void
  onSuccess?: () => void
}

export function FolderForm(props: FolderFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const [formState, formStateSubmit, isPending] = useFormState(actionCreateFolder, {
    onSuccess,
    onError,
    formRef,
    reset: props.isOnPage !== true,
  })

  // TODO: Remover quando adicionar o context / useOptimistic
  function handleSubmit(form: React.FormEvent<HTMLFormElement>) {
    form.preventDefault()

    props.beforeSubmit?.()
    formStateSubmit(form)
  }

  function onError(message: string) {
    toast.error(message)
  }

  function onSuccess() {
    if (props.onSuccess) {
      return props.onSuccess()
    }

    // TODO: Remover quando adicionar o context / useOptimistic
    if (props.isOnPage) {
      return router.push('/')
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
