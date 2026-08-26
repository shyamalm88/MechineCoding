import { useState } from 'react'

function makeCounter() {
  let count = 0                       // private -- unreachable from outside
  return { inc: () => ++count, get: () => count }
}

// The classic loop question
const varResults = []
for (var i = 0; i < 3; i++) varResults.push(() => i)
const letResults = []
for (let j = 0; j < 3; j++) letResults.push(() => j)

export default function Demo() {
  const [c] = useState(makeCounter)
  const [, force] = useState(0)

  const rows = [
    ['var loop: [f0(), f1(), f2()]', JSON.stringify(varResults.map((f) => f()))],
    ['let loop: [f0(), f1(), f2()]', JSON.stringify(letResults.map((f) => f()))],
    ['counter.get()', c.get()],
    ['typeof counter.count (private)', typeof c.count],
  ]

  return (
    <div>
      <button type="button" onClick={() => { c.inc(); force((n) => n + 1) }}>
        counter.inc()
      </button>
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13, marginTop: 14 }}>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a}>
              <td style={{ padding: '6px 18px 6px 0' }}>{a}</td>
              <td style={{ padding: '6px 0', fontWeight: 700 }}>{String(b)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
