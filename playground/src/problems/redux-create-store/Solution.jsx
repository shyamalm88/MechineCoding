import { useEffect, useReducer, useRef, useState } from 'react'
import { createStore, counterReducer } from './createStore.js'

export default function Demo() {
  const [log, setLog] = useState([])
  const storeRef = useRef(null)
  const [, force] = useReducer((n) => n + 1, 0)

  if (!storeRef.current) storeRef.current = createStore(counterReducer, { count: 0 })
  const store = storeRef.current

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setLog((l) => [...l, `State changed: ${JSON.stringify(store.getState())}`])
      force()
    })
    return unsubscribe
  }, [store])

  return (
    <div>
      <p>
        <button type="button" onClick={() => store.dispatch({ type: 'INCREMENT' })}>+</button>{' '}
        <button type="button" onClick={() => store.dispatch({ type: 'DECREMENT' })}>−</button>
      </p>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        state: {JSON.stringify(store.getState())}
      </p>
      <ol style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7 }}>
        {log.slice(-6).map((l, i) => <li key={i}>{l}</li>)}
      </ol>
      <p style={{ color: '#666', fontSize: 13 }}>Every dispatch runs the reducer, then notifies subscribers.</p>
    </div>
  )
}
