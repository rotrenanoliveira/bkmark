import { FolderClosedIcon, FolderOpenIcon } from 'lucide-react'
import React from 'react'
import { Bookmark } from '@/components/bookmarks/bookmark'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { Bookmark as BookmarksType, Folder as FolderType } from '@/utils/types'
import { RemoveFolder } from './remove-folder'

interface FolderProps {
  folder: FolderType
  bookmarks: BookmarksType[]
}

export function CollapsibleFolder({ folder, bookmarks }: FolderProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="w-full p-1 pl-3 flex border rounded-xl bg-foreground/5 hover:border-foreground/15 font-(family-name:--font-geist-mono)">
        <CollapsibleTrigger className="flex-1 text-start flex items-center justify-start gap-2 truncate">
          <FolderClosedIcon className={cn('size-6 text-muted-foreground/75', isOpen && 'hidden')} />
          <FolderOpenIcon className={cn('size-6 text-muted-foreground/75', !isOpen && 'hidden')} />
          <span className="w-56 sm:w-[calc(100%-80px)] truncate">{folder.name}</span>
        </CollapsibleTrigger>

        <RemoveFolder folderId={folder.folderId} />
      </div>

      <CollapsibleContent className="mt-2 pl-8 space-y-2">
        {bookmarks.map((bookmark) => (
          <Bookmark key={bookmark.bookmarkId} bookmark={bookmark} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
