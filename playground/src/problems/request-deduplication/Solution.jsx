import { useState } from 'react'
import { coalesce, latestOnly } from './dedupe.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Demo() {
  const [log, setLog] = useState([])

  const run = async () => {
    const out = []

    let calls = 0
    const fetchUser = coalesce(async (id) => { calls++; await sleep(120); return `user${id}` })
    await Promise.all([fetchUser(1), fetchUser(1), fetchUser(1), fetchUser(2)])
    out.push(`coalesce: 4 calls for 2 unique ids → ${calls} actual requests`)

    // Slow "a" then fast "ab": without latestOnly, "a" would land last.
    const search = latestOnly(async (q) => { await sleep(q === 'a' ? 200 : 40); return `results for "${q}"` })
    let rendered = null
    const p1 = search('a').then((r) => { rendered = r }, (e) => { if (e.stale) out.push('  "a" resolved but was STALE → ignored') })
    const p2 = search('ab').then((r) => { rendered = r })
    await Promise.allSettled([p1, p2])
    await sleep(250)
    out.push(`latestOnly: UI shows → ${rendered}`)
    setLog(out)
  }

  return (
    <div>
      <button type="button" onClick={run}>Run</button>
      <ul style={{ fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.85 }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
    </div>
  )
}
