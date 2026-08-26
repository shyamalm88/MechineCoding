import { useRef, useState } from 'react'
import { createHistory } from './history.js'

export default function Demo() {
  const history = useRef(null)
  if (!history.current) history.current = createHistory('')
  const [text, setText] = useState('')
  const [, force] = useState(0)
  const h = history.current

  const onChange = (e) => { h.push(e.target.value); setText(e.target.value) }
  const apply = (fn) => { const v = fn(); setText(v); force((n) => n + 1) }

  return (
    <div>
      <input
        value={text}
        onChange={onChange}
        placeholder="Type, then undo…"
        style={{ padding: 8, fontSize: 15, width: 320 }}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); apply(() => h.undo()) }
          if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); apply(() => h.redo()) }
        }}
      />
      <p>
        <button type="button" disabled={!h.canUndo} onClick={() => apply(() => h.undo())}>Undo</button>{' '}
        <button type="button" disabled={!h.canRedo} onClick={() => apply(() => h.redo())}>Redo</button>
      </p>
      <p style={{ color: '#666', fontSize: 13 }}>Cmd/Ctrl+Z and Cmd/Ctrl+Shift+Z also work.</p>
    </div>
  )
}
