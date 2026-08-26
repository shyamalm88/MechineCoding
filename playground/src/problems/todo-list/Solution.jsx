import { useMemo, useState } from 'react'

let nextId = 4
const INITIAL = [
  { id: 1, text: 'Model state before writing JSX', done: true },
  { id: 2, text: 'Handle the empty state', done: false },
  { id: 3, text: 'Make it keyboard-operable', done: false },
]

export default function TodoList() {
  const [todos, setTodos] = useState(INITIAL)
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)

  const visible = useMemo(
    () => todos.filter((t) => filter === 'all' || (filter === 'done') === t.done),
    [todos, filter],
  )
  const remaining = todos.filter((t) => !t.done).length

  const add = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return           // reject whitespace-only input
    setTodos((t) => [...t, { id: nextId++, text, done: false }])
    setDraft('')
  }

  const patch = (id, changes) =>
    setTodos((t) => t.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo)))

  return (
    <div className="td">
      <form onSubmit={add} className="td-form">
        <input
          className="td-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What needs doing?"
          aria-label="New todo"
        />
        <button className="td-add" type="submit" disabled={!draft.trim()}>Add</button>
      </form>

      <div className="td-filters">
        {['all', 'active', 'done'].map((f) => (
          <button key={f} className={filter === f ? 'td-chip td-on' : 'td-chip'} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
        <span className="td-count">{remaining} left</span>
      </div>

      {visible.length === 0 ? (
        <p className="td-empty">
          {todos.length === 0 ? 'Nothing yet — add your first todo.' : `No ${filter} items.`}
        </p>
      ) : (
        <ul className="td-list">
          {visible.map((t) => (
            <li key={t.id} className={t.done ? 'td-item td-doneitem' : 'td-item'}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => patch(t.id, { done: !t.done })}
                aria-label={`Mark "${t.text}" as ${t.done ? 'not done' : 'done'}`}
              />
              {editingId === t.id ? (
                <input
                  className="td-edit"
                  autoFocus
                  defaultValue={t.text}
                  onBlur={(e) => { patch(t.id, { text: e.target.value.trim() || t.text }); setEditingId(null) }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur()
                    if (e.key === 'Escape') setEditingId(null)   // discard the edit
                  }}
                />
              ) : (
                <span className="td-text" onDoubleClick={() => setEditingId(t.id)}>{t.text}</span>
              )}
              <button className="td-del" onClick={() => setTodos((all) => all.filter((x) => x.id !== t.id))}
                      aria-label={`Delete ${t.text}`}>×</button>
            </li>
          ))}
        </ul>
      )}
      <p className="td-hint">Double-click text to edit · Enter saves · Escape cancels</p>
    </div>
  )
}
