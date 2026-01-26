import { CheckIcon, CopyIcon } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { DropdownMenuItem, DropdownMenuShortcut } from '../ui/dropdown-menu'

interface BookmarkCopyProps {
  bookmarkUrl: string
}

export function BookmarkCopy({ bookmarkUrl }: BookmarkCopyProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  const commandTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  // biome-ignore lint/correctness/useExhaustiveDependencies: cause re-render
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // TODO: pensar melhor se "gostei"
      if (e.key === 'Enter') {
        setHasCopied(true)
      }

      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault()
        setHasCopied(true)
        handleCopyBookmark()

        commandTimeoutRef.current = setTimeout(() => setHasCopied(false), 1000)
      }
    }

    document.addEventListener('keydown', down)

    return () => {
      document.removeEventListener('keydown', down)

      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current)
      }
    }
  }, [])

  function handleCopyBookmark() {
    navigator.clipboard.writeText(bookmarkUrl)
  }

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className={cn('w-full relative cursor-pointer', hasCopied && 'bg-accent')}
        onClick={handleCopyBookmark}
      >
        <CopyIcon
          className={cn(
            'absolute inset-2 size-4 transition-all duration-200 ease-out',
            hasCopied ? 'scale-75 opacity-0' : 'scale-100 opacity-100',
          )}
        />
        <CheckIcon
          className={cn(
            'absolute inset-2 size-4 transition-all duration-200 ease-out',
            hasCopied ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
          )}
        />
        <span className="relative left-6">Copy URL</span>
        <DropdownMenuShortcut>⌘+⇧+C</DropdownMenuShortcut>
      </Button>
    </DropdownMenuItem>
  )
}
