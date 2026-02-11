import { Folder01Icon, Folder02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="transition-all duration-200 ease-out">
      <div className="flex w-full border-b last:border-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50">
        <CollapsibleTrigger className="flex items-center justify-start flex-1 gap-2 truncate cursor-pointer text-start">
          <div className="flex items-center justify-center border-r size-12">
            <HugeiconsIcon
              icon={Folder01Icon}
              altIcon={Folder02Icon}
              showAlt={isOpen}
              className={cn('size-6', !isOpen ? 'text-muted-foreground' : 'text-(--app-primary)/75')}
            />
          </div>
          <span className="w-56 sm:w-[calc(100%-80px)] truncate">{folder.name}</span>
        </CollapsibleTrigger>

        <FolderOptions folder={folder} />
      </div>

      <CollapsibleContent className="flex flex-col">
        {bookmarks.map((bookmark) => (
          <div className="flex" key={bookmark.bookmarkId}>
            <div className="border-b border-r size-12" />
            <Bookmark key={bookmark.bookmarkId} bookmark={bookmark} />
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
