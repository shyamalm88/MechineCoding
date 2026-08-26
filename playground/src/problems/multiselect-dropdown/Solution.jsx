import { useEffect, useMemo, useRef, useState } from 'react'

const OPTIONS = ['Alabama','Alaska','Arizona','California','Colorado','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Kansas','Maine','Michigan','Nevada','Ohio','Oregon','Texas','Utah','Vermont','Wyoming']

export default function MultiSelect() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(() => new Set(['Texas']))
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef(null)
  const listRef = useRef(null)

  const filtered = useMemo(
    () => OPTIONS.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  )

  // Click-outside. mousedown (not click) so a drag ending outside doesn't close.
  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  useEffect(() => { setActiveIndex(0) }, [query])

  // Keep the active option scrolled into view during keyboard navigation.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const toggle = (value) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && open && filtered[activeIndex]) { e.preventDefault(); toggle(filtered[activeIndex]) }
    else if (e.key === 'Escape') { setOpen(false) }
    else if (e.key === 'Backspace' && !query && selected.size) {
      // Backspace on an empty query removes the last chip -- standard behaviour.
      const last = [...selected].pop()
      toggle(last)
    }
  }

  return (
    <div className="ms" ref={rootRef}>
      <div className="ms-control" onClick={() => setOpen(true)}>
        {[...selected].map((s) => (
          <span key={s} className="ms-chip">
            {s}
            <button type="button" aria-label={`Remove ${s}`} onClick={(e) => { e.stopPropagation(); toggle(s) }}>×</button>
          </span>
        ))}
        <input
          className="ms-input"
          value={query}
          placeholder={selected.size ? '' : 'Search states…'}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-controls="ms-listbox"
          aria-autocomplete="list"
        />
      </div>

      {open && (
        <ul className="ms-list" id="ms-listbox" role="listbox" aria-multiselectable="true" ref={listRef}>
          {filtered.length === 0 && <li className="ms-empty">No matches</li>}
          {filtered.map((o, i) => (
            <li
              key={o}
              role="option"
              aria-selected={selected.has(o)}
              data-active={i === activeIndex}
              className={`ms-option${i === activeIndex ? ' ms-active' : ''}`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => { e.preventDefault(); toggle(o) }}
            >
              <input type="checkbox" readOnly checked={selected.has(o)} tabIndex={-1} />
              {o}
            </li>
          ))}
        </ul>
      )}
      <p className="ms-hint">{selected.size} selected · ↑↓ navigate · Enter toggles · Backspace removes last</p>
    </div>
  )
}
