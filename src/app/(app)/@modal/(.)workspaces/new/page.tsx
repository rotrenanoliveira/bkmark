'use client'

import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InterceptDialog } from '@/components/ui/intercept-dialog'
import { CreateWorkspaceContent } from '@/components/workspaces/create-workspace-content'
import { useInterceptModal } from '@/hooks/use-intercept-modal'

export default function CreateWorkspaceInterceptDialog() {
  const { open, setOpen, handleClose } = useInterceptModal()

  return (
    <InterceptDialog open={open} setOpen={setOpen}>
      <DialogHeader className="sr-only">
        <DialogTitle className="text-center">Register a new workspace</DialogTitle>
        <DialogDescription>Enter the name of the workspace you want to add.</DialogDescription>
      </DialogHeader>

      <CreateWorkspaceContent onClose={handleClose} />
    </InterceptDialog>
  )
}
