import { useEffect, useRef, useState } from 'react'
import { Analytics } from './Analytics.js'

export default function Demo() {
  const [sent, setSent] = useState([])
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    // The SDK POSTs to /analytics -- stub fetch so the demo stays offline.
    const realFetch = globalThis.fetch
    globalThis.fetch = async (url, { body }) => {
      const batch = JSON.parse(body)
      setSent((s) => [...s, `POST ${url}: ${batch.length} events: ${batch.map((e) => e.event).join(', ')}`])
      return new Response(null, { status: 204 })
    }
    ref.current = new Analytics(3, 2000)
    return () => {
      ref.current.destroy()
      globalThis.fetch = realFetch
    }
  }, [])

  return (
    <div>
      <button type="button" onClick={() => { ref.current.track(`e${count + 1}`); setCount((c) => c + 1) }}>
        Track event
      </button>{' '}
      <button type="button" onClick={() => ref.current.flush()}>Flush now</button>
      <p style={{ color: '#666', fontSize: 13 }}>
        Flushes at 3 events, or every 2s from a background interval.
      </p>
      <ul style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8 }}>
        {sent.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  )
}
