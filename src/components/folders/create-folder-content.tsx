import { XIcon } from 'lucide-react'
import { CreateFolderForm } from '@/components/folders/create-folder-form'

interface AddFolderContentProps {
  onClose?: () => void
}

export function CreateFolderContent({ onClose }: AddFolderContentProps) {
  return (
    <div className="w-full max-w-sm flex flex-col gap-4 relative ring-foreground/10 bg-card text-card-foreground overflow-hidden rounded-xl py-4 text-sm ring-1 group/card">
      <div className="grid auto-rows-min items-start gap-1 border-b rounded-t-xl px-4 [.border-b]:pb-4">
        <div className="text-base leading-snug font-medium">Register a new folder</div>
        <div className="text-muted-foreground text-sm">Enter the name of the folder you want to add.</div>

        {onClose && (
          <button type="button" className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
            <XIcon className="size-5" />
          </button>
        )}
      </div>

      <div className="flex flex-row px-4 ">
        <CreateFolderForm beforeSubmit={onClose} />
      </div>
    </div>
  )
}
