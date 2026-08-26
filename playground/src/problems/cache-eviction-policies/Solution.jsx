import { useEffect, useState } from 'react'
import { LFUCache, LRUWithTTL } from './caches.js'

export default function Demo() {
  const [rows, setRows] = useState(null)

  useEffect(() => {
    const out = []
    const lfu = new LFUCache(2)
    lfu.put(1, 'a'); lfu.put(2, 'b')
    lfu.get(1); lfu.get(1)                    // key 1 freq = 3
    lfu.put(3, 'c')                            // evicts key 2 (freq 1)
    out.push(['LFU cap 2: get(1) after 2 hits', lfu.get(1)])
    out.push(['LFU: get(2) — least frequent, evicted', lfu.get(2)])
    out.push(['LFU: get(3)', lfu.get(3)])

    const ttl = new LRUWithTTL(3, 300)
    ttl.put('x', 'fresh')
    out.push(['TTL: get("x") immediately', ttl.get('x')])

    setTimeout(() => {
      out.push(['TTL: get("x") after 400ms (expired)', ttl.get('x')])
      setRows([...out])
    }, 400)
  }, [])

  if (!rows) return <p>running…</p>
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <tbody>
        {rows.map(([a, b]) => (
          <tr key={a}>
            <td style={{ padding: '6px 18px 6px 0' }}>{a}</td>
            <td style={{ fontWeight: 700 }}>{String(b)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
