'use client'

import { useRouter } from 'next/navigation'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

type UseInterceptModalReturn = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  handleClose: () => void
}

export function useInterceptModal(): UseInterceptModalReturn {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  function handleClose() {
    setOpen(false)
    router.back()
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        e.target instanceof HTMLInputElement
      ) {
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        console.log('pressed')
        router.back()
        setOpen(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [router])

  return {
    open,
    setOpen,
    handleClose,
  }
}
