import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from './theme-switcher'
import { JetBrains_Mono } from 'next/font/google'

const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'] })

export function Header() {
  return (
    <header className="mx-auto flex items-center justify-between py-4 px-6 w-full max-w-xl h-20 rounded-2xl bg-card-background dark:bg-zinc-800">
      <div className="flex items-center gap-2">
        <Image src="/bkmark.png" alt="" width={32} height={32} />
        <h1 className={cn(jetBrainsMono.className)}>readmarks</h1>
      </div>

      <ThemeSwitcher />
    </header>
  )
}
