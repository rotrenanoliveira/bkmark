import { Delete01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useBounce } from '@/hooks/use-bounce'
import { useWorkspaces } from '@/hooks/use-workspaces'
import { actionRemoveWorkspace } from '@/server/actions/remove-workspace'

export function DeleteWorkspace() {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const router = useRouter()

  const { remove } = useWorkspaces()
  const { bounce } = useBounce()

  const pathname = usePathname()
  const isWorkspacePage = pathname.includes('/workspaces')
  const workspaceId = pathname.split('/')[2]

  function handleClose() {
    setOpen(false)
  }

  const handleSelect = useCallback(
    (e: Event) => {
      e.preventDefault()
      bounce(buttonRef)
      setOpen(true)
    },
    [bounce],
  )

  const handleRemoveFolder = useCallback(async () => {
    startTransition(async () => {
      remove(workspaceId)

      const result = await actionRemoveWorkspace(workspaceId)

      if (result.success === false) {
        toast.error(result.message)
        return
      }

      router.push('/')
    })
  }, [remove, workspaceId, router.push])

  return (
    isWorkspacePage && (
      <>
        <DropdownMenuItem onSelect={handleSelect} asChild>
          <Button variant="ghost" className="justify-start w-full rounded-none cursor-pointer" ref={buttonRef}>
            <HugeiconsIcon icon={Delete01Icon} className="size-4" />
            <span className="font-light">Delete</span>
          </Button>
        </DropdownMenuItem>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the workspace, all the bookmarks and folder associated with it. Are you
                sure?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleRemoveFolder} disabled={isPending}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  )
}
