import { useEffect, useRef, useState } from 'react'

const format = (ms) => {
  const m = String(Math.floor(ms / 60000)).padStart(2, '0')
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')
  const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, '0')
  return `${m}:${s}.${cs}`
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const startRef = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!running) return undefined
    // Anchor to a timestamp rather than accumulating +16ms per frame:
    // setInterval/rAF are not exact, and accumulating their error makes the
    // clock drift noticeably within a minute.
    startRef.current = performance.now() - elapsed

    const tick = () => {
      setElapsed(performance.now() - startRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const reset = () => { setRunning(false); setElapsed(0); setLaps([]) }
  const lap = () => setLaps((l) => [...l, elapsed])

  return (
    <div className="sw">
      <div className="sw-display" role="timer" aria-live="off">{format(elapsed)}</div>
      <div className="sw-controls">
        <button className="sw-btn sw-primary" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : elapsed ? 'Resume' : 'Start'}
        </button>
        <button className="sw-btn" onClick={lap} disabled={!running}>Lap</button>
        <button className="sw-btn" onClick={reset} disabled={!elapsed}>Reset</button>
      </div>
      {laps.length > 0 && (
        <ol className="sw-laps">
          {laps.map((l, i) => (
            <li key={i}>
              <span>Lap {i + 1}</span>
              <span>{format(l - (laps[i - 1] ?? 0))}</span>
              <span className="sw-total">{format(l)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
