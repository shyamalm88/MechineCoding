import { useMemo, useRef, useState } from 'react'
import { throttle } from './throttle.js'

const WAIT = 1000

export default function ThrottleDemo() {
  const [raw, setRaw] = useState(0)
  const [throttled, setThrottled] = useState(0)

  const bump = useRef(() => setThrottled((n) => n + 1))
  const run = useMemo(() => throttle(() => bump.current(), WAIT), [])

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setRaw((n) => n + 1)
          run()
        }}
      >
        Click repeatedly
      </button>
      <p>Raw clicks: <b>{raw}</b></p>
      <p>Throttled calls: <b>{throttled}</b></p>
      <p style={{ color: '#666', fontSize: 13 }}>
        At most one call per {WAIT}ms — the first fires immediately.
      </p>
    </div>
  )
}
