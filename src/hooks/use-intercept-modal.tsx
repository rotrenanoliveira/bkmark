'use client'

import { useRouter } from 'next/navigation'
import { type Dispatch, type SetStateAction, useCallback, useState } from 'react'
import { useKeyboardShortcut } from './use-keyboard-shortcuts'

type UseInterceptModalReturn = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  handleClose: () => void
}

export function useInterceptModal(): UseInterceptModalReturn {
  const [open, setOpen] = useState(true)
  const router = useRouter()

  const handleClose = useCallback(() => {
    setOpen(false)
    router.back()
  }, [router.back])

  useKeyboardShortcut('Escape', handleClose, [])

  return { open, setOpen, handleClose }
}
