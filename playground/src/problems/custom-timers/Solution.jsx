import { useEffect, useRef, useState } from 'react'
import { customSetInterval, runInIdle } from './timers.js'

export default function Demo() {
  const [ticks, setTicks] = useState(0)
  const [processed, setProcessed] = useState(0)
  const [chunks, setChunks] = useState(0)
  const stopRef = useRef(null)

  useEffect(() => {
    stopRef.current = customSetInterval(() => setTicks((t) => t + 1), 500)
    return () => stopRef.current?.()
  }, [])

  const runIdle = () => {
    setProcessed(0); setChunks(0)
    let lastIndex = 0
    const items = Array.from({ length: 5000 }, (_, i) => i)
    runInIdle(items, () => {
      lastIndex++
      if (lastIndex % 250 === 0) setProcessed(lastIndex)
    }, { onDone: () => { setProcessed(items.length); setChunks((c) => c + 1) } })
  }

  return (
    <div>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        customSetInterval ticks: <b>{ticks}</b>{' '}
        <button type="button" onClick={() => stopRef.current?.()}>stop</button>
      </p>
      <p>
        <button type="button" onClick={runIdle}>Process 5000 items while idle</button>
      </p>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        processed: <b>{processed}</b> / 5000 {chunks > 0 && '· done'}
      </p>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 440 }}>
        The idle worker yields between chunks, so the page stays responsive
        instead of freezing for the whole 5000.
      </p>
    </div>
  )
}
