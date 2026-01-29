'use client'

import { CreateFolderContent } from '@/components/folders/create-folder-content'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InterceptDialog } from '@/components/ui/intercept-dialog'
import { useInterceptModal } from '@/hooks/use-intercept-modal'

export default function CreateFolderInterceptDialog() {
  const { open, setOpen, handleClose } = useInterceptModal()

  return (
    <InterceptDialog open={open} setOpen={setOpen}>
      <DialogHeader className="sr-only">
        <DialogTitle className="text-center">Register a new folder</DialogTitle>
        <DialogDescription>Enter the name of the folder you want to add.</DialogDescription>
      </DialogHeader>

      <CreateFolderContent onClose={handleClose} />
    </InterceptDialog>
  )
}
