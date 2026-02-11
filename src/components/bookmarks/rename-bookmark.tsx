import { PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useCallback, useRef, useState } from 'react'
import { useBounce } from '@/hooks/use-bounce'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { RenameBookmarkForm } from './rename-bookmark-form'

interface RenameBookmarkProps {
  bookmarkId: string
}

export function RenameBookmark({ bookmarkId }: RenameBookmarkProps) {
  const [open, setOpen] = useState(false)
  const { bounce } = useBounce()

  const buttonRef = useRef<HTMLButtonElement>(null)

  function handleClose() {
    setOpen(false)
  }

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
            <DialogTitle className="text-center">Rename a new bookmark</DialogTitle>
            <DialogDescription>Update the title of the bookmark you want to rename.</DialogDescription>
          </DialogHeader>

          <Card>
            <CardHeader className="border-none">
              <CardTitle>Rename bookmark</CardTitle>
              <CardDescription>Insert the new title of the bookmark.</CardDescription>
            </CardHeader>

            <CardContent>
              <RenameBookmarkForm bookmarkId={bookmarkId} beforeSubmit={handleClose} />
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}
