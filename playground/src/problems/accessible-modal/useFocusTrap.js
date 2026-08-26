import { useEffect } from 'react'

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Trap Tab focus inside `ref`, restore it on close, and close on Escape.
 *
 * The list of focusable elements is re-queried on every Tab rather than
 * cached, because a dialog's contents can change while it is open.
 */
export function useFocusTrap(ref, isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return undefined

    const previouslyFocused = document.activeElement
    const node = ref.current
    node?.querySelector(FOCUSABLE)?.focus() ?? node?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return }
      if (e.key !== 'Tab') return

      const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (items.length === 0) { e.preventDefault(); return }

      const first = items[0]
      const last = items[items.length - 1]

      // Wrap around at both ends -- this is what makes it a trap.
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      previouslyFocused?.focus?.()   // restore focus to the trigger
    }
  }, [isOpen, onClose, ref])
}
