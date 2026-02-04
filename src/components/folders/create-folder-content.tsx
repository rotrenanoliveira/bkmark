import { CreateFolderForm } from '@/components/folders/create-folder-form'
import { DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

interface AddFolderContentProps {
  onClose?: () => void
}

export function CreateFolderContent({ onClose }: AddFolderContentProps) {
  return (
    <>
      <DialogHeader className="sr-only">
        <DialogTitle className="text-center">Register a new folder</DialogTitle>
        <DialogDescription>Enter the name of the folder you want to add.</DialogDescription>
      </DialogHeader>

      <div className="w-full flex flex-col gap-4 relative ring-foreground/10 bg-card text-card-foreground overflow-hidden py-4 text-sm ring-1 group/card">
        <div className="grid auto-rows-min items-start gap-1 border-b rounded-t-xl px-4 [.border-b]:pb-4">
          <div className="text-base leading-snug font-medium">Register a new folder</div>
          <div className="text-muted-foreground text-sm">Enter the name of the folder you want to add.</div>
        </div>

        <div className="flex flex-row px-4 ">
          <CreateFolderForm beforeSubmit={onClose} focus={true} />
        </div>
      </div>
    </>
  )
}
