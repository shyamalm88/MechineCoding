import { useEffect, useRef, useState } from 'react'

export default function Demo() {
  const [log, setLog] = useState([])
  const nativeRef = useRef(null)
  const add = (m) => setLog((l) => [...l, m])

  useEffect(() => {
    const el = nativeRef.current
    const onNative = () => add('3. native listener on the button')
    const onDoc = () => add('4. native listener on document')
    el.addEventListener('click', onNative)
    document.addEventListener('click', onDoc)
    return () => {
      el.removeEventListener('click', onNative)
      document.removeEventListener('click', onDoc)
    }
  }, [])

  return (
    <div onClickCapture={() => add('1. React capture (parent)')}
         onClick={() => add('5. React bubble (parent)')}>
      <button ref={nativeRef} onClick={(e) => {
        add(`2. React onClick — isTrusted=${e.nativeEvent.isTrusted}`)
      }}>
        click me
      </button>{' '}
      <button onClick={() => setLog([])}>clear</button>
      <ol style={{ fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.75 }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ol>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 470 }}>
        The React handler is not attached to the button — it runs as the event
        bubbles up to the React root, which is why the ordering is surprising.
      </p>
    </div>
  )
}
