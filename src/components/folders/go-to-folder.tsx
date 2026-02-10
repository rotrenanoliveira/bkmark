import { ArrowRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { useBounce } from '@/hooks/use-bounce'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { Button } from '../ui/button'
import { DropdownMenuItem } from '../ui/dropdown-menu'

interface GoToFolderButtonProps {
  folderId: string
}

export function GoToFolderButton({ folderId }: GoToFolderButtonProps) {
  const { bounce } = useBounce()
  const router = useRouter()

  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleSelect = useCallback(() => {
    bounce(buttonRef)
    router.push(`/folders/${folderId}`)
  }, [bounce, folderId, router.push])

  useKeyboardShortcut('ArrowRight', handleSelect, ['Mod'])

  return (
    <DropdownMenuItem asChild>
      <Button
        variant="ghost"
        className="relative w-full cursor-pointer transition-transform"
        onSelect={handleSelect}
        onClick={handleSelect}
        ref={buttonRef}
      >
        <ArrowRightIcon className="absolute inset-x-2 inset-y-2.5 size-4 transition-all duration-200 ease-out scale-100 opacity-100" />
        <span className="relative left-6">Go to</span>

        <div className="inline-flex gap-1 ml-auto font-(family-name:--font-geist)">
          <kbd className="flex items-center justify-center tracking-widest border rounded size-5">
            <span className="text-lg text-foreground/75">⌘</span>
          </kbd>
          <kbd className="flex items-center justify-center tracking-widest border rounded size-5">
            <span className="text-lg text-foreground/75">{'\u2192'}</span>
          </kbd>
        </div>
      </Button>
    </DropdownMenuItem>
  )
}
