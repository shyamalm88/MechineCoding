import { useEffect, useState } from 'react'
import { Observable } from './Observable.js'

export default function Demo() {
  const [values, setValues] = useState([])
  const [status, setStatus] = useState('idle')
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return undefined
    setValues([]); setStatus('subscribed')

    const sub = Observable.interval(300)
      .map((n) => n * 10)
      .filter((n) => n % 20 === 0)
      .take(4)
      .subscribe({
        next: (v) => setValues((vs) => [...vs, v]),
        complete: () => { setStatus('completed'); setRunning(false) },
      })

    // Unsubscribing tears down the interval all the way upstream.
    return () => sub.unsubscribe()
  }, [running])

  return (
    <div>
      <button type="button" onClick={() => setRunning((r) => !r)}>
        {running ? 'Unsubscribe' : 'Subscribe'}
      </button>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        status: <b>{status}</b> · emitted: <b>[{values.join(', ')}]</b>
      </p>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 440 }}>
        interval(300ms) → map(×10) → filter(÷20) → take(4). Unsubscribing
        clears the interval; nothing runs until you subscribe.
      </p>
    </div>
  )
}
