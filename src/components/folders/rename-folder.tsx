import { PencilIcon } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useBounce } from '@/hooks/use-bounce'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { RenameFolderForm } from './rename-folder-form'

interface RenameFolderProps {
  folderId: string
}

export function RenameFolderButton({ folderId }: RenameFolderProps) {
  const [open, setOpen] = useState(false)
  const { bounce } = useBounce()

  const buttonRef = useRef<HTMLButtonElement>(null)

  function handleClose() {
    setOpen(false)
  }

  const handleSelect = useCallback(() => {
    bounce(buttonRef)
    setOpen(true)
  }, [bounce])

  useKeyboardShortcut('x', handleSelect, ['Mod'])

  return (
    <>
      <DropdownMenuItem asChild>
        <Button
          variant="ghost"
          className="relative w-full cursor-pointer"
          onSelect={handleSelect}
          onClick={handleSelect}
          ref={buttonRef}
        >
          <PencilIcon className="absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
          <span className="relative left-6">Rename</span>
          <div className="inline-flex gap-1 ml-auto font-(family-name:--font-geist)">
            <kbd className="flex items-center justify-center tracking-widest border rounded size-5">
              <span className="text-lg text-foreground/75">⌘</span>
            </kbd>
            <kbd className="flex items-center justify-center tracking-widest border rounded size-5">
              <span className="text-xs text-foreground/75">X</span>
            </kbd>
          </div>
        </Button>
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden" showCloseButton={false}>
          <DialogHeader className="sr-only">
            <DialogTitle className="text-center">Rename a new folder</DialogTitle>
            <DialogDescription>Update the title of the folder you want to rename.</DialogDescription>
          </DialogHeader>

          <div className="relative flex flex-col w-full gap-4 py-4 overflow-hidden text-sm ring-foreground/10 bg-card text-card-foreground ring-1 group/card">
            <div className="grid auto-rows-min items-start gap-1 border-b rounded-t-xl px-4 [.border-b]:pb-4">
              <div className="text-base font-medium leading-snug">Rename a new folder</div>
              <div className="text-sm text-muted-foreground">Update the title of the folder you want to rename.</div>
            </div>

            <div className="flex flex-row px-4 ">
              <RenameFolderForm folderId={folderId} beforeSubmit={() => handleClose()} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
