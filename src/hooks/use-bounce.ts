import { useCallback } from 'react'

export function useBounce() {
  const bounce = useCallback(<T extends HTMLElement | null>(ref: React.RefObject<T>) => {
    if (ref.current) {
      ref.current.style.transition = 'transform 0.2s ease-out'
      ref.current.style.transform = 'scale(0.96)'
      ref.current.classList.add('bg-accent')

      const timer = setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = 'scale(1)'
          ref.current.classList.remove('bg-accent')
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [])

  return { bounce }
}
