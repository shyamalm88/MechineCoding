import { useState } from 'react'

export default function Demo() {
  const [count, setCount] = useState(0)
  const [readBack, setReadBack] = useState('—')
  const [renders, setRenders] = useState(0)

  // Three calls, all reading the SAME stale `count` from this render's closure.
  const tripleWrong = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
    setReadBack(`after 3 setState, count var is still ${count}`)
  }

  // Functional updaters compose: each receives the pending value.
  const tripleRight = () => {
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setReadBack('used c => c + 1')
  }

  return (
    <div>
      <p style={{ fontSize: 22, fontFamily: 'monospace' }}>count = <b>{count}</b></p>
      <p>
        <button onClick={tripleWrong}>+1 ×3 (value form)</button>{' '}
        <button onClick={tripleRight}>+1 ×3 (functional form)</button>{' '}
        <button onClick={() => { setCount(0); setReadBack('—') }}>reset</button>
      </p>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>{readBack}</p>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 470 }}>
        The value form advances by 1, not 3 — all three calls read the same
        stale variable. The functional form advances by 3.
      </p>
    </div>
  )
}
