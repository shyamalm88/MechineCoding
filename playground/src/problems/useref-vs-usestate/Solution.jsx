import { useRef, useState } from 'react'

export default function Demo() {
  const [stateCount, setStateCount] = useState(0)
  const refCount = useRef(0)
  const renders = useRef(0)
  renders.current++

  return (
    <div>
      <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 14 }}>
        <tbody>
          <tr><td style={{ padding: '6px 22px 6px 0' }}>useState value</td><td><b>{stateCount}</b></td></tr>
          <tr><td style={{ padding: '6px 22px 6px 0' }}>useRef .current</td><td><b>{refCount.current}</b></td></tr>
          <tr><td style={{ padding: '6px 22px 6px 0' }}>renders so far</td><td><b>{renders.current}</b></td></tr>
        </tbody>
      </table>
      <p style={{ marginTop: 14 }}>
        <button onClick={() => setStateCount((c) => c + 1)}>setState +1</button>{' '}
        <button onClick={() => { refCount.current++ }}>ref.current +1 (no re-render)</button>
      </p>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 470 }}>
        Click the ref button a few times — nothing updates. Then click setState:
        the ref's accumulated value suddenly appears, because only now did a
        render read it.
      </p>
    </div>
  )
}
