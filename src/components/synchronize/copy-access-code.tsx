'use client'

import { CheckIcon, CopyIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CopyAccessCodeProps {
  userId: string
}

export function CopyAccessCode({ userId }: CopyAccessCodeProps) {
  const [isCopied, setIsCopied] = useState(false)

  function handleCopy() {
    setIsCopied(true)
    navigator.clipboard.writeText(userId)

    setTimeout(() => setIsCopied(false), 1000)
  }

  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => buttonRef.current?.focus(), 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Button
      variant="ghost"
      onClick={handleCopy}
      className="size-12 relative p-2 cursor-pointer hover:bg-muted-foreground/25 justify-self-end"
      ref={buttonRef}
    >
      <CopyIcon
        className={cn(
          'absolute inset-0 m-auto size-4 transition-all duration-200 ease-out',
          isCopied ? 'scale-75 opacity-0' : 'scale-100 opacity-100',
        )}
      />

      <CheckIcon
        className={cn(
          'absolute inset-0 m-auto size-4 transition-all duration-200 ease-out',
          isCopied ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
        )}
      />
    </Button>
  )
}
