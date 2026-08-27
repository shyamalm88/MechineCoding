import { useMemo, useState } from 'react'

const ITEMS = ['alpha', 'beta', 'gamma', 'delta', 'epsilon']

export default function Demo() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(new Set())

  // ✓ derived during render -- cannot go stale, no extra render, no effect
  const filtered = useMemo(
    () => ITEMS.filter((i) => i.includes(query.toLowerCase())),
    [query],
  )
  const selectedCount = selected.size          // ✓ trivially derived, no memo needed
  const allVisibleSelected = filtered.length > 0 && filtered.every((i) => selected.has(i))

  const toggle = (item) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)}
             placeholder="filter…" style={{ padding: 7, width: 200 }} />
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
        {filtered.map((i) => (
          <li key={i} style={{ padding: '3px 0' }}>
            <label>
              <input type="checkbox" checked={selected.has(i)} onChange={() => toggle(i)} /> {i}
            </label>
          </li>
        ))}
      </ul>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        derived → filtered: {filtered.length} · selected: {selectedCount} ·
        all visible selected: {String(allVisibleSelected)}
      </p>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 460 }}>
        Only <code>query</code> and <code>selected</code> are state. Everything
        else is computed during render, so it can never disagree.
      </p>
    </div>
  )
}
