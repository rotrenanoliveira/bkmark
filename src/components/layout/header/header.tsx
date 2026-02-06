import Image from 'next/image'
import Link from 'next/link'
import { CommandMenu } from '@/components/command-menu'
import { UserSettingsDropdown } from './user-settings-dropdown'
import { WorkspacesDropdown } from './workspaces-dropdown'

export function Header() {
  return (
    <div className="p-4 border-b border-dashed border-zinc-200 dark:border-zinc-700">
      <header className="flex items-center justify-between mx-auto max-w-screen-2xl">
        <div className="flex items-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/bkmark.png" alt="" width={32} height={32} />
            <h1 className="font-(family-name:--font-geist-mono)">bkmark</h1>
          </Link>

          <div className="w-px h-9 bg-muted-foreground/50" />

          <WorkspacesDropdown />
        </div>

        <div className="inline-flex items-center justify-center gap-4">
          <CommandMenu />
          <UserSettingsDropdown />
        </div>
      </header>
    </div>
  )
}
