import { useEffect, useState } from 'react'
import { memoizeAsync } from './memoAsync.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Demo() {
  const [rows, setRows] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const out = []
      let calls = 0
      const load = memoizeAsync(async (id) => { calls++; await sleep(80); return `user${id}` })

      await Promise.all([load(1), load(1), load(1)])
      out.push(['3 concurrent calls, same key', `${calls} actual invocation`])
      await load(1)
      out.push(['4th call after resolution', `${calls} actual invocation (cached)`])

      let failCalls = 0
      const flaky = memoizeAsync(async () => { failCalls++; await sleep(30); throw new Error('boom') })
      await flaky().catch(() => {})
      await flaky().catch(() => {})
      out.push(['rejections are NOT cached', `${failCalls} invocations (retried)`])

      let ttlCalls = 0
      const short = memoizeAsync(async () => { ttlCalls++; return 'v' }, { ttlMs: 100 })
      await short(); await short()
      await sleep(140)
      await short()
      out.push(['ttl 100ms: 3 calls across 140ms', `${ttlCalls} invocations`])

      if (alive) setRows(out)
    })()
    return () => { alive = false }
  }, [])

  if (!rows) return <p>running…</p>
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <tbody>
        {rows.map(([a, b]) => (
          <tr key={a}><td style={{ padding: '6px 18px 6px 0' }}>{a}</td>
          <td style={{ fontWeight: 700 }}>{b}</td></tr>
        ))}
      </tbody>
    </table>
  )
}
