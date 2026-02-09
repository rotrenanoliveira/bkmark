import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { CreateWorkspaceForm } from './create-workspace-form'

interface CreateWorkspaceContentProps {
  onClose?: () => void
}

export function CreateWorkspaceContent({ onClose }: CreateWorkspaceContentProps) {
  return (
    <>
      <DialogHeader className="sr-only">
        <DialogTitle className="text-center">Register workspace</DialogTitle>
        <DialogDescription>Enter the name of the workspace you want to add.</DialogDescription>
      </DialogHeader>

      <Card className="gap-2">
        <CardHeader className="border-none">
          <CardTitle className="inline-flex items-center gap-1">Register workspace</CardTitle>
          <CardDescription>Insert the name of the workspace you want to add.</CardDescription>
        </CardHeader>

        <CardContent>
          <CreateWorkspaceForm beforeSubmit={onClose} focus={true} />
        </CardContent>
      </Card>
    </>
  )
}
