import Avatar from 'boring-avatars'
import { JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getUserId } from '@/server/data/get-user-id'
import { ThemeSwitcher } from './theme-switcher'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] })

export async function UserSettingsDropdown() {
  const userId = await getUserId()

  if (!userId) {
    redirect('/api/sync/generate')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar variant="beam" size={32} name={userId} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" sideOffset={8} alignOffset={8}>
        <DropdownMenuLabel className="flex flex-col">
          <span className={cn(jetBrainsMono.className)}>{userId}</span>
          <span className="text-xs text-muted-foreground">Access code</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/sync" className="cursor-pointer">
            Synchronize
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeSwitcher />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
