import { useEffect, useReducer, useRef, useState } from 'react'
import { createStore, applyMiddleware, combineReducers } from './createStore.js'

const counter = (state = 0, a) =>
  a.type === 'inc' ? state + 1 : a.type === 'dec' ? state - 1 : state
const todos = (state = [], a) => (a.type === 'add' ? [...state, a.text] : state)

export default function Demo() {
  const [log, setLog] = useState([])
  const storeRef = useRef(null)
  const [, force] = useReducer((n) => n + 1, 0)

  if (!storeRef.current) {
    const logger = (api) => (next) => (action) => {
      setLog((l) => [...l, `${action.type} · before ${JSON.stringify(api.getState())}`])
      return next(action)
    }
    storeRef.current = createStore(
      combineReducers({ counter, todos }),
      undefined,
      applyMiddleware(logger),
    )
  }
  const store = storeRef.current
  useEffect(() => store.subscribe(force), [store])

  const s = store.getState()
  return (
    <div>
      <p>
        <button onClick={() => store.dispatch({ type: 'inc' })}>+</button>{' '}
        <button onClick={() => store.dispatch({ type: 'dec' })}>−</button>{' '}
        <button onClick={() => store.dispatch({ type: 'add', text: `todo ${s.todos.length + 1}` })}>
          add todo
        </button>
      </p>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        state: {JSON.stringify(s)}
      </p>
      <ol style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7 }}>
        {log.slice(-6).map((l, i) => <li key={i}>{l}</li>)}
      </ol>
      <p style={{ color: '#666', fontSize: 13 }}>Middleware logs state before each action.</p>
    </div>
  )
}
