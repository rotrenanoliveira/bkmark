import { RenameBookmarkContent } from './_components/rename-bookmark-content'

export default async function BookmarkRenamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookmarkId } = await params

  return <RenameBookmarkContent bookmarkId={bookmarkId} />
}
