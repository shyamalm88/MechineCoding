import { useEffect, useState } from 'react'

// id 1 is deliberately slower than id 2, so an unguarded effect resolves out of
// order and ends up showing the wrong user.
const fakeFetch = (id) =>
  new Promise((r) => setTimeout(() => r(`User ${id}`), id === 1 ? 700 : 120))

// `attempt` is part of the deps so re-selecting the SAME id still re-runs the
// effect -- without it React bails out on an identical setState and the race
// cannot be reproduced on demand.
function Buggy({ id, attempt }) {
  const [user, setUser] = useState('—')
  useEffect(() => {
    setUser('loading…')
    fakeFetch(id).then(setUser)              // ✗ no guard
  }, [id, attempt])
  return <b style={{ color: '#b91c1c' }}>{user}</b>
}

function Fixed({ id, attempt }) {
  const [user, setUser] = useState('—')
  useEffect(() => {
    let ignore = false                        // ✓ cleanup invalidates this run
    setUser('loading…')
    fakeFetch(id).then((u) => { if (!ignore) setUser(u) })
    return () => { ignore = true }
  }, [id, attempt])
  return <b style={{ color: '#15803d' }}>{user}</b>
}

export default function Demo() {
  const [{ id, attempt }, setState] = useState({ id: 2, attempt: 0 })

  const select = (next) => setState((s) => ({ id: next, attempt: s.attempt + 1 }))

  // Deterministic reproduction: request the slow user, then the fast one
  // before it can settle.
  const runRace = () => {
    setState((s) => ({ id: 1, attempt: s.attempt + 1 }))
    setTimeout(() => setState((s) => ({ id: 2, attempt: s.attempt + 1 })), 80)
  }

  return (
    <div>
      <p style={{ maxWidth: 480, fontSize: 14 }}>
        Request for user 1 is slow (700ms), user 2 is fast (120ms). Ask for 1
        then 2, and 1 lands <i>last</i> — overwriting the newer result.
      </p>
      <p>
        <button onClick={runRace} style={{ fontWeight: 600 }}>Run the race (1 → 2)</button>{' '}
        <button onClick={() => select(1)}>load 1</button>{' '}
        <button onClick={() => select(2)}>load 2</button>
        <span style={{ marginLeft: 12, fontFamily: 'monospace' }}>selected: {id}</span>
      </p>
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 14 }}>
        <tbody>
          <tr>
            <td style={{ padding: '6px 20px 6px 0' }}>no cleanup</td>
            <td><Buggy id={id} attempt={attempt} /></td>
            <td style={{ paddingLeft: 14, fontSize: 12.5, color: '#b91c1c' }}>
              ends on User 1 — wrong
            </td>
          </tr>
          <tr>
            <td style={{ padding: '6px 20px 6px 0' }}>ignore flag</td>
            <td><Fixed id={id} attempt={attempt} /></td>
            <td style={{ paddingLeft: 14, fontSize: 12.5, color: '#15803d' }}>
              stays on User 2 — correct
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
