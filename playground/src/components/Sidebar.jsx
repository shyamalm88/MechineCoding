import { useMemo, useState } from 'react'

const ALL = 'All'

export default function Sidebar({ problems, selectedId, onSelect }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL)

  const categories = useMemo(
    () => [ALL, ...new Set(problems.map((problem) => problem.category))],
    [problems],
  )

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return problems.filter((problem) => {
      if (category !== ALL && problem.category !== category) return false
      if (!needle) return true
      return `${problem.title} ${problem.category}`.toLowerCase().includes(needle)
    })
  }, [problems, query, category])

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        Play<span>ground</span>
      </div>

      <input
        className="sidebar-search"
        type="search"
        value={query}
        placeholder="Search problems…"
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="sidebar-filters">
        {categories.map((name) => (
          <button
            key={name}
            type="button"
            className={name === category ? 'chip active' : 'chip'}
            onClick={() => setCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <ul className="sidebar-list">
        {visible.map((problem) => (
          <li key={problem.id}>
            <button
              type="button"
              className={problem.id === selectedId ? 'item active' : 'item'}
              onClick={() => onSelect(problem.id)}
            >
              <span className="item-title">{problem.title}</span>
              <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </span>
            </button>
          </li>
        ))}
        {visible.length === 0 && <li className="sidebar-empty">No matches.</li>}
      </ul>
    </nav>
  )
}
