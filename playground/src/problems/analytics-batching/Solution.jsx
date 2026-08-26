import { useRef, useState } from 'react'
import { Analytics } from './Analytics.js'

export default function Demo() {
  const [sent, setSent] = useState([])
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  if (!ref.current) {
    ref.current = new Analytics({
      maxSize: 3,
      maxWaitMs: 2000,
      send: (batch, reason) =>
        setSent((s) => [...s, `[${reason}] ${batch.length} events: ${batch.join(', ')}`]),
    })
  }

  return (
    <div>
      <button type="button" onClick={() => { ref.current.track(`e${count + 1}`); setCount((c) => c + 1) }}>
        Track event
      </button>{' '}
      <button type="button" onClick={() => ref.current.flush()}>Flush now</button>
      <p style={{ color: '#666', fontSize: 13 }}>
        Flushes at 3 events, or 2s after the first event in a batch.
      </p>
      <ul style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8 }}>
        {sent.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  )
}
