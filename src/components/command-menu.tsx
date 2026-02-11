'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowRightIcon, GlobeIcon, PlusIcon, RefreshCwIcon, SearchIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcuts'
import { searchItems } from '@/server/data/search-items'
import { CreateBookmarkContent } from './bookmarks/create-bookmark-content'
import { CreateFolderContent } from './folders/create-folder-content'
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
import { CreateWorkspaceContent } from './workspaces/create-workspace-content'

export type Content = 'command-menu' | 'bookmark-form' | 'folder-form' | 'workspace-form'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState<Content>('command-menu')

  const handleClose = useCallback(() => {
    const timer = setTimeout(() => setContent('command-menu'), 100)
    setOpen(false)
    return () => clearTimeout(timer)
  }, [])

  useKeyboardShortcut('/', () => setOpen((open) => !open), [])
  useKeyboardShortcut('Escape', handleClose, [], { preventDefault: false })

  useEffect(() => {
    if (open === false) {
      setContent('command-menu')
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="inline-flex items-center justify-start gap-2 w-fit md:w-48">
          <SearchIcon className="size-4 text-muted-foreground" />
          <div className="items-center justify-center hidden gap-1 text-sm md:inline-flex text-foreground/75">
            <span>Type </span>
            <kbd className="bg-muted rounded text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              /
            </kbd>
            <span>to search</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 overflow-hidden" setContent={setContent}>
        {content === 'command-menu' && <CommandMenuContent setOpen={setOpen} setContent={setContent} />}
        {content === 'bookmark-form' && <CreateBookmarkContent onClose={handleClose} />}
        {content === 'folder-form' && <CreateFolderContent onClose={handleClose} />}
        {content === 'workspace-form' && <CreateWorkspaceContent onClose={handleClose} />}
      </DialogContent>
    </Dialog>
  )
}

interface CommandMenuContentProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setContent: React.Dispatch<React.SetStateAction<Content>>
}

export function CommandMenuContent({ setOpen, setContent }: CommandMenuContentProps) {
  const router = useRouter()

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen],
  )

  const [searchValue, setSearchValue] = useState<string | null>(null)

  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const queryItems = useQuery({
    queryKey: ['search-items', searchValue],
    queryFn: () => searchItems(searchValue),
  })

  const handleSearchChange = useCallback((value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchValue(value.length > 0 ? value : null)
    }, 200)
  }, [])

  const isLoading = queryItems.isLoading
  const isError = queryItems.isError
  const isEmpty =
    queryItems.data?.bookmarks.length === 0 &&
    queryItems.data?.folders.length === 0 &&
    queryItems.data?.workspaces.length === 0

  return (
    <>
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
        <CommandInput
          isLoading={isLoading}
          placeholder="Find..."
          value={searchValue ?? ''}
          onValueChange={setSearchValue}
        />

        <CommandList>
          {isLoading && <CommandEmpty>Searching...</CommandEmpty>}
          {isError && <CommandEmpty>Error fetching results.</CommandEmpty>}
          {!isLoading && !isError && isEmpty && <CommandEmpty>No results found.</CommandEmpty>}

          <CommandGroup heading="Bookmarks">
            {queryItems.data?.bookmarks &&
              queryItems.data.bookmarks.length > 0 &&
              queryItems.data.bookmarks.map((bookmark) => (
                <CommandItem
                  key={bookmark.id}
                  value={`${bookmark.title} ${bookmark.url} ${bookmark.id}`}
                  onSelect={() => runCommand(() => window.open(bookmark.url, '_blank', 'noopener, noreferrer'))}
                >
                  {bookmark.favicon ? (
                    <Image src={bookmark.favicon} alt={bookmark.title} width={24} height={24} className="size-6" />
                  ) : (
                    <GlobeIcon strokeWidth={1.25} className="size-6 text-muted-foreground" />
                  )}
                  <p className="font-semibold truncate flex-1">{bookmark.title}</p>
                  <span className="hidden md:inline w-1/3 truncate font-light text-muted-foreground/75">
                    {bookmark.url}
                  </span>
                </CommandItem>
              ))}

            <CommandItem onSelect={() => setContent('bookmark-form')}>
              <PlusIcon className="size-4" />
              <span>Create new bookmark...</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Folders">
            {queryItems.data?.folders &&
              queryItems.data.folders.length > 0 &&
              queryItems.data.folders.map((folder) => (
                <CommandItem
                  key={folder.id}
                  value={`${folder.name} ${folder.id}`}
                  onSelect={() => runCommand(() => router.push(`/folders/${folder.id}`))}
                >
                  <ArrowRightIcon className="size-6 text-foreground" />
                  <span>Go to</span>
                  <p className="font-semibold truncate flex-1">{folder.name}</p>
                  <p className="font-light truncate">{folder.parent}</p>
                </CommandItem>
              ))}

            <CommandItem onSelect={() => setContent('folder-form')}>
              <PlusIcon className="size-4" />
              <span>Create new folder...</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Workspaces">
            {queryItems.data?.workspaces &&
              queryItems.data.workspaces.length > 0 &&
              queryItems.data.workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  value={`${workspace.name} ${workspace.id}`}
                  onSelect={() => runCommand(() => router.push(`/workspaces/${workspace.id}`))}
                >
                  <ArrowRightIcon className="size-6 text-foreground" />
                  <span>Go to</span>
                  <p className="font-semibold truncate flex-1">{workspace.name}</p>
                </CommandItem>
              ))}

            <CommandItem onSelect={() => setContent('workspace-form')}>
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

          <CommandGroup>
            <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
              <Image src="/bkmark.png" alt="" width={24} height={24} />
              <span>Home - bkmark</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </>
  )
}
