'use client'

import { MoonIcon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeSwitcher() {
  const { setTheme } = useTheme()

  return (
    <>
      <button
        type="button"
        className="w-full px-2 py-1.5 inline-flex justify-between rounded-sm dark:hidden hover:bg-muted"
        onClick={() => setTheme('dark')}
      >
        <span className="text-sm">Theme</span>
        <MoonIcon className="size-5" strokeWidth={1.25} />
      </button>

      <button
        type="button"
        className="w-full px-2 py-1.5 justify-between hidden rounded-sm dark:inline-flex hover:bg-muted"
        onClick={() => setTheme('light')}
      >
        <span className="text-sm">Theme</span>
        <Sun className="size-5" strokeWidth={1.25} />
      </button>
    </>
  )
}
