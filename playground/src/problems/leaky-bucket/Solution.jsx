import { useEffect, useRef, useState } from 'react'
import { LeakyBucket } from './leakyBucket.js'

export default function Demo() {
  const [drained, setDrained] = useState([])
  const [dropped, setDropped] = useState(0)
  const [queued, setQueued] = useState(0)
  const bucketRef = useRef(null)
  const n = useRef(0)

  if (!bucketRef.current) bucketRef.current = new LeakyBucket({ capacity: 4, leakRatePerSec: 2 })
  useEffect(() => () => bucketRef.current.stop(), [])

  const burst = () => {
    for (let i = 0; i < 6; i++) {
      const label = `r${++n.current}`
      const accepted = bucketRef.current.add(label, (item) => {
        setDrained((d) => [...d, `${item} @ ${new Date().toLocaleTimeString('en-GB')}`])
        setQueued(bucketRef.current.size)
      })
      if (!accepted) setDropped((d) => d + 1)
    }
    setQueued(bucketRef.current.size)
  }

  return (
    <div>
      <button type="button" onClick={burst}>Send burst of 6</button>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        queued: <b>{queued}</b>/4 · dropped: <b>{dropped}</b> · leak rate: 2/sec
      </p>
      <ol style={{ fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.7 }}>
        {drained.map((d, i) => <li key={i}>{d}</li>)}
      </ol>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 440 }}>
        Six arrive at once; four are queued and two dropped. They drain at a
        steady 2/sec — the output rate never bursts.
      </p>
    </div>
  )
}
