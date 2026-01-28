import { Header } from '@/components/header'

export default async function RegistersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <main className="w-full flex flex-col items-center justify-center h-[calc(100svh-72px)] py-6 space-y-4">
        {children}
      </main>
    </div>
  )
}
