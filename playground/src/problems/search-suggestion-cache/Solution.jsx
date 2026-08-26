import { useRef, useState } from 'react'
import { createSuggestionCache } from './cache.js'

const FRUITS = ['apple', 'apricot', 'banana', 'blueberry', 'cherry', 'cranberry', 'date', 'fig', 'grape']

export default function Demo() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [stats, setStats] = useState({ hits: 0, misses: 0, size: 0 })
  const [requests, setRequests] = useState(0)
  const cacheRef = useRef(null)

  if (!cacheRef.current) {
    cacheRef.current = createSuggestionCache(
      async (q) => {
        setRequests((n) => n + 1)
        await new Promise((r) => setTimeout(r, 250))
        return FRUITS.filter((f) => f.startsWith(q))
      },
      { max: 4 },
    )
  }

  const onChange = async (e) => {
    const q = e.target.value
    setQuery(q)
    if (!q) { setResults([]); return }
    const r = await cacheRef.current.get(q)
    setResults(r)
    setStats(cacheRef.current.stats())
  }

  return (
    <div>
      <input value={query} onChange={onChange} placeholder="Type a/b/c…"
             style={{ padding: 8, fontSize: 15, width: 260 }} />
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        network requests: <b>{requests}</b> · hits: <b>{stats.hits}</b> ·
        misses: <b>{stats.misses}</b> · cached: <b>{stats.size}</b>/4
      </p>
      <ul>{results.map((r) => <li key={r}>{r}</li>)}</ul>
      <p style={{ color: '#666', fontSize: 13 }}>
        Retype a previous query — no new request. Cache holds only 4 queries.
      </p>
    </div>
  )
}
