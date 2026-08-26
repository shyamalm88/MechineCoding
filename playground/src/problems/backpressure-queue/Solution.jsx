import { useEffect, useRef, useState } from 'react'
import { BackpressureQueue } from './BackpressureQueue.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Demo() {
  const [stats, setStats] = useState({ running: 0, queued: 0, blocked: 0 })
  const [log, setLog] = useState([])
  const qRef = useRef(null)
  const n = useRef(0)
  if (!qRef.current) qRef.current = new BackpressureQueue({ concurrency: 2, maxQueueSize: 3 })

  useEffect(() => {
    const i = setInterval(() => setStats({ ...qRef.current.stats }), 120)
    return () => clearInterval(i)
  }, [])

  const flood = async () => {
    for (let i = 0; i < 8; i++) {
      const label = `t${++n.current}`
      const accepted = qRef.current.push(async () => {
        setLog((l) => [...l, `${label} started`])
        await sleep(700)
        setLog((l) => [...l, `${label} done`])
      })
      accepted.then(() => setLog((l) => [...l, `${label} admitted`]))
    }
  }

  return (
    <div>
      <button type="button" onClick={flood}>Push 8 tasks (concurrency 2, queue 3)</button>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        running <b>{stats.running}</b> · queued <b>{stats.queued}</b> ·
        producers blocked <b>{stats.blocked}</b>
      </p>
      <ol style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.65, maxHeight: 200, overflow: 'auto' }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ol>
    </div>
  )
}
