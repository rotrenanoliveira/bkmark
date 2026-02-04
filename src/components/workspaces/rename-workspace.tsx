import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { RenameWorkspaceForm } from './rename-workspaces-form'

interface RenameWorkspaceProps {
  workspaceId: string
}

export function RenameWorkspace({ workspaceId }: RenameWorkspaceProps) {
  const [open, setOpen] = useState(false)

  function handleClose() {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="flex items-center justify-center shadow-none bg-transparent rounded-lg size-10"
        >
          <PencilIcon className="size-5" strokeWidth={1.25} />
        </Button>
      </DialogTrigger>

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
  )
}
