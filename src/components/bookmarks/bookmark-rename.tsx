'use client'

import { PencilIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { BookmarkRenameForm } from './bookmark-rename-form'

interface BookmarkRenameProps {
  bookmarkId: string
}

export function BookmarkRename({ bookmarkId }: BookmarkRenameProps) {
  const [isOpen, setIsOpen] = useState(false)

  function handleClose() {
    setIsOpen(false)
  }

  return (
    <DropdownMenuItem asChild>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-full text-left rounded-sm px-2 py-1.5 text-sm hover:bg-accent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PencilIcon strokeWidth={1.25} className="size-4" />
            <span className="text-sm">Rename</span>
          </div>
          {/* <DropdownMenuShortcut>⌘+E</DropdownMenuShortcut> */}
        </DialogTrigger>
        <DialogContent className="max-w-72 font-[family-name:var(--font-geist-sans)]">
          <DialogTitle className="sr-only">rename bookmark form</DialogTitle>
          {/* rename bookmark form */}
          <React.Suspense>
            <BookmarkRenameForm bookmarkId={bookmarkId} onCloseDialog={handleClose} />
          </React.Suspense>
        </DialogContent>
      </Dialog>
    </DropdownMenuItem>
  )
}
