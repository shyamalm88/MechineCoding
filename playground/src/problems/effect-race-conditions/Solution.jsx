import { useEffect, useState } from 'react'

// id 1 is deliberately slower than id 2, so an unguarded effect resolves
// out of order and shows the wrong user.
const fakeFetch = (id) =>
  new Promise((r) => setTimeout(() => r(`User ${id}`), id === 1 ? 700 : 120))

function Buggy({ id }) {
  const [user, setUser] = useState('loading…')
  useEffect(() => {
    setUser('loading…')
    fakeFetch(id).then(setUser)          // ✗ no guard
  }, [id])
  return <b style={{ color: '#b91c1c' }}>{user}</b>
}

function Fixed({ id }) {
  const [user, setUser] = useState('loading…')
  useEffect(() => {
    let ignore = false                    // ✓ cleanup flips this
    setUser('loading…')
    fakeFetch(id).then((u) => { if (!ignore) setUser(u) })
    return () => { ignore = true }
  }, [id])
  return <b style={{ color: '#15803d' }}>{user}</b>
}

export default function Demo() {
  const [id, setId] = useState(1)
  return (
    <div>
      <p style={{ maxWidth: 470, fontSize: 14 }}>
        Click <b>1</b> then immediately <b>2</b>. Request 1 is slower, so it
        lands last and overwrites the newer result.
      </p>
      <p>
        {[1, 2].map((n) => (
          <button key={n} onClick={() => setId(n)} style={{ marginRight: 6 }}>
            load user {n}
          </button>
        ))}
        <span style={{ marginLeft: 10, fontFamily: 'monospace' }}>selected: {id}</span>
      </p>
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 14 }}>
        <tbody>
          <tr><td style={{ padding: '6px 20px 6px 0' }}>no cleanup</td><td><Buggy id={id} /></td></tr>
          <tr><td style={{ padding: '6px 20px 6px 0' }}>ignore flag</td><td><Fixed id={id} /></td></tr>
        </tbody>
      </table>
    </div>
  )
}
