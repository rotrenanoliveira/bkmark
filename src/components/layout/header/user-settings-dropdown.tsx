import Avatar from 'boring-avatars'
import { JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getUserId } from '@/server/data/get-user-id'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { ThemeSwitcher } from './theme-switcher'

const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] })

export async function UserSettingsDropdown() {
  const userId = await getUserId()

  if (!userId) {
    redirect('/api/sync/generate')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar variant="beam" size={32} name={userId} square />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" sideOffset={8} alignOffset={8}>
        <DropdownMenuLabel className="flex flex-col">
          <span className={cn(jetBrainsMono.className)}>{userId}</span>
          <span className="text-xs text-muted-foreground">Access code</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/sync" className="cursor-pointer rounded-none">
            Synchronize
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeSwitcher />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
