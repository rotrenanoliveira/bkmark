import { PlusIcon } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useBounce } from '@/hooks/use-bounce'
import { Button } from '../ui/button'
import { Dialog, DialogContent } from '../ui/dialog'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { CreateWorkspaceContent } from './create-workspace-content'

export function CreateWorkspace() {
  const [open, setOpen] = useState(false)
  const { bounce } = useBounce()

  const buttonRef = useRef<HTMLButtonElement>(null)

  function handleClose() {
    setOpen(false)
  }

  const handleSelect = useCallback(
    (e: Event) => {
      e.preventDefault()
      bounce(buttonRef)
      setOpen(true)
    },
    [bounce],
  )

  return (
    <>
      <DropdownMenuItem onSelect={handleSelect} asChild>
        <Button variant="ghost" className="w-full cursor-pointer justify-start rounded-none" ref={buttonRef}>
          <PlusIcon className="size-4" />
          <span className="font-light">New workspace</span>
        </Button>
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden">
          <CreateWorkspaceContent onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  )
}
