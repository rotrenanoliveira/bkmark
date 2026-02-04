import { CheckIcon, CopyIcon } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { DropdownMenuItem } from '../ui/dropdown-menu'

interface BookmarkCopyProps {
  bookmarkUrl: string
}

export function BookmarkCopyUrl({ bookmarkUrl }: BookmarkCopyProps) {
  const [hasCopied, setHasCopied] = useState(false)

  const commandTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleCopyBookmark = useCallback(() => {
    setHasCopied(true)

    if (commandTimeoutRef.current) {
      clearTimeout(commandTimeoutRef.current)
    }

    commandTimeoutRef.current = setTimeout(() => setHasCopied(false), 1000)
    navigator.clipboard.writeText(bookmarkUrl)
  }, [bookmarkUrl])

  useKeyboardShortcut('c', handleCopyBookmark, ['Mod'])

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className={cn('w-full relative cursor-pointer', hasCopied && 'bg-accent')}
        onClick={handleCopyBookmark}
      >
        <CopyIcon
          className={cn(
            'absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out',
            hasCopied ? 'scale-75 opacity-0' : 'scale-100 opacity-100',
          )}
        />
        <CheckIcon
          className={cn(
            'absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out',
            hasCopied ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
        />
        <span className="relative left-6">Copy URL</span>
        <div className="inline-flex gap-1 ml-auto font-(family-name:--font-geist)">
          <kbd className="tracking-widest rounded border size-5 flex items-center justify-center">
            <span className="text-lg text-foreground/75">⌘</span>
          </kbd>
          <kbd className="tracking-widest rounded border size-5 flex items-center justify-center">
            <span className="text-xs text-foreground/75">C</span>
          </kbd>
        </div>
      </Button>
    </DropdownMenuItem>
  )
}
