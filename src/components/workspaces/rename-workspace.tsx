import { PencilIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import { useBounce } from '@/hooks/use-bounce'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { RenameWorkspaceForm } from './rename-workspaces-form'

export function RenameWorkspace() {
  const pathname = usePathname()
  const isWorkspacePage = pathname.includes('/workspaces')
  const workspaceId = pathname.split('/')[2]

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
    isWorkspacePage && (
      <>
        <DropdownMenuItem onSelect={handleSelect} asChild>
          <Button variant="ghost" className="w-full cursor-pointer justify-start rounded-none" ref={buttonRef}>
            <PencilIcon className="size-4" />
            <span className="font-light">Rename</span>
          </Button>
        </DropdownMenuItem>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="p-0 overflow-hidden" showCloseButton={false}>
            <DialogHeader className="sr-only">
              <DialogTitle className="text-center">Rename a workspace</DialogTitle>
              <DialogDescription>Update the name of the workspace.</DialogDescription>
            </DialogHeader>

            <div className="relative flex flex-col w-full gap-4 py-4 overflow-hidden text-sm ring-foreground/10 bg-card text-card-foreground ring-1 group/card">
              <div className="grid auto-rows-min items-start gap-1 border-b rounded-t-xl px-4 [.border-b]:pb-4">
                <div className="text-base font-medium leading-snug">Rename a workspace</div>
                <div className="text-sm text-muted-foreground">Insert the new name of the workspace.</div>
              </div>

              <div className="flex flex-row px-4 ">
                <RenameWorkspaceForm workspaceId={workspaceId} beforeSubmit={() => handleClose()} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  )
}
