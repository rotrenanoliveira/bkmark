'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowRightIcon, GlobeIcon, PlusIcon, RefreshCwIcon, SearchIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { searchBookmarks } from '@/server/data/search-bookmarks'
import { searchFolders } from '@/server/data/search-folders'
import { searchWorkspaces } from '@/server/data/search-workspaces'
import { Button } from './ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command'
import { DialogContent } from './ui/command-menu-dialog'
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  const [searchValue, setSearchValue] = React.useState<string | null>(null)

  const queryBookmarks = useQuery({
    queryKey: ['search-bookmarks', searchValue],
    queryFn: () => searchBookmarks(searchValue),
  })

  const queryFolders = useQuery({
    queryKey: ['search-folders', searchValue],
    queryFn: () => searchFolders(searchValue),
  })

  const queryWorkspaces = useQuery({
    queryKey: ['search-workspaces', searchValue],
    queryFn: () => searchWorkspaces(searchValue),
  })

  const searchTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  const handleSearchChange = React.useCallback((value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchValue(value.length > 0 ? value : null)
    }, 200)
  }, [])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        e.target instanceof HTMLInputElement
      ) {
        return
      }

      if (e.key === '/') {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const isLoading = queryBookmarks.isLoading || queryFolders.isLoading || queryWorkspaces.isLoading
  const isError = queryBookmarks.isError || queryFolders.isError || queryWorkspaces.isError
  const isEmpty =
    queryBookmarks.data?.length === 0 && queryFolders.data?.length === 0 && queryWorkspaces.data?.length === 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="inline-flex items-center justify-start gap-2 w-fit md:w-48">
          <SearchIcon className="size-4 text-muted-foreground" />
          <div className="items-center justify-center hidden gap-1 text-sm md:inline-flex text-foreground/75">
            <span>Type </span>
            <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              /
            </kbd>
            <span>to search</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search bookmarks...</DialogTitle>
          <DialogDescription>Search for a bookmark or save a new one.</DialogDescription>
        </DialogHeader>

        <Command
          className="**:[[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 **:[[cmdk-input]]:h-12 **:[[cmdk-item]]:px-2 **:[[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
          filter={(value, search, keywords) => {
            handleSearchChange(search)
            const extendValue = value + ' ' + (keywords?.join(' ') || '')

            if (extendValue.toLowerCase().includes(search.toLowerCase())) {
              return 1
            }

            return 0
          }}
        >
          <CommandInput placeholder="Find..." value={searchValue ?? ''} onValueChange={setSearchValue} />

          <CommandList>
            {isLoading && <CommandEmpty>Searching...</CommandEmpty>}
            {isError && <CommandEmpty>Error fetching results.</CommandEmpty>}
            {!isLoading && !isError && isEmpty && <CommandEmpty>No results found.</CommandEmpty>}

            <CommandGroup heading="Bookmarks">
              {queryBookmarks.data &&
                queryBookmarks.data.length > 0 &&
                queryBookmarks.data.map((bookmark) => (
                  <CommandItem
                    key={bookmark.id}
                    value={`${bookmark.title} ${bookmark.url}`}
                    onSelect={() => runCommand(() => window.open(bookmark.url, '_blank', 'noopener, noreferrer'))}
                  >
                    {bookmark.favicon ? (
                      <Image src={bookmark.favicon} alt={bookmark.title} width={24} height={24} />
                    ) : (
                      <GlobeIcon strokeWidth={1.25} className="size-6 text-muted-foreground" />
                    )}
                    <p className="font-semibold truncate flex-1">{bookmark.title}</p>
                    <span className="hidden md:inline w-1/3 truncate font-light text-muted-foreground/75">
                      {bookmark.url}
                    </span>
                  </CommandItem>
                ))}

              <CommandItem onSelect={() => runCommand(() => router.push('/bookmarks/new'))}>
                <PlusIcon className="size-4" />
                <span>Create new bookmark...</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Folders">
              {queryFolders.data &&
                queryFolders.data.length > 0 &&
                queryFolders.data.map((folder) => (
                  <CommandItem
                    key={folder.id}
                    value={folder.name}
                    onSelect={() => runCommand(() => router.push(`/folders/${folder.id}`))}
                  >
                    <ArrowRightIcon className="size-6 text-foreground" />
                    <span>Go to</span>
                    <p className="font-semibold truncate flex-1">{folder.name}</p>
                  </CommandItem>
                ))}

              <CommandItem onSelect={() => runCommand(() => router.push('/folders/new'))}>
                <PlusIcon className="size-4" />
                <span>Create new folder...</span>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Workspaces">
              {queryWorkspaces.data &&
                queryWorkspaces.data.length > 0 &&
                queryWorkspaces.data.map((workspace) => (
                  <CommandItem
                    key={workspace.id}
                    value={workspace.name}
                    onSelect={() => runCommand(() => router.push(`/workspaces/${workspace.id}`))}
                  >
                    <ArrowRightIcon className="size-6 text-foreground" />
                    <span>Go to</span>
                    <p className="font-semibold truncate flex-1">{workspace.name}</p>
                  </CommandItem>
                ))}

              <CommandItem onSelect={() => runCommand(() => router.push('/workspaces/new'))}>
                <PlusIcon className="size-4" />
                <span>Create new workspace...</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator className="mb-2" />

            <CommandGroup>
              <CommandItem onSelect={() => runCommand(() => router.push('/sync'))}>
                <RefreshCwIcon className="size-4" />
                <span>Synchronize bookmarks</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
