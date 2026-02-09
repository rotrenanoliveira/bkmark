import { CreateBookmarkForm } from '@/components/bookmarks/create-bookmark-form'
import { Header } from '@/components/layout/header/header'
import { Skeleton } from '@/components/ui/skeleton'
import { random } from '@/utils/functions'

export function LoadingFolderPage() {
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <Header />
      <main className="w-full flex flex-col items-center p-4">
        <section className="w-full max-w-4xl grid grid-cols-1">
          <CreateBookmarkForm />

          <div className="mt-4 border-x">
            {Array.from({ length: random(5) }).map((_, i) => (
              <Skeleton
                key={i.toString().concat(Date.now().toString())}
                className="w-full h-12 border-b rounded-none bg-accent/25 first:border-t"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
