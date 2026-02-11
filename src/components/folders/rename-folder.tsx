import { PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useCallback, useRef, useState } from 'react'
import { useBounce } from '@/hooks/use-bounce'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
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

  const handleClose = () => setOpen(false)

  const handleSelect = useCallback(
    (e: Event) => {
      e.preventDefault()
      bounce(buttonRef)
      setOpen(true)
    },
    [bounce],
  )

  useKeyboardShortcut('x', handleSelect, ['Mod'])

  return (
    <>
      <DropdownMenuItem onSelect={handleSelect} asChild>
        <Button variant="ghost" className="relative w-full cursor-pointer" ref={buttonRef}>
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="absolute transition-all duration-200 ease-out scale-100 opacity-100 inset-x-2 inset-y-2 size-5"
          />
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
        <DialogContent className="p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle className="text-center">Rename a new folder</DialogTitle>
            <DialogDescription>Update the title of the folder you want to rename.</DialogDescription>
          </DialogHeader>

          <Card>
            <CardHeader className="border-none">
              <CardTitle>Rename folder</CardTitle>
              <CardDescription>Insert the new title of the folder.</CardDescription>
            </CardHeader>

            <CardContent>
              <RenameFolderForm folderId={folderId} beforeSubmit={handleClose} />
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}
