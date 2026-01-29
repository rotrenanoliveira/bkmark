'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { CreateBookmarkForm } from '@/components/bookmarks/create-bookmark-form'
import { queryClient } from '@/lib/react-query'

export function CreateBookmark({ folderId }: { folderId: string }) {
  const router = useRouter()

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [`folder:${folderId}`] })
    router.push(`/folders/${folderId}`)
  }, [router.push, folderId])

  return <CreateBookmarkForm folderId={folderId} onSuccess={onSuccess} />
}
