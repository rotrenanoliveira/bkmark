import { CreateBookmarkForm } from '../bookmarks/create-bookmark-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

interface CreateBookmarkContentProps {
  onClose?: () => void
}

export function CreateBookmarkContent({ onClose }: CreateBookmarkContentProps) {
  return (
    <>
      <DialogHeader className="sr-only">
        <DialogTitle className="text-center">Register bookmark</DialogTitle>
        <DialogDescription>Enter the URL of the bookmark you want to add.</DialogDescription>
      </DialogHeader>

      <Card className="gap-2">
        <CardHeader className="border-none">
          <CardTitle className="inline-flex items-center gap-1">Register bookmark</CardTitle>
          <CardDescription>Insert the link of the bookmark you want to add.</CardDescription>
        </CardHeader>

        <CardContent>
          <CreateBookmarkForm beforeSubmit={onClose} focus={true} />
        </CardContent>
      </Card>
    </>
  )
}
