import { useEffect, useRef, useState } from 'react'
import { installTimeoutTracking, clearAllTimeout, pendingCount } from './clearAllTimeout.js'

installTimeoutTracking()

export default function Demo() {
  const [fired, setFired] = useState([])
  const [pending, setPending] = useState(0)
  const tick = useRef(0)

  useEffect(() => {
    const i = setInterval(() => setPending(pendingCount()), 100)
    return () => clearInterval(i)
  }, [])

  const schedule = () => {
    for (let n = 1; n <= 4; n++) {
      const label = `t${++tick.current}`
      setTimeout(() => setFired((f) => [...f, label]), n * 900)
    }
    setPending(pendingCount())
  }

  return (
    <div>
      <button type="button" onClick={schedule}>Schedule 4 timeouts</button>{' '}
      <button type="button" onClick={() => { const n = clearAllTimeout(); setFired((f) => [...f, `— cleared ${n} —`]); setPending(0) }}>
        clearAllTimeout()
      </button>
      <p>Pending: <b>{pending}</b></p>
      <ul style={{ fontFamily: 'monospace', fontSize: 13 }}>
        {fired.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
      <p style={{ color: '#666', fontSize: 13 }}>
        Schedule, then clear before they fire — nothing after the marker appears.
      </p>
    </div>
  )
}
