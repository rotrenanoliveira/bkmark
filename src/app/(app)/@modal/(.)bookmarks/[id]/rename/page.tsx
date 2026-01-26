import { RenameBookmarkDialogContent } from './_components/rename-bookmark-dialog-content'

export default async function BookmarkRenamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: bookmarkId } = await params

  return <RenameBookmarkDialogContent bookmarkId={bookmarkId} />
}
