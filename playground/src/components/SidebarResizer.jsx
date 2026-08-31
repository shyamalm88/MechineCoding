import { useCallback, useEffect, useState } from 'react'

const KEY = 'sidebar-width'
export const MIN_WIDTH = 220
export const MAX_WIDTH = 620
const DEFAULT_WIDTH = 280

/** Keep a stored or dragged width inside the usable range. */
export function clampWidth(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return DEFAULT_WIDTH
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(number)))
}

export function useSidebarWidth() {
  const [width, setWidth] = useState(() => {
    try {
      const stored = window.localStorage.getItem(KEY)
      return stored === null ? DEFAULT_WIDTH : clampWidth(stored)
    } catch {
      return DEFAULT_WIDTH
    }
  })

  const persist = useCallback((next) => {
    const value = clampWidth(next)
    setWidth(value)
    try {
      window.localStorage.setItem(KEY, String(value))
    } catch {
      // Private mode: the drag still works for this session.
    }
  }, [])

  return [width, persist]
}

/**
 * Drag handle between the sidebar and the workspace.
 *
 * Listeners go on `window`, not the handle, so the drag survives the pointer
 * outrunning a 6px target -- the usual bug in hand-rolled resizers. It is also
 * a focusable separator driven by the arrow keys, since a mouse-only control
 * locks keyboard users out of a layout choice.
 */
export default function SidebarResizer({ width, onResize }) {
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!dragging) return

    const onMove = (event) => onResize(event.clientX)
    const onUp = () => setDragging(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    // Stop the pointer selecting text across the page mid-drag.
    const previousSelect = document.body.style.userSelect
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      document.body.style.userSelect = previousSelect
      document.body.style.cursor = ''
    }
  }, [dragging, onResize])

  const onKeyDown = (event) => {
    const step = event.shiftKey ? 40 : 10
    if (event.key === 'ArrowLeft') { event.preventDefault(); onResize(width - step) }
    else if (event.key === 'ArrowRight') { event.preventDefault(); onResize(width + step) }
    else if (event.key === 'Home') { event.preventDefault(); onResize(MIN_WIDTH) }
    else if (event.key === 'End') { event.preventDefault(); onResize(MAX_WIDTH) }
  }

  return (
    <div
      className={dragging ? 'sidebar-resizer dragging' : 'sidebar-resizer'}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuenow={width}
      aria-valuemin={MIN_WIDTH}
      aria-valuemax={MAX_WIDTH}
      tabIndex={0}
      onMouseDown={(event) => { event.preventDefault(); setDragging(true) }}
      onDoubleClick={() => onResize(DEFAULT_WIDTH)}
      onKeyDown={onKeyDown}
      title="Drag to resize — double-click to reset"
    />
  )
}
