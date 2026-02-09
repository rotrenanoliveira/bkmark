import { PencilIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import { useBounce } from '@/hooks/use-bounce'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
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

            <Card>
              <CardHeader className="border-none">
                <CardTitle>Rename workspace</CardTitle>
                <CardDescription>Insert the new name of the workspace.</CardDescription>
              </CardHeader>

              <CardContent>
                <RenameWorkspaceForm workspaceId={workspaceId} beforeSubmit={() => handleClose()} />
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      </>
    )
  )
}
