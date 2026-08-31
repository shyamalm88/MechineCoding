import { useMemo } from 'react'
import { useHashParam } from '../lib/hashState.js'
import { useProgress, summarise, PASSES } from '../lib/progress.js'
import ProgressRing from './ProgressRing.jsx'

const ALL = 'All'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export default function Sidebar({ problems, selectedId, onSelect, collection }) {
  const [progress, togglePass] = useProgress(collection?.id ?? 'problems')
  // Mirrored into the URL hash so a reload restores the same view.
  const [query, setQuery] = useHashParam('q', '')
  const [category, setCategory] = useHashParam('cat', ALL)
  const [difficulty, setDifficulty] = useHashParam('diff', ALL)
  const [importance, setImportance] = useHashParam('imp', ALL)
  const [technique, setTechnique] = useHashParam('tech', ALL)

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

  // Technique cuts across categories -- BFS lives in Graphs, Trees and Matrix
  // alike -- so it is the one filter that answers "show me every X problem".
  // Tags are derived from each file's own text by scripts/techniques.mjs, and
  // a problem can carry several.
  const techniques = useMemo(() => {
    const found = new Set()
    for (const problem of problems) for (const tag of problem.techniques ?? []) found.add(tag)
    return found.size ? [ALL, ...[...found].sort()] : []
  }, [problems])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return problems.filter((problem) => {
      if (category !== ALL && problem.category !== category) return false
      if (difficulty !== ALL && problem.difficulty !== difficulty) return false
      if (importance !== ALL && problem.importance !== importance) return false
      if (technique !== ALL && !(problem.techniques ?? []).includes(technique)) return false
      if (!needle) return true
      return `${problem.title} ${problem.category}`.toLowerCase().includes(needle)
    })
  }, [problems, query, category, difficulty, importance, technique])

  // The ring reports the whole collection, not the filtered view -- otherwise
  // narrowing to one category would read as sudden progress.
  const stats = useMemo(() => summarise(progress, problems), [progress, problems])

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        {collection?.brand ?? (<>Play<span>ground</span></>)}
      </div>

      <ProgressRing {...stats} />

      <input
        className="sidebar-search"
        type="search"
        value={query}
        placeholder="Search problems…"
        onChange={(event) => setQuery(event.target.value)}
      />

      {/* Dropdowns first: the category chips run to a dozen rows on the DSA
          collection, which pushed Technique below the fold where nobody found
          it. */}
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

        {techniques.length > 0 && (
          <label className="select-field wide">
            <span>Technique</span>
            <select value={technique} onChange={(event) => setTechnique(event.target.value)}>
              {techniques.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <span className="filter-label">Category</span>
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

      <p className="sidebar-count">{visible.length} of {problems.length}</p>

      <ul className="sidebar-list">
        {visible.map((problem) => {
          const marks = progress[problem.id] ?? []
          const fullyRevised = marks.filter(Boolean).length === PASSES

          return (
          <li key={problem.id} className={fullyRevised ? 'sidebar-row done' : 'sidebar-row'}>
            {/* Outside the row button on purpose: a checkbox nested inside a
                button is invalid HTML and the click never reaches it. */}
            <span className="revisions">
              {Array.from({ length: PASSES }, (_, pass) => (
                <input
                  key={pass}
                  type="checkbox"
                  className="revision-box"
                  checked={Boolean(marks[pass])}
                  onChange={() => togglePass(problem.id, pass)}
                  title={`Revision ${pass + 1}`}
                  aria-label={`${problem.title}: revision pass ${pass + 1}`}
                />
              ))}
            </span>
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
          )
        })}
        {visible.length === 0 && <li className="sidebar-empty">No matches.</li>}
      </ul>
    </nav>
  )
}
