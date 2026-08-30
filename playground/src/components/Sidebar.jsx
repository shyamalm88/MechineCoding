import { useMemo } from 'react'
import { useHashParam } from '../lib/hashState.js'

const ALL = 'All'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export default function Sidebar({ problems, selectedId, onSelect, collection }) {
  // Mirrored into the URL hash so a reload restores the same view.
  const [query, setQuery] = useHashParam('q', '')
  const [category, setCategory] = useHashParam('cat', ALL)
  const [difficulty, setDifficulty] = useHashParam('diff', ALL)
  const [importance, setImportance] = useHashParam('imp', ALL)

  const categories = useMemo(
    () => [ALL, ...new Set(problems.map((problem) => problem.category))],
    [problems],
  )

  // The importance row only exists for collections that use it (DSA), so the
  // same Sidebar serves both without a second component.
  const importances = useMemo(() => {
    const found = [...new Set(problems.map((p) => p.importance).filter(Boolean))]
    return found.length ? [ALL, ...found] : []
  }, [problems])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return problems.filter((problem) => {
      if (category !== ALL && problem.category !== category) return false
      if (difficulty !== ALL && problem.difficulty !== difficulty) return false
      if (importance !== ALL && problem.importance !== importance) return false
      if (!needle) return true
      return `${problem.title} ${problem.category}`.toLowerCase().includes(needle)
    })
  }, [problems, query, category, difficulty, importance])

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        {collection?.brand ?? (<>Play<span>ground</span></>)}
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

      <div className="sidebar-selects">
        <label className="select-field">
          <span>Difficulty</span>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            {[ALL, ...DIFFICULTIES].map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>

        {importances.length > 0 && (
          <label className="select-field">
            <span>Importance</span>
            <select value={importance} onChange={(event) => setImportance(event.target.value)}>
              {importances.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <p className="sidebar-count">{visible.length} of {problems.length}</p>

      <ul className="sidebar-list">
        {visible.map((problem) => (
          <li key={problem.id}>
            <button
              type="button"
              className={problem.id === selectedId ? 'item active' : 'item'}
              onClick={() => onSelect(problem.id)}
            >
              <span className="item-title">{problem.title}</span>
              <span className="item-tags">
                {problem.importance && (
                  <span className={`imp imp-${problem.importance.toLowerCase()}`}>
                    {problem.importance}
                  </span>
                )}
                <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
              </span>
            </button>
          </li>
        ))}
        {visible.length === 0 && <li className="sidebar-empty">No matches.</li>}
      </ul>
    </nav>
  )
}
