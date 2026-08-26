import { useEffect, useState } from 'react'
import { measure } from './measure.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Demo() {
  const [rows, setRows] = useState(null)
  useEffect(() => {
    let alive = true
    ;(async () => {
      const syncWork = measure(function fib() {
        let a = 0, b = 1
        for (let i = 0; i < 200000; i++) [a, b] = [b, a + b]
        return 'done'
      })
      const asyncWork = measure(async function fetchish() { await sleep(120); return 'payload' })
      const boom = measure(function boom() { throw new Error('kaboom') })

      const out = [syncWork(), await asyncWork(), boom()]
      if (alive) setRows(out)
    })()
    return () => { alive = false }
  }, [])

  if (!rows) return <p>running…</p>
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <thead><tr>{['fn','outcome','ms','value'].map(h=><th key={h} style={{textAlign:'left',padding:'4px 16px 4px 0'}}>{h}</th>)}</tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <td style={{padding:'6px 16px 6px 0'}}>{r.label}</td>
            <td>{r.outcome}</td>
            <td style={{padding:'0 16px',fontWeight:700}}>{r.duration}</td>
            <td>{String(r.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
