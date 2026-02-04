import { DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { CreateWorkspaceForm } from './create-workspace-form'

interface CreateWorkspaceContentProps {
  onClose?: () => void
}

export function CreateWorkspaceContent({ onClose }: CreateWorkspaceContentProps) {
  // TODO: transformar "isso" em um componente ui/card
  return (
    <>
      <DialogHeader className="sr-only">
        <DialogTitle className="text-center">Register a new workspace</DialogTitle>
        <DialogDescription>Enter the name of the workspace you want to add.</DialogDescription>
      </DialogHeader>

      <div className="w-full flex flex-col gap-4 relative ring-foreground/10 bg-card text-card-foreground overflow-hidden py-4 text-sm ring-1 group/card">
        <div className="grid auto-rows-min items-start gap-1 border-b rounded-t-xl px-4 [.border-b]:pb-4">
          <div className="text-base leading-snug font-medium">Register a new workspace</div>
          <div className="text-muted-foreground text-sm">Insert the name of the workspace you want to add.</div>
        </div>

        <div className="flex flex-row px-4">
          <CreateWorkspaceForm beforeSubmit={onClose} focus={true} />
        </div>
      </div>
    </>
  )
}
