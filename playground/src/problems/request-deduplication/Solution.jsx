import { useState } from 'react'
import { coalescedFetch, createLatestFetcher } from './dedupe.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Demo() {
  const [log, setLog] = useState([])

  const run = async () => {
    const out = []

    // coalescedFetch calls the global fetch -- stub it so the demo stays offline.
    let calls = 0
    const realFetch = globalThis.fetch
    globalThis.fetch = async (url) => { calls++; await sleep(120); return `response for ${url}` }
    try {
      await Promise.all([
        coalescedFetch('/api/user/1'), coalescedFetch('/api/user/1'),
        coalescedFetch('/api/user/1'), coalescedFetch('/api/user/2'),
      ])
    } finally {
      globalThis.fetch = realFetch
    }
    out.push(`coalescedFetch: 4 calls for 2 unique urls → ${calls} actual requests`)

    // Slow "a" then fast "ab": without createLatestFetcher, "a" would land last.
    const search = createLatestFetcher(async (q) => { await sleep(q === 'a' ? 200 : 40); return `results for "${q}"` })
    let rendered = null
    const p1 = search('a').then((r) => { out.push(`  "a" resolved with ${r} (undefined = stale, ignored)`) })
    const p2 = search('ab').then((r) => { rendered = r })
    await Promise.allSettled([p1, p2])
    await sleep(250)
    out.push(`createLatestFetcher: UI shows → ${rendered}`)
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
