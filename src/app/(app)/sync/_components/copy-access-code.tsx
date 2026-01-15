'use client'

import { CopyIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CopyAccessCodeProps {
  userId: string
}

export function CopyAccessCode({ userId }: CopyAccessCodeProps) {
  function handleCopy() {
    navigator.clipboard.writeText(userId)
  }

  return (
    <Button variant="ghost" className="p-2 h-fit cursor-pointer hover:bg-muted-foreground/25" onClick={handleCopy}>
      <CopyIcon className="size-4" />
    </Button>
  )
}
