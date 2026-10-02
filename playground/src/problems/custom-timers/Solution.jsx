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
    const total = 200
    let done = 0
    const tasks = Array.from({ length: total }, () => function task() {
      const end = performance.now() + 0.5 // ~0.5ms of work per task
      while (performance.now() < end) { /* busy */ }
      done++
      setProcessed(done)
      if (done === total) setChunks((c) => c + 1)
    })
    runInIdle(tasks)
  }

  return (
    <div>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        customSetInterval ticks: <b>{ticks}</b>{' '}
        <button type="button" onClick={() => stopRef.current?.()}>stop</button>
      </p>
      <p>
        <button type="button" onClick={runIdle}>Run 200 tasks while idle</button>
      </p>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        processed: <b>{processed}</b> / 200 {chunks > 0 && '· done'}
      </p>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 440 }}>
        runInIdle keeps running tasks only while the browser reports idle time,
        then schedules the rest for the next idle period.
      </p>
    </div>
  )
}
