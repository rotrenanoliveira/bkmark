import { CheckIcon, CopyIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { DropdownMenuItem } from '../ui/dropdown-menu'

interface BookmarkCopyProps {
  bookmarkUrl: string
}

export function BookmarkCopyUrl({ bookmarkUrl }: BookmarkCopyProps) {
  const [hasCopied, setHasCopied] = useState(false)

  const commandTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleCopyBookmark = useCallback(() => navigator.clipboard.writeText(bookmarkUrl), [bookmarkUrl])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        e.target instanceof HTMLInputElement
      ) {
        return
      }
      // TODO: incluir validação para o windows
      // TODO: mudar comando para command + c / ctrl + c
      if (e.metaKey && e.key.toLowerCase() === 'c') {
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
  }, [handleCopyBookmark])

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
