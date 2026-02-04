import { useCallback, useEffect } from 'react'

type Modifier = 'Ctrl' | 'Shift' | 'Alt' | 'Meta' | 'Mod'

interface ShortcutOptions {
  preventDefault?: boolean
  validateInput?: boolean
}

const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)

/**
 * A hook that allows you to register keyboard shortcuts in your application.
 *
 * @param key - The key to listen for.
 * @param callback - The callback function to be called when the key is pressed.
 * @param modifiers - An array of modifiers to listen for.
 * @param options - An object containing options for the hook.
 * @param options.preventDefault - Whether to prevent the default browser behavior (e.g., Ctrl+S to save).
 */
const useKeyboardShortcut = (
  key: string,
  callback: (event: KeyboardEvent) => void,
  modifiers: Modifier[] = [],
  options: ShortcutOptions = { preventDefault: true, validateInput: true },
): void => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        (options.validateInput && document.activeElement?.tagName === 'INPUT') ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        event.target instanceof HTMLInputElement
      ) {
        return
      }

      const keyMatch = event.key.toLowerCase() === key.toLowerCase()

      const modifiersMatch = modifiers.every((modifier) => {
        switch (modifier) {
          case 'Mod':
            return isMac ? event.metaKey : event.ctrlKey
          case 'Ctrl':
            return event.ctrlKey
          case 'Shift':
            return event.shiftKey
          case 'Alt':
            return event.altKey
          case 'Meta':
            return event.metaKey
          default:
            return false
        }
      })

      if (keyMatch && modifiersMatch) {
        if (options.preventDefault) {
          event.preventDefault()
        }

        event.preventDefault()
        callback(event)
      }
    },
    [key, callback, modifiers, options],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

export { useKeyboardShortcut }
