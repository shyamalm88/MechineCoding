import { useMemo, useState } from 'react'
import { Trie } from './Trie.js'

const WORDS = ['car','card','care','careful','cat','cats','dog','dodge','door','do','done']

export default function Demo() {
  const trie = useMemo(() => {
    const t = new Trie()
    WORDS.forEach((w) => t.insert(w))
    return t
  }, [])
  const [prefix, setPrefix] = useState('ca')

  const matches = trie.autocomplete(prefix)

  return (
    <div>
      <input value={prefix} onChange={(e) => setPrefix(e.target.value)}
             placeholder="prefix…" style={{ padding: 8, fontSize: 15, width: 220 }} />
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13, marginTop: 14 }}>
        <tbody>
          <tr><td style={{ padding: '5px 18px 5px 0' }}>autocomplete("{prefix}")</td>
              <td style={{ fontWeight: 700 }}>{matches.length ? matches.join(', ') : '—'}</td></tr>
          <tr><td style={{ padding: '5px 18px 5px 0' }}>search("{prefix}") — exact word?</td>
              <td style={{ fontWeight: 700 }}>{String(trie.search(prefix))}</td></tr>
          <tr><td style={{ padding: '5px 18px 5px 0' }}>startsWith("{prefix}")</td>
              <td style={{ fontWeight: 700 }}>{String(trie.startsWith(prefix))}</td></tr>
        </tbody>
      </table>
      <p style={{ color: '#666', fontSize: 13 }}>
        Try “car” — it is both a stored word and a prefix of others.
      </p>
    </div>
  )
}
