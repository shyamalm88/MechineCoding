import { useRef, useState } from 'react'

/**
 * Counters live in a ref, not at module scope, so they reset when the demo
 * remounts -- module-level counters accumulate across visits and make the
 * comparison meaningless.
 */
function expensiveInit(counts, kind) {
  counts.current[kind] += 1
  let total = 0
  for (let i = 0; i < 50000; i++) total += i
  return total
}

export default function Demo() {
  const counts = useRef({ eager: 0, lazy: 0 })

  // ✗ expensiveInit() RUNS on every render; its value is only USED once.
  const [eager] = useState(expensiveInit(counts, 'eager'))
  // ✓ the function is only CALLED on the first render.
  const [lazy] = useState(() => expensiveInit(counts, 'lazy'))
  const [, force] = useState(0)

  return (
    <div>
      <button onClick={() => force((n) => n + 1)}>Re-render</button>
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13, marginTop: 14 }}>
        <tbody>
          <tr>
            <td style={{ padding: '6px 20px 6px 0' }}>useState(expensiveInit())</td>
            <td style={{ color: '#b91c1c', fontWeight: 700 }} data-testid="eager">
              ran {counts.current.eager}×
            </td>
          </tr>
          <tr>
            <td style={{ padding: '6px 20px 6px 0' }}>useState(() =&gt; expensiveInit())</td>
            <td style={{ color: '#15803d', fontWeight: 700 }} data-testid="lazy">
              ran {counts.current.lazy}×
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 450 }}>
        Click Re-render a few times. Both hold the same value
        ({eager === lazy ? 'equal' : 'differ'}), but only the eager form repeats
        the work.
      </p>
    </div>
  )
}
