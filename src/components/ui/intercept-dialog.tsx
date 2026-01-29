import type { Dispatch, SetStateAction } from 'react'
import { Dialog, DialogContent } from './dialog'

interface InterceptDialogProps {
  children: React.ReactNode
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
}

export function InterceptDialog({ open, setOpen, children }: InterceptDialogProps) {
  return (
    <Dialog defaultOpen open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-full md:w-96 font-(family-name:--font-geist-sans) p-0 rounded-xl"
        showCloseButton={false}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}
