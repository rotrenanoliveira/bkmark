'use client'

import { Loader2Icon, RefreshCcwIcon } from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFormState } from '@/hooks/use-form-state'
import { cn } from '@/lib/utils'
import { actionSyncUser } from '@/server/actions/sync-user'

interface SyncFormProps {
  onSuccess?: () => void
}

export function SynchronizeForm(props: SyncFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const [_, handleSubmit, isPending] = useFormState(actionSyncUser, {
    onSuccess,
    onError,
  })

  function onSuccess() {
    props.onSuccess?.()
  }

  function onError(message: string) {
    toast.error(message)
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-row border-t" ref={formRef}>
      <div className="flex items-center justify-center w-20 border-r">
        <RefreshCcwIcon className="size-5 text-(--app-primary)/80" />
      </div>

      <Input type="text" name="code" placeholder="Enter access code" className="h-12 border-none" />

      <Button type="submit" className="h-full w-20" disabled={isPending}>
        {isPending && <Loader2Icon strokeWidth={1.25} className="size-5 animate-spin" />}
        <span className={cn('uppercase font-semibold font-(family-name:--font-geist-mono)', isPending && 'hidden')}>
          sync
        </span>
      </Button>
    </form>
  )
}
