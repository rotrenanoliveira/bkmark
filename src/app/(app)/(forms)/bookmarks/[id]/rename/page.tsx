import { RenameBookmarkContent } from '@/components/bookmarks/rename-bookmark-content'

export default async function BookmarkRenamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookmarkId } = await params

  return <RenameBookmarkContent bookmarkId={bookmarkId} />
}
