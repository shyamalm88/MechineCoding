import { useMemo, useRef, useState } from 'react'
import { debounce } from './debounce.js'

const DELAY_MS = 500

export default function DebounceDemo() {
  const [rawCount, setRawCount] = useState(0)
  const [debouncedCount, setDebouncedCount] = useState(0)

  // useRef + useMemo so the debounced wrapper survives re-renders. Recreating
  // it every render would reset its pending timer, and nothing would ever be
  // debounced.
  const bumpRef = useRef(() => setDebouncedCount((count) => count + 1))
  const bumpDebounced = useMemo(() => debounce(() => bumpRef.current(), DELAY_MS), [])

  const handleClick = () => {
    setRawCount((count) => count + 1)
    bumpDebounced()
  }

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Click me fast
      </button>
      <p>
        Raw clicks: <b>{rawCount}</b>
      </p>
      <p>
        Debounced calls: <b>{debouncedCount}</b>
      </p>
      <p style={{ color: '#8b95a9', fontSize: 13 }}>
        The debounced counter fires once, {DELAY_MS}ms after you stop clicking.
      </p>
    </div>
  )
}
