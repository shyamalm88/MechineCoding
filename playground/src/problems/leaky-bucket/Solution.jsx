import { useEffect, useRef, useState } from 'react'
import { LeakyBucket } from './leakyBucket.js'

const CAPACITY = 4
const LEAK_RATE = 1 // requests per second

export default function Demo() {
  const [log, setLog] = useState([])
  const [queued, setQueued] = useState(0)
  const bucketRef = useRef(null)
  const n = useRef(0)

  if (!bucketRef.current) bucketRef.current = new LeakyBucket(CAPACITY, LEAK_RATE)

  // The bucket leaks lazily (only when allow() is called), so poll leak() to
  // keep the displayed fill level current.
  useEffect(() => {
    const id = setInterval(() => {
      bucketRef.current.leak()
      setQueued(bucketRef.current.queue.length)
    }, 200)
    return () => clearInterval(id)
  }, [])

  const send = () => {
    const label = `r${++n.current}`
    const ok = bucketRef.current.allow(label)
    setQueued(bucketRef.current.queue.length)
    setLog((l) => [...l, `${label}: ${ok ? 'accepted' : 'DROPPED (bucket full)'}`])
  }

  return (
    <div>
      <button type="button" onClick={send}>Send request</button>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        bucket: <b>{queued}</b>/{CAPACITY} · leak rate: {LEAK_RATE}/sec
      </p>
      <ol style={{ fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.7 }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ol>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 440 }}>
        Click fast: the first four fit, the rest are dropped. One slot frees up
        every second as the bucket leaks.
      </p>
    </div>
  )
}
