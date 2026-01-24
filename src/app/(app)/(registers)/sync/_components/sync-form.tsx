'use client'

import { useRef } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFormState } from '@/hooks/use-form-state'
import { actionSyncUser } from '@/server/actions/sync-user'

interface SyncFormProps {
  onSuccess?: () => void
}

export function SyncForm(props: SyncFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const [formState, handleSubmit, isPending] = useFormState(actionSyncUser, {
    onSuccess,
  })

  function onSuccess() {
    props.onSuccess?.()
  }

  return (
    <div>
      <form onSubmit={handleSubmit} ref={formRef}>
        {formState.success === false && <p className="text-red-500">{formState.message}</p>}
        <div className="flex flex-col gap-3">
          <Input
            type="text"
            name="code"
            placeholder="Enter acess code"
            className="py-6 rounded-lg bg-muted-foreground/5 font-(family-name:--font-geist-mono)"
          />
          <Button type="submit" className="cursor-pointer" disabled={isPending}>
            Sync
          </Button>
        </div>
      </form>
    </div>
  )
}
