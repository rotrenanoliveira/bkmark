import { useQuery } from '@tanstack/react-query'
import { getBookmarks } from '@/server/data/get-bookmarks'
import type { Folder as FolderType } from '@/utils/types'
import { CollapsibleFolder } from './collapsible-folder'

interface FolderProps {
  folder: FolderType
}

export function Folders({ folder }: FolderProps) {
  const { data: bookmarks } = useQuery({
    queryKey: [`folder:${folder.folderId}`, folder.folderId],
    queryFn: () => getBookmarks(folder.userId, folder.folderId),
  })

  return <CollapsibleFolder bookmarks={bookmarks ?? []} folder={folder} />
}
