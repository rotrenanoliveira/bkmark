import { FolderClosedIcon, FolderOpenIcon } from 'lucide-react'
import React from 'react'
import { Bookmark } from '@/components/bookmarks/bookmark'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import type { Bookmark as BookmarksType, Folder as FolderType } from '@/utils/types'
import { FolderOptions } from './folder-options'

interface FolderProps {
  folder: FolderType
  bookmarks: BookmarksType[]
}

export function CollapsibleFolder({ folder, bookmarks }: FolderProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="transition-all duration-200 ease-out only:border-t">
      <div className="w-full flex border-b last-border-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
        <CollapsibleTrigger className="flex-1 flex items-center justify-start gap-2 text-start cursor-pointer truncate">
          <div className="flex items-center justify-center size-12 border-r">
            <FolderClosedIcon className={cn('size-6 text-muted-foreground', isOpen && 'hidden')} strokeWidth={1.5} />
            <FolderOpenIcon className={cn('size-6 text-(--app-primary)/75', !isOpen && 'hidden')} strokeWidth={1.5} />
          </div>
          <span className="w-56 sm:w-[calc(100%-80px)] truncate">{folder.name}</span>
        </CollapsibleTrigger>

        <FolderOptions folder={folder} />
      </div>

      <CollapsibleContent className="flex flex-col">
        {bookmarks.map((bookmark) => (
          <div className="flex" key={bookmark.bookmarkId}>
            <div className="size-12 border-r border-b" />
            <Bookmark key={bookmark.bookmarkId} bookmark={bookmark} />
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
