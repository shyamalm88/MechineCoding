import { useRef, useState } from 'react'
import { batchDispatcher } from './batchDispatcher.js'

export default function Demo() {
  const [log, setLog] = useState([])
  const dispatcher = useRef(null)
  const n = useRef(0)

  if (!dispatcher.current) {
    dispatcher.current = batchDispatcher({
      batchSize: 5,
      batchDelay: 1500,
      dispatchFn: (events) =>
        setLog((l) => [...l, `▶ ONE request with ${events.length} event(s): ${events.join(', ')}`]),
    })
  }

  const track = () => dispatcher.current.enqueue(`e${++n.current}`)

  return (
    <div>
      <button type="button" onClick={track}>Track event</button>{' '}
      <button type="button" onClick={() => dispatcher.current.flushNow()}>flushNow()</button>
      <p style={{ color: '#666', fontSize: 13 }}>
        Flushes at 5 events, or after 1.5s of silence.
      </p>
      <ul style={{ fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.85 }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
    </div>
  )
}
