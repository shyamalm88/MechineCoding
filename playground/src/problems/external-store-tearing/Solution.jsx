import { useEffect, useState, useSyncExternalStore } from 'react'
import { createStore } from './store.js'

const store = createStore(0)

// The naive subscription: correct-looking, but it re-implements what
// useSyncExternalStore does properly (and misses the SSR + tearing guarantees).
function Manual() {
  const [value, setValue] = useState(store.getSnapshot())
  useEffect(() => store.subscribe(() => setValue(store.getSnapshot())), [])
  return <b>{value}</b>
}

function Correct() {
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, () => 0)
  return <b>{value}</b>
}

export default function Demo() {
  return (
    <div>
      <p>
        <button onClick={() => store.set(store.getSnapshot() + 1)}>increment external store</button>{' '}
        <button onClick={() => store.set(0)}>reset</button>
      </p>
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 14 }}>
        <tbody>
          <tr><td style={{ padding: '6px 22px 6px 0' }}>useSyncExternalStore</td><td><Correct /></td></tr>
          <tr><td style={{ padding: '6px 22px 6px 0' }}>useState + useEffect</td><td><Manual /></td></tr>
        </tbody>
      </table>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 470 }}>
        Both track the store here. The difference only shows under concurrent
        rendering, where the manual version can tear — see the notes.
      </p>
    </div>
  )
}
