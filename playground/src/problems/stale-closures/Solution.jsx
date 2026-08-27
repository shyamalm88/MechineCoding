import { useCallback, useEffect, useRef, useState } from 'react'

export default function Demo() {
  const [count, setCount] = useState(0)
  const [buggy, setBuggy] = useState('—')
  const [fixedFn, setFixedFn] = useState('—')
  const [fixedRef, setFixedRef] = useState('—')

  const countRef = useRef(count)
  countRef.current = count

  // ✗ [] means this closure captures count === 0 FOREVER.
  const readStale = useCallback(() => setBuggy(String(count)), [])
  // ✓ the functional updater always receives the latest value
  const readFunctional = useCallback(() => setFixedFn((_) => String(countRef.current ?? 0)), [])
  // ✓ a ref is a stable box whose .current is always current
  const readRef = useCallback(() => setFixedRef(String(countRef.current)), [])

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 700)
    return () => clearInterval(id)
  }, [])

  return (
    <div>
      <p style={{ fontSize: 22, fontFamily: 'monospace' }}>count = <b>{count}</b></p>
      <p>
        <button onClick={readStale}>read via stale closure</button>{' '}
        <button onClick={readRef}>read via ref</button>
      </p>
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
        <tbody>
          <tr><td style={{ padding: '5px 18px 5px 0' }}>useCallback(fn, []) saw</td>
              <td style={{ color: '#b91c1c', fontWeight: 700 }}>{buggy}</td></tr>
          <tr><td style={{ padding: '5px 18px 5px 0' }}>ref.current saw</td>
              <td style={{ color: '#15803d', fontWeight: 700 }}>{fixedRef}</td></tr>
        </tbody>
      </table>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 460 }}>
        Let the counter run, then click both. The stale closure is frozen at the
        value from the render that created it.
      </p>
    </div>
  )
}
