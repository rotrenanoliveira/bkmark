import { JetBrains_Mono } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

import { UserSettingsDropdown } from './user-settings-dropdown'

const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] })

export function Header() {
  return (
    <div className="p-4 border-b border-dashed border-zinc-200 dark:border-zinc-700">
      <header className="mx-auto flex items-center justify-between max-w-screen-2xl">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image src="/bkmark.png" alt="" width={32} height={32} />
          </Link>
          <h1 className={cn(jetBrainsMono.className)}>bkmark</h1>
        </div>

        <div className="inline-flex items-center justify-center gap-4">
          <UserSettingsDropdown />
        </div>
      </header>
    </div>
  )
}
