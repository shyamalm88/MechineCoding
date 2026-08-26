import { useRef, useState } from 'react'
import { CircuitBreaker } from './CircuitBreaker.js'

export default function Demo() {
  const [log, setLog] = useState([])
  const [healthy, setHealthy] = useState(false)
  const healthyRef = useRef(false)
  healthyRef.current = healthy
  const cbRef = useRef(null)

  if (!cbRef.current) {
    cbRef.current = new CircuitBreaker(
      async () => {
        await new Promise((r) => setTimeout(r, 60))
        if (!healthyRef.current) throw new Error('service down')
        return 'ok'
      },
      { failureThreshold: 3, resetTimeout: 2500 },
    )
  }

  const attempt = async () => {
    const cb = cbRef.current
    const before = cb.state
    try {
      const r = await cb.call()
      setLog((l) => [...l, `${before} → request succeeded (${r}) · now ${cb.state}`])
    } catch (e) {
      setLog((l) => [...l, `${before} → ${e.message} · now ${cb.state}`])
    }
  }

  return (
    <div>
      <p>
        <button type="button" onClick={attempt}>Call service</button>{' '}
        <label style={{ fontSize: 13, marginLeft: 8 }}>
          <input type="checkbox" checked={healthy} onChange={(e) => setHealthy(e.target.checked)} />{' '}
          service healthy
        </label>
      </p>
      <p style={{ fontSize: 13, color: '#666', maxWidth: 460 }}>
        Click 3 times while unhealthy → circuit OPENs and fails fast without
        calling. Wait ~2.5s, tick “healthy”, click again → HALF_OPEN trial
        succeeds and it closes.
      </p>
      <ol style={{ fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.8 }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ol>
    </div>
  )
}
