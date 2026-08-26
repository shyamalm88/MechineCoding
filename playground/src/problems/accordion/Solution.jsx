import { useRef, useState } from 'react'

const ITEMS = [
  { id: 'a', q: 'What is an accordion?', a: 'A vertically stacked list of headers that reveal or hide content.' },
  { id: 'b', q: 'Single or multiple open?', a: 'Both are valid. This one allows multiple; set `single` to enforce one.' },
  { id: 'c', q: 'Why buttons?', a: 'Headers must be <button> so they are focusable and keyboard-operable for free.' },
]

export default function Accordion({ single = false }) {
  const [open, setOpen] = useState(() => new Set(['a']))
  const headerRefs = useRef([])

  const toggle = (id) =>
    setOpen((prev) => {
      const next = single ? new Set() : new Set(prev)
      if (prev.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // Roving arrow-key navigation between headers.
  const onKeyDown = (e, index) => {
    const map = { ArrowDown: 1, ArrowUp: -1 }
    if (e.key in map) {
      e.preventDefault()
      const next = (index + map[e.key] + ITEMS.length) % ITEMS.length
      headerRefs.current[next]?.focus()
    }
    if (e.key === 'Home') { e.preventDefault(); headerRefs.current[0]?.focus() }
    if (e.key === 'End') { e.preventDefault(); headerRefs.current[ITEMS.length - 1]?.focus() }
  }

  return (
    <div className="acc">
      {ITEMS.map((item, i) => {
        const isOpen = open.has(item.id)
        return (
          <div key={item.id} className="acc-item">
            <h3 style={{ margin: 0 }}>
              <button
                ref={(el) => (headerRefs.current[i] = el)}
                className="acc-header"
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
                id={`header-${item.id}`}
                onClick={() => toggle(item.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <span>{item.q}</span>
                <span className="acc-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </h3>
            <div
              id={`panel-${item.id}`}
              role="region"
              aria-labelledby={`header-${item.id}`}
              className="acc-panel"
              hidden={!isOpen}
            >
              {item.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}
