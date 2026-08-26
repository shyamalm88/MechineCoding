import { useState } from 'react'
import { createBatchLoader } from './batchDispatcher.js'

export default function Demo() {
  const [log, setLog] = useState([])

  const run = async () => {
    const out = []
    const loader = createBatchLoader(async (ids) => {
      out.push(`▶ ONE request for ids [${ids.join(', ')}]`)
      await new Promise((r) => setTimeout(r, 80))
      return ids.map((id) => ({ id, name: `User ${id}` }))
    })

    // Five independent components each ask for a user, unaware of each other.
    const users = await Promise.all([
      loader.load(1), loader.load(2), loader.load(3), loader.load(1), loader.load(2),
    ])
    out.push(`◀ resolved ${users.length} callers: ${users.map((u) => u.name).join(', ')}`)
    out.push('note: ids 1 and 2 were requested twice but fetched once')
    setLog(out)
  }

  return (
    <div>
      <button type="button" onClick={run}>Load 5 users (3 unique)</button>
      <ul style={{ fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.85 }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
    </div>
  )
}
