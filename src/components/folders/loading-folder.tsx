'use client'

import { FolderClosedIcon } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'

export function LoadingFolder() {
  return (
    <div className="w-full p-3 pl-3 flex items-center gap-2 border rounded-xl bg-foreground/5 hover:border-foreground/15 font-(family-name:--font-geist-mono)">
      <FolderClosedIcon className="size-6 text-muted-foreground/75" />
      <Skeleton className="w-36 h-5 bg-muted-foreground/25 " />
    </div>
  )
}
