import { CreateFolderForm } from '@/components/folders/create-folder-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

interface AddFolderContentProps {
  onClose?: () => void
}

export function CreateFolderContent({ onClose }: AddFolderContentProps) {
  return (
    <>
      <DialogHeader className="sr-only">
        <DialogTitle className="text-center">Register folder</DialogTitle>
        <DialogDescription>Enter the name of the folder you want to add.</DialogDescription>
      </DialogHeader>

      <Card className="gap-2">
        <CardHeader className="border-none">
          <CardTitle className="inline-flex items-center gap-1">Register folder</CardTitle>
          <CardDescription>Insert the name of the folder you want to add.</CardDescription>
        </CardHeader>

        <CardContent>
          <CreateFolderForm beforeSubmit={onClose} focus={true} />
        </CardContent>
      </Card>
    </>
  )
}
