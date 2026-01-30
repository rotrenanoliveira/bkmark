'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { CreateBookmarkForm } from '@/components/bookmarks/create-bookmark-form'
import { queryClient } from '@/lib/react-query'

export function CreateBookmark({ workspaceId }: { workspaceId: string }) {
  const router = useRouter()

  const onSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [`workspace:${workspaceId}`] })
    router.push(`/workspaces/${workspaceId}`)
  }, [router.push, workspaceId])

  return <CreateBookmarkForm workspaceId={workspaceId} onSuccess={onSuccess} />
}
