import { useEffect, useState } from 'react'
import { pipeAsync, composeAsync, waterfall, pipeAsyncCancellable } from './compose.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const double = async (n) => { await sleep(30); return n * 2 }
const inc = async (n) => { await sleep(30); return n + 1 }

export default function Demo() {
  const [rows, setRows] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const out = []
      out.push(['pipeAsync(double, inc)(5)', await pipeAsync(double, inc)(5)])
      out.push(['composeAsync(double, inc)(5)', await composeAsync(double, inc)(5)])

      const { result, history } = await waterfall([
        async (x) => x + 1,
        async (x, hist) => x * 10 + hist.length,
        async (x, hist) => `${x} after ${hist.length} steps`,
      ], 1)
      out.push(['waterfall result', result])

      const ac = new AbortController()
      const slow = pipeAsyncCancellable(double, async (n) => { await sleep(200); return n }, inc)
      const p = slow(5, ac.signal).catch((e) => e.name)
      setTimeout(() => ac.abort(), 60)
      out.push(['cancellable pipeline aborted mid-chain', await p])

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
          <td style={{ fontWeight: 700 }}>{String(b)}</td></tr>
        ))}
      </tbody>
    </table>
  )
}
